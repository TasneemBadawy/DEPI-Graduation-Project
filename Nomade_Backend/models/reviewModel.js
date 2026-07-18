import db from "../config/database.js";
import mysql from "mysql2";

export const createReview = (User_ID, Guide_ID, Title, Rate, username, Content) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO Reviews (User_ID, Guide_ID, Title, Rate, username, Content)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [User_ID, Guide_ID, Title, Rate, username, Content], (err, result) => {
      if (err) {
        console.error("SQL Error in createReview:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

// ✅ FIXED: Get reviews by Guide ID - always return array
export const getReviewsByPlace = (Guide_ID) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * 
      FROM Reviews 
      WHERE Guide_ID = ?
      ORDER BY Review_ID DESC
    `;

    db.query(sql, [Guide_ID], (err, result) => {
      if (err) {
        console.error("SQL Error in getReviewsByPlace:", err);
        return reject(err);
      }
      // Always return an array, even if empty
      resolve(result || []);
    });
  });
};

export const getReviewsByUserId = (User_ID) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM Reviews
      WHERE User_ID = ?
      ORDER BY Review_ID DESC
    `;

    db.query(sql, [User_ID], (err, result) => {
      if (err) {
        console.error("SQL Error in getReviewsByUserId:", err);
        return reject(err);
      }
      resolve(result || []);
    });
  });
};

export const deleteReview = (ReviewId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE 
      FROM Reviews
      WHERE Review_ID = ?
    `;

    db.query(sql, [ReviewId], (err, result) => {
      if (err) {
        console.error("SQL Error in deleteReview:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

export const getReviewById = (Review_ID) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM Reviews
      WHERE Review_ID = ?
    `;

    db.query(sql, [Review_ID], (err, result) => {
      if (err) {
        console.error("SQL Error in getReviewById:", err);
        return reject(err);
      }
      resolve(result || []);
    });
  });
};