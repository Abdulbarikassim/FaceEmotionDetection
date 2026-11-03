import base64

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from model import parse_uuid, save_emotion_history, get_user_emotion_history, delete_emotion_history
from storage import upload_image, delete_image

# Emotion detection itself runs in the browser; the backend only stores results
history_bp = Blueprint('history', __name__)

# Route to save detected emotion
@history_bp.route('/save', methods=['POST'])
@jwt_required()
def save_emotion():
    user_id = parse_uuid(get_jwt_identity())
    if user_id is None:
        return jsonify({"error": "Invalid token, please sign in again"}), 401

    data = request.json
    if not data or "emotion" not in data or "image_base64" not in data:
        return jsonify({"error": "Invalid data"}), 400

    try:
        image_bytes = base64.b64decode(data["image_base64"])
    except Exception as e:
        return jsonify({"error": f"Invalid base64 encoding: {str(e)}"}), 400

    # Upload the image to Supabase Storage, then save the record pointing to it
    try:
        image_path, image_url = upload_image(image_bytes, user_id)
    except Exception as e:
        print(f"Error uploading image: {str(e)}")
        return jsonify({"error": "Could not store the image"}), 500

    try:
        save_emotion_history(user_id, data["emotion"], image_path, image_url)
    except Exception as e:
        # Don't leave an orphan file in the bucket
        print(f"Error saving emotion: {str(e)}")
        delete_image(image_path)
        return jsonify({"error": "Could not save the emotion"}), 500

    return jsonify({"message": "Emotion saved successfully"}), 200

# Get Emotion History
@history_bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    user_id = parse_uuid(get_jwt_identity())
    if user_id is None:
        return jsonify({"error": "Invalid token, please sign in again"}), 401

    history_list = [
        {
            "_id": str(record.id),
            "image_url": record.image_url,
            "emotion": record.detected_emotion
        }
        for record in get_user_emotion_history(user_id)
    ]

    return jsonify(history_list), 200

# Delete Emotion History by ID
@history_bp.route('/history/<emotion_id>', methods=['DELETE'])
@jwt_required()
def delete_emotion(emotion_id):
    user_id = parse_uuid(get_jwt_identity())
    if user_id is None:
        return jsonify({"error": "Invalid token, please sign in again"}), 401

    record_id = parse_uuid(emotion_id)
    if record_id is None:
        return jsonify({"error": "Invalid emotion id"}), 400

    image_path = delete_emotion_history(user_id, record_id)

    if image_path is None:
        return jsonify({"error": "Emotion not found or not authorized"}), 404

    # Record is gone; also remove its image file from the bucket
    delete_image(image_path)

    return jsonify({"message": "Emotion deleted successfully"}), 200
