import os 
from dotenv import load_dotenv


load_dotenv()

class Config(): 
    
    MONGO_URL = os.getenv("MONGO_URL")
    JWT_SECRET_KEY =os.getenv("JWT_SECRET_KEY")
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER")
    