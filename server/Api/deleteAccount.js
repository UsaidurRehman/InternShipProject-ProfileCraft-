//Delete user account
const express = require("express");
const { sql } = require("../db"); // Make sure db.js exports sql connection
const router = express.Router();

router.delete("/deleteAccount/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const transaction = new sql.Transaction();

    await transaction.begin();

    const request = new sql.Request(transaction);

    // Delete from related tables
    await request.query(`DELETE FROM UserDataTable WHERE userId = ${userId}`);
    await request.query(`DELETE FROM UsersCV WHERE userid = ${userId}`);
    await request.query(`DELETE FROM userdata WHERE id = ${userId}`);

    await transaction.commit();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);

    try {
      if (transaction) await transaction.rollback();
    } catch (rollbackError) {
      console.error("Error rolling back transaction:", rollbackError);
    }

    res.status(500).json({ message: "Failed to delete account" });
  }
});

module.exports = router;
