from flask import Flask, send_from_directory, jsonify, request, session, redirect, Response, stream_with_context
from flask_cors import CORS
import google.generativeai as genai
import os
from flask_session import Session
from dotenv import load_dotenv

load_dotenv()

app = Flask (__name__, static_folder='dist', static_url_path='')

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


@app.route("/")
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')




@app.route("/api/register", methods=["POST"])
def register():
    return jsonify()



@app.route("/api/login", methods=["GET","POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "")
    if not email:
        print('no Messages provided')
        return jsonify({"error":"No message provided"}),400


def stream_response_generator(user_message):
    if not model:
        yield "Error: AI model not initialized."
        return

    try:
        # هنا بنفعل الـ stream=True
        response_stream = model.generate_content(
            user_message,
            stream=True
        )

        # response_stream ده iterable من الـ chunks
        for chunk in response_stream:
            # debug server-side so you can confirm chunks as they arrive
            print("GENAI_CHUNK:", getattr(chunk, "text", repr(chunk)[:200]))
            # بعض الإصدارات بتبقى chunk.text موجودة، وبعضها محتاجة chunk.text أو chunk.candidates[0].content.parts ...
            if hasattr(chunk, "text") and chunk.text:
                yield chunk.text
            else:
                # احتياط لو رجع بتركيب مختلف
                try:
                    txt = "".join([
                        p.text for p in chunk.candidates[0].content.parts 
                        if hasattr(p, "text")
                    ])
                    if txt:
                        yield txt
                except Exception:
                    pass

    except Exception as e:
        print("STREAM_ERROR:", e)
        yield f"\n[STREAM_ERROR] - {str(e)}"


@app.route("/stream-test")
def stream_test():
    def gen():
        import time
        for i in range(6):
            yield f"test-chunk-{i} "
            print("SENT_TEST_CHUNK", i)
            time.sleep(0.5)
    return Response(stream_with_context(gen()), mimetype="text/plain")

        
if __name__ == "__main__":
    # disable the reloader (prevents multiple processes) and enable threaded streaming
    app.run(debug=True, port=5002, use_reloader=False, threaded=True)