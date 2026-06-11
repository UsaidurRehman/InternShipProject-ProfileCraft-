require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


connectDB();


const registerRoute = require("./Api/Register");
const signinRoute = require("./Api/Signin");
const submitCvRoute = require("./Api/submitCv");
const checkUserDataRoute = require("./Api/checkUserData");
const userDataRoute = require("./Api/userData");
const templatesRoute = require("./Api/templates");
const jobsRoute = require("./Api/jobs"); 
const saveCVRoute = require("./Api/SaveCv");
const userCVsRoute = require("./Api/usersCVs");
const deleteAccountRoute = require("./Api/deleteAccount");


app.use("/api", registerRoute);       
app.use("/api", signinRoute);         
app.use("/api", submitCvRoute);       
app.use("/api", templatesRoute);
app.use("/api", userDataRoute);
app.use("/api", checkUserDataRoute);
app.use("/api/jobs", jobsRoute);           
app.use("/api/saveCv", saveCVRoute);
app.use("/api/userCVs", userCVsRoute);
app.use("/api", deleteAccountRoute);



app.get("/api/users", async (req, res) => {
  try {
    const { sql } = require("./db");
    const result = await sql.query`SELECT * FROM userdata`;
    const users = result.recordset;
    let html = `
    <style>
      table { border-collapse: collapse; width: 100%; }
      th { background: linear-gradient(135deg, #061857, #3f74b9); color: white; padding: 10px; text-align: left; }
      td { padding: 10px; border: 1px solid #ddd; }
    </style>
    <h1 style="text-align:center; font-size:3rem;">Users List</h1>
    <table border="5" cellpadding="5" cellspacing="0" style="margin: 0 auto; color:brown; box-shadow:15px 15px 15px grey">
      <tr>
        ${Object.keys(users[0] || {}).map(col => `<th>${col}</th>`).join('')}
      </tr>
      ${users.map(user => `
        <tr>
          ${Object.values(user).map(val => `<td>${val === null ? '' : val}</td>`).join('')}
        </tr>
      `).join('')}
    </table>
    `;
    res.send(html);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
