//Use for registeration of new user
const express = require("express");
const bcrypt = require("bcryptjs");
const { sql } = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body;

        // Validation
        if (!username || !email || !password || !confirm_password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (password !== confirm_password) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        // Check if email already exists
        const existingUser = await sql.query`
            SELECT * FROM UserData WHERE Email = ${email}
        `;
        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedConfirmPassword = await bcrypt.hash(confirm_password, 10);

        // ✅ Insert into UserData and get the inserted user's ID
        const result = await sql.query`
            INSERT INTO UserData (username, email, password, Confirm_password)
            OUTPUT INSERTED.id
            VALUES (${username}, ${email}, ${hashedPassword}, ${hashedConfirmPassword})
        `;

        const userId = result.recordset[0].id;

        // ✅ Insert into UsersCV with the new user's ID and empty CVData
        await sql.query`
            INSERT INTO UsersCV (userid, CVData)
            VALUES (${userId}, '')
        `;

        res.status(201).json({ success: true, message: "User registered successfully", userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
