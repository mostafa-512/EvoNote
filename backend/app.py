from flask import Flask, send_from_directory, jsonify, request, Response, stream_with_context
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import google.generativeai as genai
import sqlite3
import bcrypt
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')
CORS(app)

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-super-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=60)
jwt = JWTManager(app)

DB_PATH = 'evo_note.db'

SYSTEM_PROMPT = """You are Evo, a professional assistant specialized in helping users summarize and refine their ideas.
Your role is to:
- Listen carefully to user ideas and thoughts
- Provide clear, concise summaries
- Ask clarifying questions when needed
- Suggest improvements and refinements
- Be encouraging and supportive
- Maintain a professional yet friendly tone
- Never provide illegal, harmful, or unethical advice

Always prioritize clarity, brevity, and actionable insights."""

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

# DB helpers (unchanged)
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
# Made with ChatGPT
def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            sender TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_user ON history(user_id)')
    conn.commit()
    conn.close()

def query_db(query, args=(), one=False):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(query, args)
    result = cursor.fetchall()
    conn.close()
    return (result[0] if result else None) if one else result

def execute_db(query, args=()):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(query, args)
    conn.commit()
    last_id = cursor.lastrowid
    conn.close()
    return last_id

# Made with ChatGPT
# bcrypt helpers
def hash_password(plain_password: str) -> bytes:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_password.encode('utf-8'), salt)

def check_password(plain_password: str, hashed: bytes) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed)

# Routes (register, login, history unchanged except behavior)
@app.route("/")
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/api/ping", methods=["GET"])
def ping():
    return jsonify({"msg": "pong"}), 200

@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.get_json(silent=True) or {}
        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()
        if not name or not email or not password:
            return jsonify({"msg": "All fields (name, email, password) are required"}), 400
        if "@" not in email:
            return jsonify({"msg": "Invalid email format"}), 400
        existing_user = query_db('SELECT id FROM users WHERE email = ?', (email,), one=True)
        if existing_user:
            return jsonify({"msg": "Email already registered"}), 409
        hashed_password = hash_password(password)
        user_id = execute_db(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            (name, email, hashed_password)
        )
        # Create JWT token (store identity as string to satisfy PyJWT/sub requirement)
        access_token = create_access_token(identity=str(user_id))
        return jsonify({
            "msg": "registered",
            "token": access_token,
            "user": {"id": user_id, "name": name, "email": email}
        }), 201
    except Exception as e:
        print(f"Register Error: {e}")
        return jsonify({"msg": "Server error during registration"}), 500
@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json(silent=True) or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()
        if not email or not password:
            return jsonify({"msg": "Email and password are required"}), 400
        user = query_db('SELECT id, name, email, password FROM users WHERE email = ?', (email,), one=True)
        if not user:
            return jsonify({"msg": "Invalid credentials"}), 401
        if not check_password(password, user['password']):
            return jsonify({"msg": "Invalid credentials"}), 401
        access_token = create_access_token(identity=str(user['id']))
        return jsonify({
            "msg": "logged_in",
            "token": access_token,
            "user": {"id": user['id'], "name": user['name'], "email": user['email']}
        }), 200
    except Exception as e:
        print(f"Login Error: {e}")
        return jsonify({"msg": "Server error during login"}), 500
# Made with help from ChatGPT
@app.route("/api/history", methods=["GET"])
@jwt_required()
def get_history():
    try:
        user_id = get_jwt_identity()
        # tokens store identity as string; convert to int for DB queries
        if user_id is not None:
            try:
                user_id = int(user_id)
            except Exception:
                pass
        history = query_db(
            'SELECT id, sender, message, timestamp FROM history WHERE user_id = ? ORDER BY timestamp ASC',
            (user_id,)
        )
        history_list = [
            {"id": row['id'], "sender": row['sender'], "message": row['message'], "timestamp": row['timestamp']}
            for row in history
        ]
        return jsonify({"history": history_list}), 200
    except Exception as e:
        print(f"History Error: {e}")
        return jsonify({"msg": "Server error fetching history"}), 500

