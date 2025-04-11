import os
import numpy as np
import tensorflow as tf
from PIL import Image
from io import BytesIO
import base64
import cv2
import io

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

# Load OpenCV's pre-trained face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def preprocess(image_bytes):
    try:
        # Read image as OpenCV BGR format
        image_array = np.asarray(bytearray(image_bytes), dtype=np.uint8)
        img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

        if len(faces) == 0:
            print("No face detected.")
            return None

        # Crop the first detected face
        x, y, w, h = faces[0]
        face = gray[y:y+h, x:x+w]
        face_resized = cv2.resize(face, (48, 48)) / 255.0
        face_resized = np.expand_dims(face_resized, axis=-1)
        face_resized = np.expand_dims(face_resized, axis=0)

        return face_resized
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
        {
            "_id": str(record["_id"]),
            "image_base64": record["image_base64"],
            "emotion": record["detected_emotion"]
        }
        for record in user_history
    ]
    
    return jsonify(history_list), 200

# Delete Emotion History by ID
@detection_bp.route('/history/<emotion_id>', methods=['DELETE'])
@jwt_required()
def delete_emotion(emotion_id):
    user_id = get_jwt_identity()
    history = get_emotion_history()

    result = history.delete_one({
        "_id": ObjectId(emotion_id),
        "user_id": ObjectId(user_id)
    })

    if result.deleted_count == 0:
        return jsonify({"error": "Emotion not found or not authorized"}), 404

    return jsonify({"message": "Emotion deleted successfully"}), 200
