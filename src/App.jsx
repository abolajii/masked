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

const App = () => {
  useEffect(() => {
    const getCuurent = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        // Update the auth state
        // This should be done in a Redux store or similar
        // for better state management
        const response = await getMe();
        console.log(response);
      } else {
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

        {/* Redirect root to dashboard */}
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
