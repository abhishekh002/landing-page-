import os

from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()

from agent import ask_sync

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json(force=True, silent=True) or {}
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"error": "Message is required"}), 400
    try:
        reply = ask_sync(message)
        return jsonify({"response": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "5002")),
        debug=os.environ.get("FLASK_DEBUG", "").lower() == "true",
    )
