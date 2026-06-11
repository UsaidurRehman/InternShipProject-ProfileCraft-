import React, { useEffect, useState, useRef } from "react";
import mjml2html from "mjml-browser";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import SuccessNotification from "../components/Notifications/SuccessNotification";
import FailureNotification from "../components/Notifications/FailureNotification";
import CVNameModal from "./notifications/CVNameModal.jsx";
import "./Style/TempStyles.css";
import "./Style/HeaderStyles.css";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [failureMsg, setFailureMsg] = useState("");
  const [showCVModal, setShowCVModal] = useState(false);
  const [cvNameToSave, setCvNameToSave] = useState("");

  const previewRef = useRef(null);
  const filledHTMLRef = useRef("");

  const navigate = useNavigate();

  // Dummy user data fallback
  const dummyUserData = {
    username: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+123456789",
    profileLink: "https://linkedin.com/in/johndoe",
    location: "New York, USA",
    dob: "1990-01-01",
    careerObjective: "To secure a challenging position...",
    education_degree: "B.Sc. Computer Science",
    education_institution: "ABC University",
    education_location: "New York",
    education_years: "2010-2014",
    education_cgpa: "3.8",
    work_jobTitle: "Software Engineer",
    work_companyName: "Tech Corp",
    work_location: "San Francisco",
    work_years: "2015-2020",
    skills_technical: "React, Node.js, JavaScript",
    skills_soft: "Teamwork, Problem-Solving",
  };

  const wrapMJML = (content) =>
    content?.trim().startsWith("<mjml")
      ? content
      : `<mjml><mj-body>${content || ""}</mj-body></mjml>`;

  const renderMJML = (content) => {
    try {
      const { html } = mjml2html(wrapMJML(content || ""));
      return html || "";
    } catch (e) {
      console.warn("MJML parse error:", e?.message);
      return content || "";
    }
  };

  const fillTemplate = (content, data) => {
    let html = renderMJML(content);
    const mapping = {
      "{{username}}": data.username || "",
      "{{email}}": data.email || "",
      "{{phoneNumber}}": data.phoneNumber || "",
      "{{profileLink}}": data.profileLink || "",
      "{{location}}": data.location || "",
      "{{dob}}": data.dob ? new Date(data.dob).toLocaleDateString() : "",
      "{{careerObjective}}": data.careerObjective || "",
      "{{education_degree}}": data.education_degree || "",
      "{{education_institution}}": data.education_institution || "",
      "{{education_location}}": data.education_location || "",
      "{{education_years}}": data.education_years || "",
      "{{education_cgpa}}": data.education_cgpa || "",
      "{{work_jobTitle}}": data.work_jobTitle || "",
      "{{work_companyName}}": data.work_companyName || "",
      "{{work_location}}": data.work_location || "",
      "{{work_years}}": data.work_years || "",
      "{{skills_technical}}": data.skills_technical || "",
      "{{skills_soft}}": data.skills_soft || "",
    };
    Object.keys(mapping).forEach((key) => {
      html = html.replaceAll(key, mapping[key]);
    });
    return html;
  };

  // Fetch templates
  useEffect(() => {
    fetch("http://localhost:5000/api/templates")
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error(`Status ${res.status}`))
      )
      .then((data) => {
        if (data?.success) {
          setTemplates(data.templates || []);
          setFilteredTemplates(data.templates || []);
        } else throw new Error("Failed to load templates");
      })
      .catch((err) => setError(err.message || String(err)));
  }, []);

  // Fetch user data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    fetch(`http://localhost:5000/api/userData/${user.id}`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error(`Status ${res.status}`))
      )
      .then((data) => setUserData(data?.userData || null))
      .catch((err) => console.warn("User data fetch error:", err));
  }, []);

  // Fill template preview
  useEffect(() => {
    if (!selectedTemplate) return;
    const dataToUse = userData || dummyUserData;
    filledHTMLRef.current = fillTemplate(selectedTemplate.content, dataToUse);
    if (previewRef.current) previewRef.current.innerHTML = filledHTMLRef.current;
  }, [selectedTemplate, userData]);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTemplates(templates);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredTemplates(
        templates.filter((t) => t.name.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, templates]);

  const handleDownloadPDF = () => {
    if (!previewRef.current || !selectedTemplate) {
      setFailureMsg("No template selected or preview is empty.");
      return;
    }

    setSaving(true);

    html2pdf()
      .from(previewRef.current)
      .set({
        margin: 0.5,
        filename: `${selectedTemplate?.name || "CV_Template"}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save()
      .then(() => setSuccessMsg("PDF downloaded successfully!"))
      .catch(() => setFailureMsg("Failed to download PDF."))
      .finally(() => setSaving(false));
  };

  const handleSaveCV = () => {
    if (!selectedTemplate) return;
    const defaultName = selectedTemplate.name || "Untitled CV";
    setCvNameToSave(defaultName);
    setShowCVModal(true);
  };

  const saveCVWithName = async (name) => {
    setShowCVModal(false);
    setSaving(true);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      setFailureMsg("User not logged in");
      setSaving(false);
      return;
    }

    const dataToUse = userData || dummyUserData;
    let finalMJML = selectedTemplate.content;
    Object.keys(dataToUse).forEach((key) => {
      finalMJML = finalMJML.replaceAll(`{{${key}}}`, dataToUse[key] || "");
    });

    try {
      const res = await fetch("http://localhost:5000/api/saveCv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          CVData: finalMJML,
          CVname: name,
        }),
      });

      const result = await res.json();
      if (result.success) setSuccessMsg(result.message || "CV saved successfully!");
      else setFailureMsg(result.message || "Failed to save CV");
    } catch (err) {
      console.error(err);
      setFailureMsg("Server error while saving CV");
    } finally {
      setSaving(false);
    }
  };

  const handleBackToInfo = () => {
    setSelectedTemplate(null);
    filledHTMLRef.current = "";
    if (previewRef.current) previewRef.current.innerHTML = "";
  };

  if (error) return <div className="template-container">Error: {error}</div>;
  if (!templates.length) return <div className="template-container">Loading...</div>;

  const dataToDisplay = userData || dummyUserData;

  return (
    <div>
      {/* HEADER */}
      <header className="subHeader">
        <div className="sub-header-logo" onClick={() => navigate("/options")}>
          Select Your Template
        </div>

        <div className="sub-header-actions">
          <button
            className="header-download-btn"
            onClick={handleDownloadPDF}
            style={{width:"300px"}}
            disabled={!selectedTemplate || saving}
          >
            {saving ? "Saving..." : "Download PDF"}
          </button>

          <button
            className="header-save-btn"
            onClick={handleSaveCV}
            disabled={!selectedTemplate || saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="template-search"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <div className="page-wrapper two-column-layout">
        <h2 style={{marginLeft:"-30rem",marginBottom:"5rem", width:"270px"}}>Make your CV</h2>
        {/* LEFT SECTION */}
        <div className="left-section">
          <div className="fixed-box">
            {/* <h3 id="select">CV Information</h3> */}
            {!selectedTemplate && (
              <div className="user-info-box">
                <div className="user-details">
                  <p><strong>Name:</strong> {dataToDisplay.username}</p>
                  <p><strong>Email:</strong> {dataToDisplay.email}</p>
                  <p><strong>Phone:</strong> {dataToDisplay.phoneNumber}</p>
                  <p><strong>Profile Link:</strong> {dataToDisplay.profileLink}</p>
                  <p><strong>Location:</strong> {dataToDisplay.location}</p>
                  <p><strong>Date of Birth:</strong> {new Date(dataToDisplay.dob).toLocaleDateString()}</p>
                  <p><strong>Career Objective:</strong> {dataToDisplay.careerObjective}</p>
                  <h3>Education</h3>
                  <p><strong>Degree:</strong> {dataToDisplay.education_degree}</p>
                  <p><strong>Institution:</strong> {dataToDisplay.education_institution}</p>
                  <p><strong>Location:</strong> {dataToDisplay.education_location}</p>
                  <p><strong>Years:</strong> {dataToDisplay.education_years}</p>
                  <p><strong>CGPA:</strong> {dataToDisplay.education_cgpa}</p>
                  <h3>Work Experience</h3>
                  <p><strong>Job Title:</strong> {dataToDisplay.work_jobTitle}</p>
                  <p><strong>Company Name:</strong> {dataToDisplay.work_companyName}</p>
                  <p><strong>Location:</strong> {dataToDisplay.work_location}</p>
                  <p><strong>Years:</strong> {dataToDisplay.work_years}</p>
                  <h3>Skills</h3>
                  <p><strong>Technical:</strong> {dataToDisplay.skills_technical}</p>
                  <p><strong>Soft:</strong> {dataToDisplay.skills_soft}</p>
                </div>
              </div>
            )}

            {selectedTemplate && (
              <div className="selected-template-preview">
                <div className="button-row">
                  <button className="back-btn" onClick={handleBackToInfo}>← Back to Info</button>
                </div>
                <div
                  ref={previewRef}
                  className="rendered-template editable-preview"
                  contentEditable
                  suppressContentEditableWarning={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="right-section">
          {/* <h3 id="select" style={{ marginBottom: "1rem", marginTop: "1.5rem" }}>Select Template</h3> */}
          <div className="templates-grid">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((t) => {
                const thumbHtml = fillTemplate(t.content, dataToDisplay);
                return (
                  <div
                    key={t.id || t.name}
                    className="template-small-card"
                    onClick={() => setSelectedTemplate(t)}
                  >
                    <div className="template-thumb">
                      <div dangerouslySetInnerHTML={{ __html: thumbHtml }} />
                    </div>
                    <div className="template-name-overlay">{t.name}</div>
                  </div>
                );
              })
            ) : (
              <div className="no-templates-msg">No templates found</div>
            )}
          </div>
        </div>
      </div>

      {/* CV Name Modal */}
      {showCVModal && (
        <CVNameModal
          defaultName={cvNameToSave}
          onSave={saveCVWithName}
          onClose={() => setShowCVModal(false)}
        />
      )}

      {/* Notifications */}
      {successMsg && <SuccessNotification message={successMsg} onClose={() => setSuccessMsg("")} />}
      {failureMsg && <FailureNotification message={failureMsg} onClose={() => setFailureMsg("")} />}
    </div>
  );
}
