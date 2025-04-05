import React from "react";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          About Emotion AI
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About the Project
            </h2>
            <p className="text-gray-600">
              [Project details will be added later]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About Me
            </h2>
            <p className="text-gray-600">
              [Personal details will be added later]
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
