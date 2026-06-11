import React from "react";
import { useNavigate } from "react-router-dom";
import "./Style/Option.css";

export default function Options() {
  const navigate = useNavigate();

  const options = [
    { name: "CV Templates", icon: "📄", path: "/steperdas" },
    { name: "CV List", icon: "📋", path: "/CVList" },
    { name: "Job Listings", icon: "📢", path: "/jobListings" },
    { name: "About Us", icon: "ℹ️", path: "/aboutus" }
    // { name: "Interview Tips", icon: "🎯", path: "/interviewTips" }
    // { name: "Skill Development", icon: "📚", path: "/skillDevelopment" },
  ];

  return (
    <section className="options-section">
      <div className="options-header">
        <h2 className="options-title">Quickly access the tools you need for career growth.</h2>
      </div>

      <div className="options-grid">
        {options.map((opt, index) => (
          <article
            key={index}
            className="option-card"
            onClick={() => navigate(opt.path)}
          >
            <div className="option-icon">{opt.icon}</div>
            <h3>{opt.name}</h3>
            <p className="option-description">
              {opt.name === "CV Templates" && "Select from a variety of modern CV templates."}
              {opt.name === "CV List" && "Check out variety of CV's in one Click."}
              {opt.name === "Job Listings" && "Explore a wide range of job opportunities instantly."}
              {opt.name === "About Us" && "Learn more about our mission and how we help you succeed."}
              {/* {opt.name === "Skill Development" && "Boost your skills with curated resources."} */}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
