import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import ConfirmModal from "../notifications/ConfirmModal";
import SuccessNotification from "../Notifications/SuccessNotification";
import FailureNotification from "../Notifications/FailureNotification";
import "./common.css";

export default function Header() {
  const [username, setUsername] = useState("Login");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const updateUsername = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.username || "Login");
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        setUsername("Login");
      }
    } else {
      setUsername("Login");
    }
  };

  useEffect(() => {
    if (location.pathname === "/") {
      localStorage.clear();
      setUsername("Login");
    } else {
      updateUsername();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUsername("Login");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) {
      setErrorMsg("User not found!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/deleteAccount/${storedUser.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setSuccessMsg("Account deleted successfully.");
        setTimeout(() => {
          handleLogout();
        }, 1500);
      } else {
        setErrorMsg("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setErrorMsg("Server error. Try again later.");
    }
  };

  const links = [
    { name: "Home", path: "/options" },
    { name: "Stepars", path: "/steperdas" },
    { name: "CV Templates", path: "/templates" },
    { name: "CV List", path: "/CVList" },
    { name: "Job List", path: "/jobListings" },
    { name: "About Us", path: "/aboutus" },
  ];

  const headerClass =
    location.pathname === "/" || location.pathname === "/register"
      ? "header-container-notLogin"
      : "header-container";

  const hideLinks =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <header className={headerClass}>
      <div className="header-logo-text" onClick={() => navigate("/options")}>
        ProfileCraft
      </div>
      <nav className="header-nav">
        {!hideLinks &&
          links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={
                location.pathname === link.path
                  ? "header-link active"
                  : "header-link"
              }
            >
              {link.name}
            </Link>
          ))}

        
        <div className="header-dropdown">
          <button
            className="header-button"
            onClick={() => {
              if (username === "Login") {
                navigate("/");
              } else {
                setShowDropdown(!showDropdown);
              }
            }}
          >
            {username}
            {username !== "Login" && (
              <FaChevronDown
                className={`dropdown-arrow ${showDropdown ? "rotate" : ""}`}
                style={{ marginLeft: "8px", fontSize: "0.9rem" }}
              />
            )}
          </button>

          {showDropdown && username !== "Login" && (
            <div className="dropdown-menu active">
              <button onClick={handleLogout}>Logout</button>
              <button onClick={() => setShowModal(true)}>Delete Account</button>
            </div>
          )}
        </div>
      </nav>

      
      <ConfirmModal
        visible={showModal}
        message="Are you sure you want to delete your account? This action cannot be undone."
        onConfirm={() => {
          setShowModal(false);
          handleDeleteAccount();
        }}
        onCancel={() => setShowModal(false)}
      />

      
      {successMsg && (
        <SuccessNotification
          message={successMsg}
          duration={1500}
          onClose={() => setSuccessMsg("")}
        />
      )}
      {errorMsg && (
        <FailureNotification
          message={errorMsg}
          onClose={() => setErrorMsg("")}
        />
      )}
    </header>
  );
}
