from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask (__name__, static_folder='dist', static_url_path='')

CORS(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


@app.route("/")
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/api/data", methods=["GET"])
def get_data():
    return jsonify({"message": "Hello from Flask + React!"})




@app.route('/api/message', methods=['POST'])
def handel_message():
    try:
        data = request.get_json()
        user_message = data.get("message","")
        if not user_message:
            return jsonify({"error":"No message provided"}),400
        response = model.generate_content(user_message)

        reply = response.text.strip()

        return jsonify({"reply": reply})
    except Exception as e:
        print("Error:", 4)
        return jsonify({"error": str(e)}),500
        

        
if __name__ == "__main__":
    app.run(debug=True)