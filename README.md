# FaceEmotionDetection

A full-stack facial emotion recognition project that detects emotions from uploaded face images and presents the results through a React frontend and Flask backend.

The project explores multiple deep-learning approaches for emotion classification, including MobileNet-based models and a custom CNN, and packages them into a web application with user authentication and emotion history tracking.

## Overview

This repository combines:
- A Python/TensorFlow emotion recognition pipeline
- A Flask API for model inference and user/auth features
- A React + Vite frontend for interaction and visualization
- MongoDB storage for user accounts and saved emotion history
- Training notebooks for model experimentation

## Key Features

- Face emotion classification from uploaded images
- JWT-based authentication for signup/signin/logout
- Emotion history saved per user
- REST API endpoints for detection and data management
- Multiple notebook experiments for model training and evaluation
- Responsive frontend with a simple user interface

## Tech Stack

### Backend
- Python
- Flask
- TensorFlow / Keras
- OpenCV
- NumPy
- Pillow
- MongoDB
- Flask-JWT-Extended

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS

## Repository Structure

```bash
FaceEmotionDetection/
├── backend/
│   ├── detection/
│   │   └── detection.py
│   ├── routes/
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── __pycache__/
│   ├── app.py
│   ├── config.py
│   ├── model.py
│   ├── modelsTrained/
│   └── train_models/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── custom_CovNet_fer.ipynb
├── mobileNetV2.ipynb
├── mobileNetV3small.ipynb
├── .gitignore
├── README.md
└── .DS_Store
```

## Model and Training

The project includes several experimentation notebooks:

- `mobileNetV2.ipynb` — MobileNetV2-based preprocessing and model workflow
- `mobileNetV3small.ipynb` — MobileNetV3Small experimentation
- `custom_CovNet_fer.ipynb` — custom CNN approach for FER

These notebooks prepare the face data, resize it, normalize it, and train classification models on the emotion dataset used by the project.

## Backend API

The Flask backend exposes endpoints for authentication and emotion recognition.

### Authentication
- `POST /api/signup` — create a new user
- `POST /api/signin` — sign in and receive a JWT token
- `POST /api/logout` — invalidate session / logout

### Detection
- `POST /api/detect` — submit an image and receive the predicted emotion
- `POST /api/save` — save detected emotion history for a user
- `GET /api/history` — fetch user's emotion detection history
- `DELETE /api/history/<emotion_id>` — remove a saved record

## Environment Variables

Create environment variables for the backend, typically in a `.env` file within `backend/`:

```bash
MONGO_URL="mongodb+srv://<username>:<password>@<cluster-url>/<database>"
JWT_SECRET_KEY="your-secret-key"
UPLOAD_FOLDER="/path/to/uploads"
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Abdulbarikassim/FaceEmotionDetection.git
cd FaceEmotionDetection
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install flask flask-cors flask-jwt-extended flask-pymongo pymongo python-dotenv tensorflow opencv-python pillow numpy pandas certifi
```

Then start the API:

```bash
python app.py
```

The backend runs on `http://localhost:3000` by default.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend is served with Vite and usually runs on:

```bash
http://localhost:5173
```

## Usage

1. Start the backend server.
2. Start the frontend development server.
3. Sign up or sign in.
4. Upload a face image or use the detection flow.
5. View the detected emotion and saved history.

## Notes

- The application is designed for experimentation and academic/demo use.
- Model files are expected to be located in the backend model directories as part of the trained pipeline.
- MongoDB connectivity and environment variables must be configured before running the app in a real environment.

## Future Improvements

- Add real-time webcam detection
- Improve model accuracy with more balanced training data
- Add visualization charts for emotion history
- Introduce deployment-ready configuration for Docker or cloud hosting

## Project Status

This project is an active prototype that demonstrates emotion recognition using deep learning and a web-based interface.
