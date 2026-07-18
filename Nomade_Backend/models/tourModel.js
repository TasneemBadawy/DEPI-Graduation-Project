import db from "../config/database.js";

export const createTour = (
  Tour_name,
  Price_per_person,
  Country,
  City,
  Street,
  Description,
  Days,
  Nights,
  Guide_ID,
  images,
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Tours (Tour_name, Price_per_person, Country, City, Street, Description, Days, Nights, Guide_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
        Guide_ID,
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
      SELECT t.*, ti.Image_URL, t.Guide_ID
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
            Description: row.Description,
            Days: row.Days,
            Nights: row.Nights,
            Guide_ID: row.Guide_ID,
            Image_URL: null,
            images: [],
          };
        }
        if (row.Image_URL) {
          toursMap[row.Tour_ID].images.push(row.Image_URL);
          // Set first image as main
          if (!toursMap[row.Tour_ID].Image_URL) {
            toursMap[row.Tour_ID].Image_URL = row.Image_URL;
          }
        }
      });

      resolve(Object.values(toursMap));
    });
  });
};

export const getSingleTour = (Tour_ID) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT t.*, ti.Image_URL, t.Guide_ID
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
        Description: results[0].Description,
        Days: results[0].Days,
        Nights: results[0].Nights,
        Guide_ID: results[0].Guide_ID,
        Image_URL: null,
        images: [],
      };

      results.forEach((row) => {
        if (row.Image_URL) {
          tour.images.push(row.Image_URL);
          if (!tour.Image_URL) {
            tour.Image_URL = row.Image_URL;
          }
        }
      });

      resolve(tour);
    });
  });
};

export const updateTourById = (Tour_ID, updateData) => {
  return new Promise((resolve, reject) => {
    const {
      Tour_name,
      Price_per_person,
      Country,
      City,
      Street,
      Description,
      Days,
      Nights,
    } = updateData;

    const sql = `
      UPDATE Tours 
      SET Tour_name = ?, Price_per_person = ?, Country = ?, City = ?, 
          Street = ?, Description = ?, Days = ?, Nights = ?
      WHERE Tour_ID = ?
    `;

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
        Tour_ID,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
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
      SELECT t.*, ti.Image_URL, t.Guide_ID
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
            Description: row.Description,
            Days: row.Days,
            Nights: row.Nights,
            Guide_ID: row.Guide_ID,
            Image_URL: null,
            images: [],
          };
        }
        if (row.Image_URL) {
          toursMap[row.Tour_ID].images.push(row.Image_URL);
          if (!toursMap[row.Tour_ID].Image_URL) {
            toursMap[row.Tour_ID].Image_URL = row.Image_URL;
          }
        }
      });

      resolve(Object.values(toursMap));
    });
  });
};