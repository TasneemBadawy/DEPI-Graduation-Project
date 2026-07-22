import db from "../config/database.js";

export const findAdminByEmail = (Email) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Admins WHERE Email = ?`;
    db.query(sql, [Email], (err, result) => {
      if (err) {
        console.error("❌ Error finding admin:", err.message);
        reject(err);
      } else {
        console.log("🔍 Admin query result:", result.length > 0 ? "Found" : "Not found");
        resolve(result[0]);
      }
    });
  });
};

export const createAdmin = (FName, LName, Email, Password, Profile_Image) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Admins (FName, LName, Email, Password, Profile_Image) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [FName, LName, Email, Password, Profile_Image], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const getAdminById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Admins WHERE Admin_ID = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      if (result.length === 0) return resolve(null);
      else {
        const admin = result[0];
        delete admin.Password;
        resolve(admin);
      }
    });
  });
};

export const getAllAdmins = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Admins`;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};