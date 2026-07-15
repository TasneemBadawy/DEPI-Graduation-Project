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

export const createTourist = (FName, LName, Email, Password, Profile_Image) => {
  return new Promise((resolve, reject) => {
<<<<<<< HEAD
    const sql = `INSERT INTO User (FName, LName, Email, Password , Profile_Image) VALUES (?, ?, ?, ? ,?)`;
    db.query(sql, [FName, LName, Email, Password , Profile_Image], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
=======
    const sql = `INSERT INTO User (FName, LName, Email, Password , Profile_Image) VALUES (?, ?, ?, ?,?)`;
    db.query(
      sql,
      [FName, LName, Email, Password, Profile_Image],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      },
    );
>>>>>>> 0ae9d2ba25712ba0e430d3ee5617272d731970cd
  });
};

export const getTouristById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT *FROM User WHERE User_ID = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      if (result.length === 0) return resolve(null);
      else {
        const tourist = result[0];
        delete tourist.Password;
        resolve(tourist);
      }
    });
  });
};

export const updateTouristProfileInDB = (
  id,
  FName,
  LName,
  Email,
  Profile_Image,
) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE User SET FName = ?, LName = ?, Email = ?, Profile_Image = ? WHERE User_ID = ?`;
    db.query(sql, [FName, LName, Email, Profile_Image, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Delete tourist by ID
export const deleteTouristById = (touristId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM User WHERE User_ID = ?`;

    db.query(sql, [touristId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
