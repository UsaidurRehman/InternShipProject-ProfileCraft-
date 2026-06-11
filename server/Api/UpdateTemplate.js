// backend/routes/templates.js
const express = require("express");
const { sql } = require("../db");

const router = express.Router();

// Fetch templates
router.get("/templates", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT * FROM TemplatesData
    `;
    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "No templates found" });
    }
    res.status(200).json({
      success: true,
      templates: result.recordset,
    });
  } catch (error) {
    console.error("Fetch templates error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔹 Update template content
router.put("/templates/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, message: "MJML content is required" });
  }

  try {
    await sql.query`
      UPDATE TemplatesData
      SET content = ${content}
      WHERE id = ${id}
    `;
    res.status(200).json({ success: true, message: "Template updated successfully" });
  } catch (error) {
    console.error("Update template error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
