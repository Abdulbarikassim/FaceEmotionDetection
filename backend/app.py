from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from detection.detection import load_model, model, detection_bp
from routes import init_app
from routes.auth import auth_bp  
from flask_cors import CORS
from config import Config
from pymongo import MongoClient
import certifi
import numpy as np

app = Flask(__name__)

CORS(app)

app.config.from_object(Config)

# Set up JWT authentication
jwt = JWTManager(app)

# set up mongoDB connection 

mongo_client = MongoClient(app.config["MONGO_URL"], tlsAllowInvalidCertificates=True)
mongo_db = mongo_client["EmotionAi"]

# get users 

# get users
user_collection = mongo_db["users"]
emotion_history_collection = mongo_db["emotion_history"]

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
    return jsonify({"status": "OK", "model_loaded": model is not None})

if __name__ == '__main__':
    # Load model on startup
    load_model()  
    import numpy as np

    # Build model metrics with dummy data to avoid warning
    dummy_input = np.zeros((1, 48, 48, 1))  
    dummy_label = np.zeros((1, 7))          
    model.evaluate(dummy_input, dummy_label, verbose=0)
    app.run(debug=True, host='0.0.0.0', port=3000)