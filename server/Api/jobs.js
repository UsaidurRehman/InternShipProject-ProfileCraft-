//Fetch a jobs from remotive
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { q, location, type } = req.query;

    const response = await axios.get("https://remotive.com/api/remote-jobs");
    let jobs = response.data.jobs || [];

    // ✅ Clean and map jobs to consistent fields
    jobs = jobs.map((job) => {
      const rawLocation = job.candidate_required_location ? job.candidate_required_location.trim() : "";
      const cleanLocation = rawLocation.split(",")[0]; // ✅ Only keep text before first comma

      return {
        id: job.id,
        title: job.title ? job.title.trim() : "",
        company: job.company_name ? job.company_name.trim() : "",
        location: cleanLocation, // ✅ Use cleaned location
        type: job.job_type ? job.job_type.trim() : "",
        description: job.description ? job.description.replace(/<[^>]+>/g, "").trim() : "",
        applyUrl: job.url,
      };
    });

    // ✅ Filtering logic
    if (q) {
      const qLower = q.toLowerCase().trim();
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(qLower) ||
          job.company.toLowerCase().includes(qLower)
      );
    }

    if (location && location !== "All") {
      const locLower = location.toLowerCase().trim();
      jobs = jobs.filter((job) => job.location.toLowerCase().includes(locLower));
    }

    if (type && type !== "All") {
      const typeLower = type.toLowerCase().trim();
      jobs = jobs.filter((job) => job.type.toLowerCase() === typeLower);
    }

    // ✅ Collect unique cleaned locations for dropdown
    const locations = Array.from(new Set(jobs.map((j) => j.location))).sort();

    res.json({ jobs, locations });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

module.exports = router;
