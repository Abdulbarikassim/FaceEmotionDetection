import React, { useState, useRef, useCallback, useEffect } from "react";
import { Camera, RotateCcw, Save } from "lucide-react";
import { getEmotionPrediction, saveEmotionResult } from "../api/api";

const Home = () => {
  const [emotion, setEmotion] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError(
        "Error accessing camera. Please make sure you have granted camera permissions."
      );
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        return imageData;
      }
    }
    return null;
  }, []);

  const captureEmotion = async () => {
    setError(null);
    setLoading(true);
    const imageData = captureImage();

    if (imageData) {
      try {
        const result = await getEmotionPrediction(imageData);
        setEmotion(result.emotion);
        setConfidence(result.confidence);
      } catch (error) {
        setError(error.message || "Error detecting emotion");
        console.error("Error detecting emotion:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const restartCamera = () => {
    setCapturedImage(null);
    setEmotion(null);
    setConfidence(null);
    setError(null);
    stopCamera();
    startCamera();
  };

  const saveEmotion = async () => {
    if (!capturedImage || !emotion) return;

    setError(null);
    setLoading(true);
    try {
      await saveEmotionResult(capturedImage, emotion);
    } catch (error) {
      setError(error.message || "Error saving emotion");
      console.error("Error saving emotion:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            ) : (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={captureEmotion}
              disabled={!!capturedImage || loading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="h-5 w-5" />
              <span>{loading ? "Processing..." : "Capture Emotion"}</span>
            </button>

            <button
              onClick={restartCamera}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Restart Camera</span>
            </button>

            {emotion && (
              <button
                onClick={saveEmotion}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span>{loading ? "Saving..." : "Save Result"}</span>
              </button>
            )}
          </div>

          {emotion && (
            <div className="mt-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Detected emotion:
              </h2>
              <p className="text-4xl font-bold text-blue-600 mt-2">{emotion}</p>
              {confidence !== null && (
                <p className="text-lg text-gray-600 mt-2">
                  Confidence: {(confidence * 100).toFixed(2)}%
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
