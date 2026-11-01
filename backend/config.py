import os
from dotenv import load_dotenv


load_dotenv()

class Config():

    DATABASE_URL = os.getenv("DATABASE_URL")
    JWT_SECRET_KEY =os.getenv("JWT_SECRET_KEY")
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER")
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")
    STORAGE_BUCKET = os.getenv("STORAGE_BUCKET", "emotion-images")
