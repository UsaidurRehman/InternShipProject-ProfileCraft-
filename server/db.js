const sql = require("mssql");

const config = {
    user: "sa",
    password: "1234",
    server: "localhost",
    port: 56713,
    database: "ProfileCraft",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log("✅ Connected to MSSQL Database");
    } catch (err) {
        console.error("❌ Database connection failed: ", err);
    }
}

module.exports = { sql, connectDB };
