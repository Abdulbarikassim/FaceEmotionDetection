import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from routes import init_app
from flask_cors import CORS
from config import Config
from db import init_db
from storage import ensure_bucket

app = Flask(__name__)

CORS(app)

app.config.from_object(Config)

# Set up JWT authentication
jwt = JWTManager(app)

# Set up Supabase: create tables (with RLS) and the image bucket if missing
init_db()
ensure_bucket()

# Initialize routes (auth + save/history; emotion detection runs in the browser)
init_app(app)

# Testing initial route
@app.route('/', methods=['GET'])
def home():
    return "Hello, Flask"

# Health check route
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "OK"})

# Local development only; in production gunicorn imports `app` directly
if __name__ == '__main__':
    app.run(
        debug=os.getenv("FLASK_DEBUG") == "1",
        host='0.0.0.0',
        port=int(os.getenv("PORT", 3000)),
    )
