from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from werkzeug.security import generate_password_hash, check_password_hash
from model import create_user, find_user_by_username, find_user_by_email
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def register():
    username = request.json.get('username', None)
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Check if the user already exists by email or username
    existing_user = find_user_by_username(username)
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    existing_email = find_user_by_email(email) 
    if existing_email:
        return jsonify({"error": "Email already exists"}), 400

    password_hash = generate_password_hash(password)
    user_id = create_user(username, email, password_hash)

    if user_id is None:
        return jsonify({"error": "An error occurred during registration"}), 500

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/signin', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not email or not password:
        return jsonify({"error": "Missing username or password"}), 400

    user = find_user_by_email(email)
    if not user or not check_password_hash(user["hashed_password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity=str(user["_id"]),
        expires_delta=timedelta(days=3)
    )
    return jsonify({
        "message": "Login successful",
        "access_token": access_token
    }), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required() 
def logout():
    response = jsonify({"message": "Successfully logged out"})
    unset_jwt_cookies(response)
    return response, 200
