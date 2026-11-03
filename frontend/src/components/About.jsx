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
            <div className="text-gray-600 space-y-4">
              <p>
                Emotion AI recognises facial expressions from your webcam and
                classifies them into seven emotions: angry, disgust, fear,
                happy, sad, surprise and neutral. I trained and compared
                several models on the FER2013 dataset, including MobileNetV2,
                MobileNetV3 and a custom convolutional neural network. The
                custom CNN gave the best balance of accuracy and speed, so it
                powers the app.
              </p>
              <p>
                The model runs directly in your browser with TensorFlow.js,
                and MediaPipe finds your face first. That makes results
                instant, and your photo only leaves your device when you
                choose to save it. A Flask backend handles secure sign-in and
                your saved history, which is stored in Supabase (PostgreSQL
                and file storage). The React frontend is hosted on Vercel and
                the API on Render.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About Me
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>Hi there! 👋</p>
              <p>
                I'm <strong>@Abdulbarikassim</strong>, a software engineer who
                is really interested in design. I'm an Information Technology
                graduate from Middlesex University Dubai 🎓, and I love
                building products that are well engineered underneath and
                feel good to use. I can engineer the system and design the
                experience, and I'm always learning more about both.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">
                🌟 What I do
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  🎨 Design and build user experiences that are clear, simple
                  and enjoyable, from the first idea to the live product.
                </li>
                <li>
                  🔧 Build full-stack apps with <strong>React</strong>,{" "}
                  <strong>Vue.js</strong>, <strong>Flask</strong> and{" "}
                  <strong>Node.js</strong>, including RESTful APIs and
                  authentication.
                </li>
                <li>
                  🤖 Work with <strong>machine learning</strong>: I trained the
                  model behind this app and built a handwritten digit
                  recognition model from scratch with <strong>NumPy</strong>.
                </li>
                <li>
                  🚀 Take projects all the way to production, like this one,
                  which is deployed on Vercel, Render and Supabase.
                </li>
                <li>
                  📚 Keep learning, especially in design, and enjoy
                  collaborating on impactful projects.
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
                  <strong>Frontend:</strong> React, Vue.js, Tailwind CSS
                </li>
                <li>
                  <strong>Backend:</strong> Flask, Django, Express.js, Node.js
                </li>
                <li>
                  <strong>Databases:</strong> PostgreSQL (Supabase), MongoDB
                </li>
                <li>
                  <strong>Machine learning:</strong> TensorFlow, Keras,
                  TensorFlow.js, neural networks, deep learning
                </li>
                <li>
                  <strong>Design:</strong> user experience, interface design,
                  responsive layouts
                </li>
                <li>
                  <strong>Tools:</strong> Git, Docker, VS Code, Vercel, Render
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mt-6">
                🎯 Goals
              </h3>
              <p>
                Grow as a software engineer who brings engineering and design
                together, building products that are reliable, fast and a
                pleasure to use.
              </p>

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
                  📸{" "}
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
