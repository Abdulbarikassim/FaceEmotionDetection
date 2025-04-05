import React, { useState, useEffect } from "react";
import { getEmotionHistory } from "../api/api";

const History = () => {
  const [emotions, setEmotions] = useState([]);
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
    <div className="grid grid-cols-3 gap-4 p-4">
      {emotions.map((emotion, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 border rounded-lg shadow-md"
        >
          <img
            src={emotion.image}
            alt="Emotion"
            className="w-12 h-12 object-cover rounded-full"
          />
          <span className="text-lg">{emotion.emotion}</span>
        </div>
      ))}
    </div>
  );
};

export default History;
