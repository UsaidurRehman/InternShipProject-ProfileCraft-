//Geting logined user skills and show in CVList table
const express = require("express");
const router = express.Router();
const { sql } = require("../db"); // MSSQL connection

// Get all CVs for a user with skills
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await sql.query`
      SELECT u.id, u.CVname, 
             ISNULL(d.skills_technical,'') AS skills_technical, 
             ISNULL(d.skills_soft,'') AS skills_soft
      FROM UsersCV u
      LEFT JOIN userDataTable d ON u.userid = d.userid
      WHERE u.userid = ${userId} AND u.CVname IS NOT NULL AND u.CVData IS NOT NULL
    `;
    res.json({ success: true, CVs: result.recordset });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error fetching CVs" });
  }
});

// Get full CV data by CV ID
router.get("/getCv/:cvId", async (req, res) => {
  const { cvId } = req.params;
  try {
    const result = await sql.query`
      SELECT id, CVname, CVData 
      FROM UsersCV 
      WHERE id = ${cvId} AND CVname IS NOT NULL AND CVData IS NOT NULL
    `;
    if (result.recordset.length === 0) {
      return res.json({ success: false, message: "CV not found" });
    }
    res.json({ success: true, ...result.recordset[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error fetching CV" });
  }
});

// Delete a CV completely by CV ID
router.delete("/:cvId", async (req, res) => {
  const { cvId } = req.params;
  try {
    await sql.query`
      DELETE FROM UsersCV
      WHERE id = ${cvId}
    `;
    res.json({ success: true, message: "CV deleted successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error deleting CV" });
  }
});

module.exports = router;
