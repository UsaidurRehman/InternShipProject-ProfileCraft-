import React, { useEffect, useState } from "react";
import mjml2html from "mjml-browser";
import html2pdf from "html2pdf.js";
import { FaDownload, FaTrashAlt } from "react-icons/fa";
import SuccessNotification from "../components/Notifications/SuccessNotification";
import FailureNotification from "../components/Notifications/FailureNotification";
import ConfirmModal from "../components/notifications/ConfirmModal";
import "./Style/CVList.css";

export default function CVList() {
  const [CVs, setCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingCVId, setDownloadingCVId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [failureMsg, setFailureMsg] = useState("");
  const [confirmDeleteCV, setConfirmDeleteCV] = useState(null);

  const userId = localStorage.getItem("userId");

  // Fetch CVs
  const fetchCVs = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/userCVs/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCVs(data.CVs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setFailureMsg("Error fetching CVs");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  // Delete CV
  const handleDeleteClick = (cv) => {
    setConfirmDeleteCV(cv);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteCV) return;

    fetch(`http://localhost:5000/api/userCVs/${confirmDeleteCV.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccessMsg(data.message || "CV deleted successfully");
          fetchCVs();
        } else {
          setFailureMsg(data.message || "Failed to delete CV");
        }
      })
      .catch((err) => {
        console.error(err);
        setFailureMsg("Error deleting CV");
      })
      .finally(() => setConfirmDeleteCV(null));
  };

  const handleCancelDelete = () => setConfirmDeleteCV(null);

  // Download CV
  const handleDownload = async (cvId, cvName) => {
    try {
      setDownloadingCVId(cvId);
      const res = await fetch(`http://localhost:5000/api/userCVs/getCv/${cvId}`);
      const data = await res.json();

      if (!data.success) {
        setFailureMsg("Failed to fetch CV data.");
        setDownloadingCVId(null);
        return;
      }

      const mjmlContent = data.CVData || "";
      const wrappedMJML = mjmlContent.trim().startsWith("<mjml")
        ? mjmlContent
        : `<mjml><mj-body>${mjmlContent}</mj-body></mjml>`;

      const { html } = mjml2html(wrappedMJML);

      await html2pdf()
        .from(html)
        .set({
          margin: 0.5,
          filename: `${cvName || "CV"}.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .save();

      setSuccessMsg("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      setFailureMsg("Error downloading CV.");
    } finally {
      setDownloadingCVId(null);
    }
  };

  // Categorize skills
  const categorizeSkills = (skillsText) => {
    if (!skillsText) return { frontend: [], backend: [], native: [] };

    // Split by comma or space and normalize
    const allSkills = skillsText
      .split(/[, ]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const frontEndSkills = ["html", "css", "javascript", "react", "vue", "angular"];
    const backEndSkills = ["node", "express", "java", "python", "php", "c#", "spring"];
    const nativeSkills = ["reactnative", "flutter", "swift", "kotlin"];

    const frontend = allSkills.filter((s) => frontEndSkills.includes(s));
    const backend = allSkills.filter((s) => backEndSkills.includes(s));
    const native = allSkills.filter((s) => nativeSkills.includes(s));

    return { frontend, backend, native };
  };

  const displayedCVs = CVs.map((cv) => {
    const combinedSkills = [cv.skills_technical, cv.skills_soft].filter(Boolean).join(" ");
    const { frontend, backend, native } = categorizeSkills(combinedSkills);

    return {
      ...cv,
      frontend,
      backend,
      native,
    };
  });

  return (
    <div className="cv-list-container">
      <div className="cv-list">
        <h2>Your CVs</h2>

        {loading ? (
          <p>Loading...</p>
        ) : displayedCVs.length > 0 ? (
          <table className="template-table">
            <thead>
              <tr>
                <th>#</th>
                <th>CV Name</th>
                <th>Front-End</th>
                <th>Back-End</th>
                <th>Native</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedCVs.map((cv, index) => (
                <tr key={cv.id}>
                  <td>{index + 1}</td>
                  <td>{cv.CVname}</td>
                  <td>
                    {cv.frontend.length > 0
                      ? cv.frontend.map((s, i) => <div key={i}>{s}</div>)
                      : "N/A"}
                  </td>
                  <td>
                    {cv.backend.length > 0
                      ? cv.backend.map((s, i) => <div key={i}>{s}</div>)
                      : "N/A"}
                  </td>
                  <td>
                    {cv.native.length > 0
                      ? cv.native.map((s, i) => <div key={i}>{s}</div>)
                      : "N/A"}
                  </td>
                  <td className="actions-cell">
                    <div className="actions-icons">
                      <FaDownload
                        className={`icon download-icon ${downloadingCVId === cv.id ? "disabled" : ""}`}
                        onClick={() =>
                          downloadingCVId === cv.id ? null : handleDownload(cv.id, cv.CVname)
                        }
                        title={downloadingCVId === cv.id ? "Downloading..." : "Download CV"}
                      />
                      <FaTrashAlt
                        className="icon delete-icon"
                        onClick={() => handleDeleteClick(cv)}
                        title="Delete CV"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No CVs found.</p>
        )}
      </div>

      {successMsg && (
        <SuccessNotification message={successMsg} onClose={() => setSuccessMsg("")} />
      )}
      {failureMsg && (
        <FailureNotification message={failureMsg} onClose={() => setFailureMsg("")} />
      )}

      <ConfirmModal
        visible={!!confirmDeleteCV}
        message={`Are you sure you want to delete "${confirmDeleteCV?.CVname}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
