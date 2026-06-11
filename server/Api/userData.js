const express = require("express");
const { sql } = require("../db");
const router = express.Router();

router.get("/userData/:userId", async (req, res) => {
  const userId = req.params.userId; // get userId from route parameter

  try {
    const result = await sql.query`
      SELECT * FROM UserDataTable WHERE userId = ${userId}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, userData: result.recordset[0] });
  } catch (error) {
    console.error("DB error fetching user data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
