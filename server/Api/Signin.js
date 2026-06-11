//use For existing user signin
const express = require("express");
const bcrypt = require("bcryptjs");
const { sql } = require("../db");

const router = express.Router();

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Query user by email
    const userResult = await sql.query`
      SELECT * FROM userdata WHERE Email = ${email}
    `;

    if (userResult.recordset.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const user = userResult.recordset[0];

    if (!user.password) {
      return res.status(500).json({ success: false, message: "User password not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Check if user is already in UsersCV table
    const cvCheck = await sql.query`
      SELECT * FROM UsersCV WHERE userid = ${user.id}
    `;

    if (cvCheck.recordset.length === 0) {
      // User doesn't exist in UsersCV, insert
      await sql.query`
        INSERT INTO UsersCV (userid) VALUES (${user.id})
      `;
    }

    // Send id along with other info
    res.status(200).json({
      success: true,
      message: "Signin successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
