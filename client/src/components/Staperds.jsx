import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./Style/Staperds.css";
import { useNavigate } from "react-router-dom";
import SuccessNotification from "../components/Notifications/SuccessNotification";
import FailureNotification from "../components/Notifications/FailureNotification";

export default function Staperds() {
  const [step, setStep] = useState(1);
  const [showPortal, setShowPortal] = useState(false); // default false now
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Notifications
  const [successMsg, setSuccessMsg] = useState("");
  const [failureMsg, setFailureMsg] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    profileLink: "",
    location: "",
    dob: "",
    careerObjective: "",
    education_degree: "",
    education_institution: "",
    education_location: "",
    education_years: "",
    education_cgpa: "",
    work_jobTitle: "",
    work_companyName: "",
    work_location: "",
    work_years: "",
    skills_technical: "",
    skills_soft: "",
  });

  const userId = localStorage.getItem("userId");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fields = [
    { type: "input", name: "username", placeholder: "Username" },
    { type: "input", name: "phoneNumber", placeholder: "Phone Number" },
    { type: "input", name: "email", placeholder: "Email" },
    { type: "input", name: "profileLink", placeholder: "Profile Link" },
    { type: "input", name: "location", placeholder: "Location" },
    { type: "input", name: "dob", placeholder: "Date of Birth", inputType: "date" },
    { type: "input", name: "careerObjective", placeholder: "Career Objective" },
    { type: "input", name: "education_degree", placeholder: "Education Degree" },
    { type: "input", name: "education_institution", placeholder: "Institution" },
    { type: "input", name: "education_location", placeholder: "Education Location" },
    { type: "input", name: "education_years", placeholder: "Education Years" },
    { type: "input", name: "education_cgpa", placeholder: "CGPA" },
    { type: "input", name: "work_jobTitle", placeholder: "Job Title" },
    { type: "input", name: "work_companyName", placeholder: "Company Name" },
    { type: "input", name: "work_location", placeholder: "Work Location" },
    { type: "input", name: "work_years", placeholder: "Work Years" },
    { type: "textarea", name: "skills_technical", placeholder: "Technical Skills" },
    { type: "textarea", name: "skills_soft", placeholder: "Soft Skills" },
  ];

  const itemsPerPage = 5;
  const totalSteps = Math.ceil(fields.length / itemsPerPage);

  const startIndex = (step - 1) * itemsPerPage;
  const currentFields = fields.slice(startIndex, startIndex + itemsPerPage);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/submitCv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...formData,
          education: {
            degree: formData.education_degree,
            institution: formData.education_institution,
            eduLocation: formData.education_location,
            years: formData.education_years,
            cgpa: formData.education_cgpa,
          },
          workExperience: {
            jobTitle: formData.work_jobTitle,
            companyName: formData.work_companyName,
            workLocation: formData.work_location,
            workYears: formData.work_years,
          },
          skills: {
            technical: formData.skills_technical,
            soft: formData.skills_soft,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("CV data submitted successfully!");
        setTimeout(() => {
          navigate("/Templates");
        }, 1500);
      } else {
        setFailureMsg("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting CV:", error);
      setFailureMsg("Something went wrong. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoFill = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/checkUserData/${userId}`);
      const data = await res.json();

      if (data.success && data.user) {
        setShowPortal(true); // only show portal if data found
      }
    } catch (err) {
      console.error("Auto-fill fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Run check once on mount
  useEffect(() => {
    if (userId) {
      handleAutoFill();
    }
  }, [userId]);

  const confirmAutoFill = (userData) => {
    setFormData((prev) => ({
      ...prev,
      username: userData.username || prev.username,
      phoneNumber: userData.phoneNumber || prev.phoneNumber,
      email: userData.email || prev.email,
      profileLink: userData.profileLink || prev.profileLink,
      location: userData.location || prev.location,
      dob: userData.dob ? userData.dob.split("T")[0] : prev.dob,
      careerObjective: userData.careerObjective || prev.careerObjective,
      education_degree: userData.education_degree || prev.education_degree,
      education_institution: userData.education_institution || prev.education_institution,
      education_location: userData.education_location || prev.education_location,
      education_years: userData.education_years || prev.education_years,
      education_cgpa: userData.education_cgpa || prev.education_cgpa,
      work_jobTitle: userData.work_jobTitle || prev.work_jobTitle,
      work_companyName: userData.work_companyName || prev.work_companyName,
      work_location: userData.work_location || prev.work_location,
      work_years: userData.work_years || prev.work_years,
      skills_technical: userData.skills_technical || prev.skills_technical,
      skills_soft: userData.skills_soft || prev.skills_soft,
    }));
    setSuccessMsg("Data auto-filled successfully!");
    setShowPortal(false);
  };

  const portal = showPortal
    ? ReactDOM.createPortal(
        <div className="portal-overlay">
          <div className="portal-content">
            <h3>Saved data found</h3>
            <p>We found some saved data in your profile. Do you want to auto-fill?</p>
            <div className="portal-buttons">
              <button
                onClick={async () => {
                  const res = await fetch(`http://localhost:5000/api/checkUserData/${userId}`);
                  const data = await res.json();
                  if (data.success && data.user) {
                    confirmAutoFill(data.user);
                  }
                }}
              >
                Yes, Auto-Fill
              </button>
              <button onClick={() => setShowPortal(false)}>No, Thanks</button>
            </div>
          </div>
        </div>,
        document.getElementById("autoFill")
      )
    : null;

  return (
    <>
      {portal}

      {successMsg && (
        <SuccessNotification
          message={successMsg}
          onClose={() => setSuccessMsg("")}
        />
      )}
      {failureMsg && (
        <FailureNotification
          message={failureMsg}
          onClose={() => setFailureMsg("")}
        />
      )}

      <div className="main-staperds">
        <h2 style={{ marginLeft: "-25rem" }}>Your Information</h2>

        <div className="stepper-container">
          <div className="step-progress">
            {Array.from({ length: totalSteps }, (_, i) => (
              <React.Fragment key={i}>
                <div
                  className={`step-dot ${
                    i + 1 < step
                      ? "completed"
                      : i + 1 === step
                      ? "active"
                      : ""
                  }`}
                >
                  {i + 1}
                </div>
                {i !== totalSteps - 1 && <div className="step-line"></div>}
              </React.Fragment>
            ))}
          </div>
          <div className="form-step">
            {currentFields.map((field, index) => {
              if (field.type === "textarea") {
                return (
                  <textarea
                    key={index}
                    name={field.name}
                    value={formData[field.name]}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                  />
                );
              }
              return (
                <input
                  key={index}
                  type={field.inputType || "text"}
                  name={field.name}
                  value={formData[field.name]}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                />
              );
            })}
          </div>

          <div className="stepper-buttons">
            {step > 1 && <button onClick={prevStep}>Back</button>}
            {step < totalSteps && <button onClick={nextStep}>Next</button>}
            {step === totalSteps && (
              <button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
