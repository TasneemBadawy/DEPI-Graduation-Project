import db from "../config/database.js";
import mysql from "mysql2";

export const findTouristByEmail = (Email) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM User WHERE Email = ?`;
    db.query(sql, [Email], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

export const createTourist = (FName, LName, Email, Password , Profile_Image) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO User (FName, LName, Email, Password , Profile_Image) VALUES (?, ?, ?, ?)`;
    db.query(sql, [FName, LName, Email, Password , Profile_Image], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const getTouristById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT User_ID, FName, LName, Email FROM User WHERE User_ID = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

export const updateTouristProfileInDB = (id, FName, LName, Email) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE User SET FName = ?, LName = ?, Email = ? WHERE User_ID = ?`;
    db.query(sql, [FName, LName, Email, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
