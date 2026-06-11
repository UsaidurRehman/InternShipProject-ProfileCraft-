//For Stepards autofill funcitonality
// routes/checkUserData.js
const express = require("express");
const { sql } = require("../db");

const router = express.Router();

router.get("/checkUserData/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    const result = await sql.query`
      SELECT TOP 1
        userId,
        username,
        phoneNumber,
        email,
        profileLink,
        location,
        dob,
        careerObjective,
        education_degree,
        education_institution,
        education_location,
        education_years,
        education_cgpa,
        work_jobTitle,
        work_companyName,
        work_location,
        work_years,
        skills_technical,
        skills_soft
      FROM UserDataTable
      WHERE userId = ${userId}
    `;

    if (result.recordset.length > 0) {
      return res.json({
        success: true,
        user: result.recordset[0],
      });
    } else {
      return res.json({
        success: false,
        message: "No data found for this user",
      });
    }
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

module.exports = router;
