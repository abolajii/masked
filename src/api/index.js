import axios from "axios";

const prod = true;

const BASE_URL = prod
  ? "https://masked-be.vercel.app/api/v1"
  : "http://localhost:4030/api/v1";

const getToken = () => {
  return localStorage.getItem("token");
};

// Add getMe function
const getMe = async () => {
  try {
    const response = await authSignal.get("/me");
    if (response.data.success) {
      return {
        success: true,
        user: response.data.user,
      };
    }
    throw new Error("Failed to get user data");
  } catch (error) {
    throw error;
  }
};

const noauthSignal = axios.create({
  baseURL: BASE_URL,
});

const authSignal = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Request interceptor
authSignal.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
authSignal.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to invalid token
    if (
      error.response?.status === 401 &&
      error.response?.data?.message?.includes("Invalid token")
    ) {
      try {
        // Get current user data
        const getMeResponse = await getMe();
        console.log(getMeResponse);
        if (getMeResponse.success) {
          // If successful, update user state (assuming setUser is available in context)
          if (typeof setUser === "function") {
            // setUser(getMeResponse.user);
          }
          // Retry the original request
          return authSignal(originalRequest);
        }
      } catch (refreshError) {
        // If getMe fails, redirect to login
        localStorage.removeItem("token"); // Clear the invalid token
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For other errors, reject the promise
    return Promise.reject(error);
  }
);

export { noauthSignal, authSignal, getMe };
