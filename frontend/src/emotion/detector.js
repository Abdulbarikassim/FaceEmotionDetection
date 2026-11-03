// Emotion detection that runs fully in the browser:
// MediaPipe finds the face, then our TensorFlow.js model classifies the emotion.
import * as tf from "@tensorflow/tfjs";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

// Keep this version in sync with @mediapipe/tasks-vision in package.json
const MEDIAPIPE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/wasm";
const EMOTION_MODEL_URL = "/models/emotion/model.json";
const FACE_MODEL_URL = "/models/face/blaze_face_short_range.tflite";

// Same order the model was trained with
const EMOTION_LABELS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"];
const INPUT_SIZE = 48;

let emotionModelPromise = null;
let faceDetectorPromise = null;

function loadEmotionModel() {
  if (!emotionModelPromise) {
    emotionModelPromise = tf.loadGraphModel(EMOTION_MODEL_URL);
  }
  return emotionModelPromise;
}

function loadFaceDetector() {
  if (!faceDetectorPromise) {
    faceDetectorPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
      return FaceDetector.createFromOptions(vision, {
        baseOptions: { modelAssetPath: FACE_MODEL_URL },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.5,
      });
    })();
  }
  return faceDetectorPromise;
}

// Download both models once (cached by the browser afterwards)
export function preloadModels() {
  const loading = Promise.all([loadEmotionModel(), loadFaceDetector()]);
  // Allow a retry if a download failed
  loading.catch(() => {
    emotionModelPromise = null;
    faceDetectorPromise = null;
  });
  return loading;
}

// Square box around the face (like OpenCV's detector), kept inside the image
function squareFaceBox(box, imageWidth, imageHeight) {
  const size = Math.min(Math.max(box.width, box.height), imageWidth, imageHeight);
  const centerX = box.originX + box.width / 2;
  const centerY = box.originY + box.height / 2;
  const x = Math.min(Math.max(centerX - size / 2, 0), imageWidth - size);
  const y = Math.min(Math.max(centerY - size / 2, 0), imageHeight - size);
  return { x, y, size };
}

// Takes a canvas with the captured frame; returns { emotion, confidence }
export async function detectEmotion(canvas) {
  const [model, faceDetector] = await preloadModels();

  const { detections } = faceDetector.detect(canvas);
  if (detections.length === 0) {
    throw new Error("No face detected. Make sure your face is visible and well lit.");
  }

  // Crop the first face and shrink it to 48x48, like the model was trained on
  const { x, y, size } = squareFaceBox(detections[0].boundingBox, canvas.width, canvas.height);
  const faceCanvas = document.createElement("canvas");
  faceCanvas.width = INPUT_SIZE;
  faceCanvas.height = INPUT_SIZE;
  faceCanvas.getContext("2d").drawImage(canvas, x, y, size, size, 0, 0, INPUT_SIZE, INPUT_SIZE);

  const prediction = tf.tidy(() => {
    const rgb = tf.browser.fromPixels(faceCanvas).toFloat();
    // Grayscale with the same weights OpenCV uses, scaled to 0..1
    const gray = rgb.mul([0.299, 0.587, 0.114]).sum(-1, true).div(255);
    return model.predict(gray.expandDims(0));
  });
  const scores = await prediction.data();
  prediction.dispose();

  let best = 0;
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > scores[best]) best = i;
  }
  return { emotion: EMOTION_LABELS[best], confidence: scores[best] };
}
