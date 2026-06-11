//For stepards information handle
const express = require("express");
const { sql } = require("../db");

const router = express.Router();

router.post("/submitCv", async (req, res) => {
  try {
    console.log("Received CV data:", req.body);

    const {
      userId,
      username,
      phoneNumber,
      email,
      profileLink,
      location,
      dob,
      careerObjective,
      education = {},
      workExperience = {},
      skills = {},
    } = req.body;

    if (!userId || !username || !email) {
      return res.status(400).json({
        success: false,
        message: "User ID, username, and email are required",
      });
    }

    // Check if user already exists
    const checkUser = await sql.query`
      SELECT * FROM UserDataTable WHERE userId = ${userId}
    `;

    if (checkUser.recordset.length > 0) {
      // 🔹 Update if user exists
      await sql.query`
        UPDATE UserDataTable
        SET 
          username = ${username},
          phoneNumber = ${phoneNumber},
          email = ${email},
          profileLink = ${profileLink},
          location = ${location},
          dob = ${dob},
          careerObjective = ${careerObjective},
          education_degree = ${education.degree},
          education_institution = ${education.institution},
          education_location = ${education.eduLocation},
          education_years = ${education.years},
          education_cgpa = ${education.cgpa},
          work_jobTitle = ${workExperience.jobTitle},
          work_companyName = ${workExperience.companyName},
          work_location = ${workExperience.workLocation},
          work_years = ${workExperience.workYears},
          skills_technical = ${skills.technical},
          skills_soft = ${skills.soft}
        WHERE userId = ${userId}
      `;

      return res.status(200).json({
        success: true,
        message: "CV data updated successfully",
      });
    } else {
      // 🔹 Insert new record if user doesn't exist
      await sql.query`
        INSERT INTO UserDataTable (
          userId, username, phoneNumber, email, profileLink, location, dob, careerObjective,
          education_degree, education_institution, education_location, education_years, education_cgpa,
          work_jobTitle, work_companyName, work_location, work_years,
          skills_technical, skills_soft
        )
        VALUES (
          ${userId}, ${username}, ${phoneNumber}, ${email}, ${profileLink}, ${location}, ${dob}, ${careerObjective},
          ${education.degree}, ${education.institution}, ${education.eduLocation}, ${education.years}, ${education.cgpa},
          ${workExperience.jobTitle}, ${workExperience.companyName}, ${workExperience.workLocation}, ${workExperience.workYears},
          ${skills.technical}, ${skills.soft}
        )
      `;

      return res.status(201).json({
        success: true,
        message: "CV data saved successfully",
      });
    }

  } catch (error) {
    console.error("Error in /submitCv:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
