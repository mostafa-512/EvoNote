from flask import Flask, send_from_directory, jsonify, request
import os

app = Flask (__name__, static_folder='dist', static_url_path='')


@app.route("/")
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/api/data")
def get_data():
    return jsonify({"message": "Hello from Flask + React!"})

if __name__ == "__main__":
    app.run(debug=True)