from flask import Flask
from .auth import auth_bp  # Import authentication blueprint

def init_app(app: Flask):
    """Function to register all blueprints in the application."""
    app.register_blueprint(auth_bp, url_prefix="/auth")
