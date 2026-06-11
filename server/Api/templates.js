// Get all templates
const express = require("express");
const { sql } = require("../db");
const router = express.Router();

router.get("/templates", async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM TemplatesData`;
        res.status(200).json({ success: true, templates: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
