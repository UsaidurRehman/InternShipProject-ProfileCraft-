import React, { useEffect, useState, useRef } from "react";
import "./Style/JobListing.css";

export default function JobListing() {
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [page, setPage] = useState(1);

  const jobsPerPage = 10;
  const abortRef = useRef(null);

  const fetchJobs = async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (search) params.append("q", search);
    if (location) params.append("location", location);
    if (filterType && filterType !== "All") params.append("type", filterType);

    try {
      const res = await fetch(`http://localhost:5000/api/jobs?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Request failed with ${res.status}`);
      }

      const data = await res.json();
      setJobs(data.jobs || []);
      setLocations(data.locations || []);
      setPage(1);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to load jobs.");
        setJobs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, location, filterType]);

  const paginatedJobs = jobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);

  const shimmerArray = Array.from({ length: jobsPerPage });

  return (
    <div className="joblist-container">
      <h2 className="joblist-title">Explore Opportunities</h2>

      <div className="joblist-controls">
        <input
          type="text"
          placeholder="Search roles or companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="joblist-search"
        />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="joblocation-filter"
        >
          <option value="All">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="joblist-filter"
        >
          <option value="All">All Types</option>
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>

      {error && <p className="error">⚠️ {error}</p>}

      {loading ? (
        <div className="joblist-grid">
          {shimmerArray.map((_, idx) => (
            <div key={idx} className="job-card shimmer-card">
              <div className="shimmer-title"></div>
              <div className="shimmer-company"></div>
              <div className="shimmer-location"></div>
              <div className="shimmer-badge"></div>
              <div className="shimmer-desc"></div>
              <div className="shimmer-btn"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {paginatedJobs.length > 0 ? (
            <div className="joblist-grid">
              {paginatedJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>
                  <p className="location">{job.location}</p>
                  {job.type && <span className="badge">{job.type.replace("_", " ")}</span>}
                  <p className="desc">{job.description.slice(0, 150)}...</p>
                  {job.applyUrl ? (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="apply-btn"
                    >
                      Apply Now
                    </a>
                  ) : (
                    <button className="apply-btn" disabled>
                      Apply Unavailable
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-jobs">No jobs found.</p>
          )}

          {jobs.length > jobsPerPage && (
            <div className="joblist-pagination">
              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </button>
              <span className="page-indicator">
                Page {page} of {Math.ceil(jobs.length / jobsPerPage)}
              </span>
              <button
                className="page-btn"
                onClick={() =>
                  setPage((p) => Math.min(Math.ceil(jobs.length / jobsPerPage), p + 1))
                }
                disabled={page === Math.ceil(jobs.length / jobsPerPage)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
