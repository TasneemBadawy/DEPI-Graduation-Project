import db from "../config/database.js";
import mysql from "mysql2";

export const createTour = (
  Tour_name,
  Price_per_person,
  Country,
  City,
  Street,
  Description,
  Days,
  Nights,
  images,
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Tours (Tour_name, Price_per_person, Country, City, Street, Description, Days, Nights) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

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

        const tourId = result.insertId;

        if (images && images.length > 0) {
          const imageSql = `INSERT INTO Tour_Images (Tour_ID, Image_URL) VALUES ?`;

          const imageValues = images.map((url) => [tourId, url]);

          db.query(imageSql, [imageValues], (imageErr) => {
            if (imageErr) return reject(imageErr);
            resolve({ tourId, imagesInserted: images.length });
          });
        } else {
          resolve({ tourId, imagesInserted: 0 });
        }
      },
    );
  });
};

export const getAllTours = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT t.*, ti.Image_URL 
      FROM Tours t
      LEFT JOIN Tour_Images ti ON t.Tour_ID = ti.Tour_ID
    `;

    db.query(sql, (err, results) => {
      if (err) return reject(err);

      const toursMap = {};
      results.forEach((row) => {
        if (!toursMap[row.Tour_ID]) {
          toursMap[row.Tour_ID] = {
            Tour_ID: row.Tour_ID,
            Tour_name: row.Tour_name,
            Price_per_person: row.Price_per_person,
            Country: row.Country,
            City: row.City,
            Street: row.Street,
            tour_Description: row.tour_Description,
            Days: row.Days,
            Nights: row.Nights,
            images: [],
          };
        }
        if (row.Image_URL) {
          toursMap[row.Tour_ID].images.push(row.Image_URL);
        }
      });

      resolve(Object.values(toursMap));
    });
  });
};

export const getSingleTour = (Tour_ID) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT t.*, ti.Image_URL 
      FROM Tours t
      LEFT JOIN Tour_Images ti ON t.Tour_ID = ti.Tour_ID
      WHERE t.Tour_ID = ?
    `;

    db.query(sql, [Tour_ID], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      const tour = {
        Tour_ID: results[0].Tour_ID,
        Tour_name: results[0].Tour_name,
        Price_per_person: results[0].Price_per_person,
        Country: results[0].Country,
        City: results[0].City,
        Street: results[0].Street,
        tour_Description: results[0].tour_Description,
        Days: results[0].Days,
        Nights: results[0].Nights,
        images: [],
      };

      results.forEach((row) => {
        if (row.Image_URL) {
          tour.images.push(row.Image_URL);
        }
      });

      resolve(tour);
    });
  });
};

export const deleteTourById = (Tour_ID) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Tours WHERE Tour_ID = ?`;
    db.query(sql, [Tour_ID], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const searchAndFilterTours = (country, city, Price) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT t.*, ti.Image_URL 
      FROM Tours t
      LEFT JOIN Tour_Images ti ON t.Tour_ID = ti.Tour_ID
      WHERE 1=1
    `;
    const params = [];

    if (country) {
      sql += ` AND t.Country LIKE ?`;
      params.push(`%${country}%`);
    }
    if (city) {
      sql += ` AND t.City LIKE ?`;
      params.push(`%${city}%`);
    }
    if (Price) {
      sql += ` AND t.Price_per_person <= ?`;
      params.push(Number(Price));
    }

    db.query(sql, params, (err, results) => {
      if (err) return reject(err);

      const toursMap = {};
      results.forEach((row) => {
        if (!toursMap[row.Tour_ID]) {
          toursMap[row.Tour_ID] = {
            Tour_ID: row.Tour_ID,
            Tour_name: row.Tour_name,
            Price_per_person: row.Price_per_person,
            Country: row.Country,
            City: row.City,
            Street: row.Street,
            tour_Description: row.tour_Description,
            Days: row.Days,
            Nights: row.Nights,
            images: [],
          };
        }
        if (row.Image_URL) {
          toursMap[row.Tour_ID].images.push(row.Image_URL);
        }
      });

      resolve(Object.values(toursMap));
    });
  });
};
