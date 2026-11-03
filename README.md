# FaceEmotionDetection

A full-stack web app that recognises facial emotions from your webcam. It finds your face, predicts one of seven emotions, and lets you save results to a personal history.

**Live demo:** https://face-emotion-detection-dusky.vercel.app/
> The backend runs on a free plan and sleeps when nobody uses it, so the first sign-in after a quiet period can take up to a minute.

## Features

- Webcam emotion detection: Angry, Disgust, Fear, Happy, Sad, Surprise and Neutral
- Detection runs **in your browser**, so the camera image is only sent to the server if you choose to save it
- Sign up and sign in with JWT authentication
- Personal emotion history with saved snapshots, which you can delete at any time
- Responsive interface that works on laptop and phone

## How it works

```
Browser (React + Vite, hosted on Vercel)
 ├─ MediaPipe Face Detector   → finds the face in the webcam frame
 └─ TensorFlow.js CNN         → 48×48 greyscale crop → one of 7 emotions
        │
        │  sign in / save / history (JSON + JWT)
        ▼
Flask API (hosted on Render)
        │
        ▼
Supabase: PostgreSQL (users, history) + Storage (saved images)
```

- **Model:** a custom convolutional neural network trained in Keras on facial expression data (FER2013), then converted to TensorFlow.js so it runs client-side. The converted model gives the same outputs as the original Keras model.
- **Why in the browser:** running the model on the user's device keeps the backend small enough for a free host, gives instant results, and means photos never leave the device unless the user saves them.
- **Backend:** handles only accounts and history. Images are stored in a Supabase Storage bucket, and records in PostgreSQL with row-level security enabled.

## Tech stack

| Area | Tools |
|---|---|
| Frontend | React, Vite, Tailwind CSS, TensorFlow.js, MediaPipe Tasks Vision |
| Backend | Python, Flask, Flask-JWT-Extended, SQLAlchemy, gunicorn |
| Data | Supabase (PostgreSQL + Storage) |
| Machine learning | TensorFlow / Keras, Jupyter notebooks |
| Hosting | Vercel (frontend), Render (backend) |

## Repository structure

```
FaceEmotionDetection/
├── backend/
│   ├── app.py              # Flask app, health check, startup
│   ├── config.py           # Reads settings from environment variables
│   ├── db.py               # Database connection and tables
│   ├── model.py            # Database queries
│   ├── storage.py          # Supabase Storage uploads and deletes
│   ├── routes/
│   │   ├── auth.py         # Sign up, sign in, log out
│   │   └── history.py      # Save, list and delete emotion history
│   ├── modelsTrained/      # Original Keras models
│   └── requirements.txt
├── frontend/
│   ├── public/models/      # TensorFlow.js emotion model + face detector
│   └── src/
│       ├── emotion/detector.js   # Face detection + emotion prediction
│       ├── components/           # Home, History, About, Navbar, AuthForms
│       └── api/api.js            # Calls to the backend
├── custom_CovNet_fer.ipynb  # Custom CNN experiments
├── mobileNetV2.ipynb        # MobileNetV2 experiments
└── mobileNetV3small.ipynb   # MobileNetV3Small experiments
```

## API

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/signup` | Create an account | No |
| POST | `/auth/signin` | Sign in and receive a JWT | No |
| POST | `/auth/logout` | Log out | Yes |
| POST | `/api/save` | Save an emotion and its image | Yes |
| GET | `/api/history` | List your saved emotions | Yes |
| DELETE | `/api/history/<id>` | Delete a saved emotion | Yes |
| GET | `/health` | Health check | No |

## Run it locally

You need Python 3.13, Node.js and a free [Supabase](https://supabase.com) project.

### 1. Clone

```bash
git clone https://github.com/Abdulbarikassim/FaceEmotionDetection.git
cd FaceEmotionDetection
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # then fill in your own values
python app.py
```

The API runs on `http://localhost:3000`. On first start it creates the database tables and the storage bucket.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. To point the frontend at another backend, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL`.

## Deployment

- **Backend (Render, free web service):** root directory `backend`, build `pip install -r requirements.txt`, start `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --threads 4 --timeout 120`. Set the variables from `backend/.env.example` in the Render dashboard.
- **Frontend (Vercel):** root directory `frontend`, framework Vite, with `VITE_API_URL` set to the Render URL.

Secrets live only in the hosting dashboards and a local `.env` file, which is never committed.

## Model experiments

The notebooks compare several approaches to emotion classification:

- `custom_CovNet_fer.ipynb`: custom CNN (the model used in the app)
- `mobileNetV2.ipynb`: MobileNetV2 transfer learning
- `mobileNetV3small.ipynb`: MobileNetV3Small transfer learning

## Future improvements

- Charts that show emotion trends over time
- Better accuracy on under-represented emotions such as Disgust and Fear
- Live, continuous detection instead of single captures

## Author

**Abdulbari Kassim**, software engineer with a strong interest in design. [LinkedIn](https://www.linkedin.com/in/abdulbari-kassim-a86726300/) · [GitHub](https://github.com/Abdulbarikassim)
