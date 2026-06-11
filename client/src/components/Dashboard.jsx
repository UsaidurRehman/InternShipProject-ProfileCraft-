import React from "react";
import { NavLink } from "react-router-dom";
import "./Style/Dashboard.css";
import logo from "../assets/images/logo.png";


export default function Dashboard() {
  return (
    <>
      {/* Sidebar */}
      <div className="dashboard">
        {/* <h2>Dashboard</h2> */}
        <img src={logo} alt="logo" />
        <div className="dashboard-links">
          <NavLink className="dashboard-link" to="/options" end>
            🏠 Home
          </NavLink>
          <NavLink className="dashboard-link" to="/steperdas">
            📝 Stepers
          </NavLink>
          <NavLink className="dashboard-link" to="/templates">
            📄 CV Template
          </NavLink>
          <NavLink className="dashboard-link" to="/CVList">
            📋 CV List
          </NavLink>
          <NavLink className="dashboard-link" to="/jobListings">
            💼 Job List
          </NavLink>
          <NavLink className="dashboard-link" to="/aboutus">
            ℹ️ About Us
          </NavLink>
        </div>
      </div>
    </>
  );
}
