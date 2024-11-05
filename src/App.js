// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import ChartComponent from "./ChartComponent"; // Import your ChartComponent
import NavBar from "./NavBar";
import RealTimeData from "./RealTimeData";

import ProtectedRoute from "./ProtectedRoute";

const DefaultRoute = () => {
  const { user } = useAuth();
  console.log("hhhh ", user)
  return user ? <Navigate to="/dashboard" /> : <Navigate to="/dashboard" />;
};

const AdminProtectedRoute = ({ children }) => {
  const { role } = useAuth();
  return role === "admin" ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<DefaultRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/realtimedata"
            element={
              <ProtectedRoute>
                <RealTimeData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/chart" // Add route for ChartComponent
            element={
              <ProtectedRoute>
                <ChartComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
