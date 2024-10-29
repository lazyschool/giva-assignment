// src/NavBar.js
import React from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";

const NavBar = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Home</Link>
        {role === "admin" && (
          <Link to="/admin-dashboard" style={styles.link}>Admin Dashboard</Link>
        )}
        <Link to="/dashboard" style={styles.link}>Demo Link 2</Link>
      </div>
      {user && (
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#282c34",
    color: "white",
  },
  links: {
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  logoutButton: {
    backgroundColor: "#61dafb",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default NavBar;
