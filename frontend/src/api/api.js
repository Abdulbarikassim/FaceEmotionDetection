const BASE_URL = "http://localhost:3000";

// Emotion detection
export async function getEmotionPrediction(imageData) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required, sign up first! ");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/detect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ image_base64: imageData.split(",")[1] }),
    });

    if (!response.ok) throw new Error("Failed to fetch prediction");
    return await response.json();
  } catch (error) {
    console.error("Error fetching emotion prediction:", error);
    throw error;
  }
}

// Save emotion result
export async function saveEmotionResult(imageData, emotion) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        image_base64: imageData.split(",")[1],
        emotion: emotion,
      }),
    });

    if (!response.ok) throw new Error("Failed to save emotion");
    return await response.json();
  } catch (error) {
    console.error("Error saving emotion:", error);
    throw error;
  }
}

// Get emotion history
export async function getEmotionHistory() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${BASE_URL}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch history");
    return await response.json();
  } catch (error) {
    console.error("Error fetching emotion history:", error);
    throw error;
  }
}

// Sign in user
export const signInUser = async ({ email, password }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Sign-In failed");

    // Store the token in local storage
    localStorage.setItem("authToken", data.access_token);
    return data;
  } catch (error) {
    console.error("Sign in Error:", error);
    throw error;
  }
};

// Sign up user
export const signUpUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw new Error("All fields are required.");
  }
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Sign-up failed");
    }

    return data;
  } catch (error) {
    console.error("Sign-up error:", error.message);
    throw error;
  }
};

// Logout User
export const logoutUser = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Already logged out");
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Logout failed");

    localStorage.removeItem("authToken");
    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
