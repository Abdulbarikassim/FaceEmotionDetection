from flask import Flask
from .auth import auth_bp  # Import authentication blueprint
from .history import history_bp  # Import save/history blueprint

def init_app(app: Flask):
    """Function to register all blueprints in the application."""
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(history_bp, url_prefix="/api")
