// src/AdminDashboard.js
import React from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  // Redirect if the user is not an admin
  if (role !== "admin") {
    navigate("/dashboard");
  }

  return (
    <div>
      <h1>Welcome to the Admin Dashboard, {user?.displayName || user?.email}!</h1>
      <p>Only accessible by admin users.</p>
    </div>
  );
};

export default AdminDashboard;
