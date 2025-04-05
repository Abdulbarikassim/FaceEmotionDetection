import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, LogIn, UserPlus, LogOut, History } from "lucide-react";
import { logoutUser } from "../api/api";
import AuthForm from "../components/AuthForms";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in on page load by checking localStorage
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignInSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold">Emotion AI</span>
            </Link>
            <div className="ml-10 flex space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 px-3 py-2"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-purple-600 px-3 py-2"
              >
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setShowSignIn(true)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => setShowSignUp(true)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/history"
                  className="flex items-center space-x-1 text-gray-700 hover:text-purple-600"
                >
                  <History className="h-5 w-5" />
                  <span>History</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-purple-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthForm
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSuccess={handleSignInSuccess}
        type="signin"
      />

      <AuthForm
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSuccess={handleSignUpSuccess}
        type="signup"
      />

      {error && (
        <div className="absolute top-16 right-4 bg-red-100 text-red-700 px-4 py-2 rounded-md">
          {error}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
