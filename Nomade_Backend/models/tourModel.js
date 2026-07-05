import db from "../config/database.js";
import mysql from "mysql2";
// Create tour
export const createTour = (
  Tour_name,
  Price_per_person,
  Country,
  City,
  Street,
  Description,
  Days,
  Nights,
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Tours(Tour_name, Price_per_person,Country , City, Street, tour_Description,Days,Nights)VALUES (?, ?, ?, ?, ?, ?, ?,?)`;

    db.query(
      sql,
      [
        Tour_name,
        Price_per_person,
        Country,
        City,
        Street,
        Description,
        Days,
        Nights,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
};

// Get all tours
export const getAllTours = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Tours`;

    db.query(sql, (err, result) => {
      if (err) return reject(err);
      if (result.length == 0) resolve("There does not exist any tours now");
      resolve(result);
    });
  });
};

// Get single tour
export const getSingleTour = (Tour_ID) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM Tours
      WHERE Tour_ID = ?`;
    db.query(sql, [Tour_ID], (err, result) => {
      if (err) return reject("Tour doesn't exist", err);
      if (result.length == 0) resolve("Tour not found");
      resolve(result[0]);
    });
  });
};

// Delete tour
export const deleteTourById = (Tour_ID) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Tours WHERE Tour_ID = ?`;

    db.query(sql, [Tour_ID], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

/*************************Search and Filter Tours*********************/

export const searchAndFilterTours = (Country, City, Price_per_person) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM Tours WHERE 1=1`;
    const params = [];

    if (Country) {
      sql += ` AND Country LIKE ?`;
      params.push(`%${Country}%`);
    }

    if (City) {
      sql += ` AND City LIKE ?`;
      params.push(`%${City}%`);
    }

    if (Price_per_person) {
      sql += ` AND Price_per_person <= ?`;
      params.push(Number(Price_per_person));
    }

    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
