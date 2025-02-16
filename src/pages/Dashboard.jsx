import React from "react";
import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const { user } = useAuthStore();
  return (
    <div>
      <h1>Welcome, {user.username}</h1>
    </div>
  );
};

export default Dashboard;
