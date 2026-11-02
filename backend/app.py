import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
import detection.detection as detection_module
from detection.detection import detection_bp
from routes import init_app
from routes.auth import auth_bp
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

# Initialize routes
init_app(app)
app.register_blueprint(detection_bp, url_prefix="/api")

# Testing initial route
@app.route('/', methods=['GET'])
def home():
    return "Hello, Flask"

# Health check route
@app.route('/health', methods=['GET'])
def health_check():
    # Read through the module so this reflects the model even if it was (re)loaded later
    return jsonify({"status": "OK", "model_loaded": detection_module.model is not None})

# Local development only; in production gunicorn imports `app` directly (see Dockerfile).
# The model is already loaded when detection.py is imported.
if __name__ == '__main__':
    app.run(
        debug=os.getenv("FLASK_DEBUG") == "1",
        host='0.0.0.0',
        port=int(os.getenv("PORT", 3000)),
    )
