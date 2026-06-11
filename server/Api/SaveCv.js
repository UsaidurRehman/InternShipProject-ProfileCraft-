//Save userCV in CVlist
// SaveCv.js
const express = require("express");
const { sql } = require("../db"); // MSSQL connection
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, CVData, CVname } = req.body; // userId directly

    if (!userId || !CVData) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const cvNameToSave = CVname && CVname.trim() ? CVname.trim() : "Untitled CV";

    // ✅ Insert a new CV row for this user
    await sql.query`
      INSERT INTO UsersCV (userid, CVData, CVname)
      VALUES (${userId}, ${CVData}, ${cvNameToSave})
    `;

    return res.json({ success: true, message: "CV saved successfully" });
  } catch (err) {
    console.error("Save CV Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
