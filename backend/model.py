from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime


mongo = PyMongo()

def init_db(app): 
    """Initialize mongoDB with flask app """
    mongo.init_app(app)
    create_collection()

def create_collection(): 
    """Ensuring required collections exist with indexes"""
    db = mongo.db 
    existing_collections = db.list_collection_names()

    if "users" not in existing_collections:
        db.create_collection("users")
        db.users.create_index("username", unique=True)

    if "emotion_history" not in existing_collections:
        db.create_collection("emotion_history")
        db.emotion_history.create_index("user_id")

def get_user_collection(): 
    """Return the user collection """
    from app import mongo_db
    return mongo_db["users"]
def get_emotion_history():
    from app import mongo_db
    return mongo_db["emotion_history"]

def create_user(username, email,password_hash): 
    """Insert a new user into the users collection"""
    users = get_user_collection()
    
    # Ensure unique username
    if users.find_one({"username": username}):
        return None 
    
    user_id = users.insert_one(
        {
            "username": username, 
            "email" : email ,
            "hashed_password": password_hash 
        }
    ).inserted_id
    return str(user_id)
# finding the user by username 

def find_user_by_username(username): 
    """Find user by username"""
    users = get_user_collection()
    return users.find_one({"username": username})

# finding the user by email 
def find_user_by_email(email): 
    """Find user by username"""
    users = get_user_collection()
    return users.find_one({"email": email})
def save_emotion_history(user_id, image_path, emotion): 
    """Save detected emotion and image path for a user in emotion_history"""
    history = get_emotion_history()
    
    history.insert_one({
         # Link to user
        "user_id": ObjectId(user_id), 
        # Path to stored image
        "image_path": image_path,  
        # Recognized emotion
        "detected_emotion": emotion,  
        # Store time of detection
        "timestamp": datetime.utcnow()  
    })

def get_user_emotion_history(user_id): 
    """Retrieve all emotion history for a specific user"""
    history = get_emotion_history()
    
    return list(history.find({"user_id": ObjectId(user_id)}))
