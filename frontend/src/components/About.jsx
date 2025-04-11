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
              This Facial Emotion Recognition project utilizes deep learning
              techniques to detect and classify human emotions from facial
              expressions using the FER2013 dataset. The system is designed to
              compare three different model architectures: a custom CNN and
              MobileNet, But Now the systems using a custom cnn with four layers
              to detect emotions in real-time.The goal is to identify the most
              accurate and efficient model for real-time emotion detection
              applications. The backend is powered by Flask and TensorFlow/Keras
              for inference, while the frontend uses React for a responsive user
              interface. This project also includes integration with a secure
              authentication system, making it suitable for deployment in
              real-world scenarios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About Me
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>Hi there! 👋</p>
              <p>
                I'm <strong>@Abdulbarikassim</strong>, an aspiring backend
                engineer and tech enthusiast with a Bachelor's degree in
                Information Technology from Middlesex University Dubai 🎓.
                Currently in my final year, I’m exploring the depths of web
                development, machine learning, and artificial intelligence.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">
                🌟 About Me
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  🔧 Proficient in <strong>Node.js</strong>,{" "}
                  <strong>MongoDB</strong>, <strong>Express.js</strong>,{" "}
                  <strong>C++</strong>, and <strong>Python</strong>.
                </li>
                <li>
                  🤖 Passionate about <strong>machine learning</strong> and
                  recently built a handwritten digit recognition model using{" "}
                  <strong>NumPy</strong> from scratch.
                </li>
                <li>
                  🌐 Experienced with <strong>Vue.js</strong> and{" "}
                  <strong>React.js</strong> for frontend development and
                  building RESTful APIs.
                </li>
                <li>
                  🚀 Currently working on exciting projects, including
                  AI-powered solutions for industries like ENOC.
                </li>
                <li>
                  💻 Eager to contribute to open-source projects and collaborate
                  on impactful tech innovations.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">
                🛠️ Skills
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Languages:</strong> Python, JavaScript, SQL, C++
                </li>
                <li>
                  <strong>Frameworks:</strong> Express.js, Vue.js, Flask, Django
                </li>
                <li>
                  <strong>Databases:</strong> MongoDB (Atlas)
                </li>
                <li>
                  <strong>Tools:</strong> Git, Docker, VS Code
                </li>
                <li>
                  <strong>Concepts:</strong> Neural Networks, Backend
                  Development, API Design, Middleware, Routing, and Deep
                  Learning
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">
                🎯 Goals
              </h3>
              <p>Transition into a backend engineer role post-graduation.</p>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">
                📫 Let's connect!
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  🌍{" "}
                  <a
                    href="https://www.linkedin.com/in/abdulbari-kassim-a86726300/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  🐦{" "}
                  <a
                    href="https://www.instagram.com/abdi6ari/profilecard/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
