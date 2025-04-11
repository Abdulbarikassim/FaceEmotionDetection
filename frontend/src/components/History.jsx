import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEmotionHistory, deleteEmotionById } from "../api/api";
import { FaRegSmile } from "react-icons/fa"; // Assuming you want to use a cabbage-like icon

const History = () => {
  const [emotions, setEmotions] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null); // Track expanded image
  const navigate = useNavigate();

  const handleDelete = async (id, index) => {
    if (!id) {
      console.error("Invalid emotion ID:", id);
      return;
    }
    try {
      console.log("Deleting emotion with ID:", id);
      await deleteEmotionById(id);
      const updatedEmotions = [...emotions];
      updatedEmotions.splice(index, 1);
      setEmotions(updatedEmotions);
      if (updatedEmotions.length === 0) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting emotion:", error);
    }
  };

  const handleImageClick = (index) => {
    setExpandedImage(expandedImage === index ? null : index); // Toggle image expansion
  };

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const data = await getEmotionHistory();
        setEmotions(data);
      } catch (error) {
        console.error("Error fetching emotions:", error);
      }
    };

    fetchEmotions();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {emotions.map((emotion, index) => {
        return (
          <div
            key={index}
            className={`flex flex-col items-center justify-center space-y-4 p-4 border rounded-lg shadow-md ${
              expandedImage === index ? "col-span-2" : ""
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <img
                src={`data:image/jpeg;base64,${emotion.image_base64}`}
                alt="Emotion"
                className={`w-48 h-48 object-cover rounded cursor-pointer ${
                  expandedImage === index ? "w-full h-auto" : ""
                }`}
                onClick={() => handleImageClick(index)} // Add image click handler
              />
              <span className="text-lg">{emotion.emotion}</span>
            </div>
            <button
              onClick={() => handleDelete(emotion._id || null, index)}
              className="text-white border-2 p-2 rounded-full bg-red-600 flex items-center space-x-2"
            >
              <FaRegSmile />
              <span>Delete</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default History;
