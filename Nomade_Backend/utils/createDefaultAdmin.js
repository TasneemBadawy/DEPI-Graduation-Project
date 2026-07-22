// utils/createDefaultAdmin.js
import bcrypt from "bcrypt";
import db from "../config/database.js";

export async function createDefaultAdmin() {
  try {
    const adminEmail = "admin@nomade.com";
    const adminPassword = "admin123";
    const adminFName = "Admin";
    const adminLName = "User";

    console.log("🔍 Checking for default admin...");

    // Check if admin already exists
    const checkSql = `SELECT * FROM Admins WHERE Email = ?`;
    
    db.query(checkSql, [adminEmail], async (err, results) => {
      if (err) {
        console.error("❌ Error checking for admin:", err.message);
        return;
      }

      if (results.length > 0) {
        console.log("✅ Default admin already exists!");
        console.log("📧 Email: admin@nomade.com");
        console.log("🔑 Password: admin123");
        return;
      }

      console.log("📝 Creating default admin...");

      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Insert default admin
      const insertSql = `
        INSERT INTO Admins (FName, LName, Email, Password) 
        VALUES (?, ?, ?, ?)
      `;

      db.query(insertSql, [adminFName, adminLName, adminEmail, hashedPassword], (err, result) => {
        if (err) {
          console.error("❌ Error creating default admin:", err.message);
          return;
        }
        console.log("✅ Default admin created successfully!");
        console.log("📧 Email: admin@nomade.com");
        console.log("🔑 Password: admin123");
        console.log("🔗 Login at: http://localhost:5173/admin/login");
      });
    });
  } catch (error) {
    console.error("❌ Error in createDefaultAdmin:", error.message);
  }
}