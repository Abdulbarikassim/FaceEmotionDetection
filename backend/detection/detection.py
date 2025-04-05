import os
import numpy as np
import tensorflow as tf
from PIL import Image
from io import BytesIO
import base64

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId

from config import Config
from model import get_emotion_history

detection_bp = Blueprint('detect', __name__)

# Model path and initialization
MODEL_PATH = '/Users/abdulbari/Desktop/Uniwork/UG-PROJECT/FacilalRecognitionProject/webapp/backend/modelsTrained/fine_tuned_model2_ck.h5'
model = None

# Emotion labels
EMOTION_LABELS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Load model once when app starts
def load_model():
    global model
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model path not found {MODEL_PATH}")
        return
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading the model: {str(e)}")

load_model()

# Preprocess function
def preprocess(image_bytes):
    try:
        image = Image.open(BytesIO(image_bytes))
        if image.mode != 'L':
            image = image.convert('L')
        image = image.resize((48, 48))
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=-1)
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        print(f"Error preprocessing image: {str(e)}")
        return None

# Route to detect emotion without saving
@detection_bp.route('/detect', methods=['POST'])
@jwt_required()
def detect():
    image_bytes = None

    # Handle file upload
    if "file" in request.files:
        file = request.files["file"]
        image_bytes = file.read()
    # Handle base64 image
    elif "image_base64" in request.json:
        try:
            image_bytes = base64.b64decode(request.json["image_base64"])
        except Exception as e:
            return jsonify({"error": f"Invalid base64 encoding: {str(e)}"}), 400
    else:
        return jsonify({"error": "No image provided"}), 400

    # Preprocess image
    img_array = preprocess(image_bytes)
    if img_array is None:
        return jsonify({"error": "Error processing the image"}), 500

    # Ensure model is loaded
    if model is None:
        load_model()
    
  # Predict emotion
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction)  
    detected_emotion = EMOTION_LABELS[predicted_class]
    confidence = float(prediction[0][predicted_class])  # Convert to float for JSON

    return jsonify({
        "message": "Successfully Emotion detected",
        "emotion": detected_emotion,
        "confidence": confidence
    }), 200

# Route to save detected emotion
@detection_bp.route('/save', methods=['POST'])
@jwt_required()
def save_emotion():
    user_id = get_jwt_identity()
    data = request.json

    if not data or "emotion" not in data or "image_base64" not in data:
        return jsonify({"error": "Invalid data"}), 400

    history = get_emotion_history()
    history.insert_one({
        "user_id": ObjectId(user_id),
        "detected_emotion": data["emotion"],
        "image_base64": data["image_base64"]
    })

    return jsonify({"message": "Emotion saved successfully"}), 200

# Get Emotion History
@detection_bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    user_id = get_jwt_identity()
    history = get_emotion_history()

    user_history = history.find({"user_id": ObjectId(user_id)})
    history_list = [
        {"image_base64": record["image_base64"], "emotion": record["detected_emotion"]}
        for record in user_history
    ]
    
    return jsonify(history_list), 200
