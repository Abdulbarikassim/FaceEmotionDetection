import uuid

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from db import SessionLocal, User, EmotionHistory


def parse_uuid(value):
    """Return a UUID, or None if the value isn't a valid id (e.g. an old MongoDB token)"""
    try:
        return uuid.UUID(str(value))
    except ValueError:
        return None

def _user_to_dict(user):
    """Return the user in the same shape the auth routes expect"""
    if user is None:
        return None
    return {
        "_id": user.id,
        "username": user.username,
        "email": user.email,
        "hashed_password": user.hashed_password,
    }

def create_user(username, email, password_hash):
    """Insert a new user into the users table"""
    with SessionLocal() as session:
        user = User(username=username, email=email, hashed_password=password_hash)
        session.add(user)
        try:
            session.commit()
        except IntegrityError:
            # Username or email already taken
            session.rollback()
            return None
        return str(user.id)

# finding the user by username
def find_user_by_username(username):
    """Find user by username"""
    with SessionLocal() as session:
        return _user_to_dict(session.scalar(select(User).where(User.username == username)))

# finding the user by email
def find_user_by_email(email):
    """Find user by email"""
    with SessionLocal() as session:
        return _user_to_dict(session.scalar(select(User).where(User.email == email)))

def save_emotion_history(user_id, emotion, image_path, image_url):
    """Save detected emotion and the stored image for a user"""
    with SessionLocal() as session:
        record = EmotionHistory(
            user_id=user_id,
            detected_emotion=emotion,
            image_path=image_path,
            image_url=image_url,
        )
        session.add(record)
        session.commit()
        return str(record.id)

def get_user_emotion_history(user_id):
    """Retrieve all emotion history for a specific user, oldest first"""
    with SessionLocal() as session:
        return list(session.scalars(
            select(EmotionHistory)
            .where(EmotionHistory.user_id == user_id)
            .order_by(EmotionHistory.created_at)
        ))

def delete_emotion_history(user_id, emotion_id):
    """Delete one history record owned by the user; returns its image path, or None if not found"""
    with SessionLocal() as session:
        record = session.scalar(
            select(EmotionHistory).where(
                EmotionHistory.id == emotion_id,
                EmotionHistory.user_id == user_id,
            )
        )
        if record is None:
            return None
        image_path = record.image_path
        session.delete(record)
        session.commit()
        return image_path
