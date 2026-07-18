import db from "../config/database.js";

export const findAdminByEmail = (Email) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Admins WHERE Email = ?`;
    db.query(sql, [Email], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
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

export const updateAdminProfile = (id, FName, LName, Email, Profile_Image) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE Admins SET FName = ?, LName = ?, Email = ?, Profile_Image = ? WHERE Admin_ID = ?`;
    db.query(sql, [FName, LName, Email, Profile_Image, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const deleteAdminById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Admins WHERE Admin_ID = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};