def stream_response_generator(user_message, user_id=None):
    """
    Try streaming via model.generate_content(prompt, stream=True).
    If that fails (SDK / parameter mismatch), fall back to a synchronous genai.generate_text call
    and yield the complete reply once.
    """
    prompt = f"{SYSTEM_PROMPT}\n\nUser message: {user_message}"
    full_response = ""

    # Try streaming first (keeps previous behavior)
    try:
        response_stream = None
        try:
            # Try to call the model with the prompt string (some SDKs accept a string)
            response_stream = model.generate_content(prompt, stream=True)
        except Exception as ex_stream_init:
            print("generate_content(stream) init failed:", ex_stream_init)
            response_stream = None

        if response_stream:
            for chunk in response_stream:
                try:
                    chunk_text = getattr(chunk, "text", None)
                    if chunk_text:
                        full_response += chunk_text
                        yield chunk_text
                        continue
                    # fallback for other formats
                    try:
                        txt = "".join([p.text for p in chunk.candidates[0].content.parts if hasattr(p, "text")])
                        if txt:
                            full_response += txt
                            yield txt
                    except Exception:
                        # ignore chunk parsing errors
                        pass
                except Exception as inner:
                    print("Error processing stream chunk:", inner)
            # after streaming finished, save if authenticated
            if user_id:
                try:
                    execute_db('INSERT INTO history (user_id, sender, message) VALUES (?, ?, ?)', (user_id, 'user', user_message))
                    execute_db('INSERT INTO history (user_id, sender, message) VALUES (?, ?, ?)', (user_id, 'evo', full_response))
                except Exception as e:
                    print("Error saving history after stream:", e)
            return
    except Exception as e:
        print("Streaming attempt failed:", e)

    # Fallback: synchronous generation (non-streaming). This avoids SDK parameter mismatch errors.
    try:
        print("FALLBACK: Using genai.generate_text synchronous call")
        try:
            resp = genai.generate_text(model="gemini-2.5-flash", prompt=prompt)
            # resp may have .text attribute
            text = getattr(resp, "text", None)
            if not text:
                # try to stringify the object
                text = str(resp)
            full_response = text
            yield full_response
        except Exception as gen_text_err:
            print("genai.generate_text failed:", gen_text_err)
            # final fallback: simple echo summary
            fallback_reply = f"Evo could not generate a response at the moment. Summary idea: {user_message[:500]}"
            full_response = fallback_reply
            yield fallback_reply

        # Save to history if authenticated
        if user_id:
            try:
                execute_db('INSERT INTO history (user_id, sender, message) VALUES (?, ?, ?)', (user_id, 'user', user_message))
                execute_db('INSERT INTO history (user_id, sender, message) VALUES (?, ?, ?)', (user_id, 'evo', full_response))
            except Exception as e:
                print("Error saving history after fallback:", e)

    except Exception as e:
        print(f"STREAM_ERROR(final fallback): {e}")
        yield f"\n[ERROR] - {str(e)}"

@app.route("/api/chat", methods=["POST"])
@jwt_required(optional=True)
def chat():
    try:
        user_id = get_jwt_identity()
        user_id = get_jwt_identity()
        if user_id is not None:
            try:
                user_id = int(user_id)
            except Exception:
                pass
        data = request.get_json(silent=True) or {}
        message = data.get("message", "").strip()
        if not message:
            return jsonify({"msg": "message is required"}), 400
        return Response(stream_with_context(stream_response_generator(message, user_id)), mimetype='text/plain'), 200
    except Exception as e:
        print(f"Chat Error: {e}")
        return jsonify({"msg": "Server error during chat"}), 500

@app.route("/stream-test", methods=["GET"])
def stream_test():
    def gen():
        import time
        for i in range(6):
            yield f"test-chunk-{i} "
            print(f"SENT_TEST_CHUNK: {i}")
            time.sleep(0.5)
    return Response(stream_with_context(gen()), mimetype="text/plain")

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5002, use_reloader=False, threaded=True)
