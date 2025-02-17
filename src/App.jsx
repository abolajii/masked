import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Weekly from "./pages/Weekly";
import ProtectedRoute from "./components/ProtectedRoute";
import { getMe } from "./api/request";
import { useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Deposit from "./pages/Deposit";
import useAuthStore from "./store/authStore";

const App = () => {
  const { setUser } = useAuthStore();

  const getToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const getCuurent = async () => {
      if (getToken()) {
        // Update the auth state
        // This should be done in a Redux store or similar
        // for better state management
        const response = await getMe();
        // console.log(response.user);
        setUser(response.user);
      } else {
        // console.log(error);
        window.href = "/login";
        // Clear the auth state
        // This should be done in a Redux store or similar
        // for better state management
      }
    };

    getCuurent();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/weekly"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Weekly />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/deposit"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Deposit />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard */}
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
