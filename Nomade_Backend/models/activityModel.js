import db from "../config/database.js";

// Create a new activity with locations
export const createActivity = (
  Activity_name,
  Category,
  Description,
  locations,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // First, insert the activity
      const sql = `INSERT INTO Activity (Activity_name, Category, Description) VALUES (?, ?, ?)`;

      db.query(
        sql,
        [Activity_name, Category, Description],
        async (err, result) => {
          if (err) return reject(err);

          const activityId = result.insertId;

          // Insert locations if provided
          if (locations && locations.length > 0) {
            const locationSql = `INSERT INTO Activity_Locations (Ac_ID, Street, City, Country) VALUES ?`;
            const locationValues = locations.map((loc) => [
              activityId,
              loc.Street,
              loc.City,
              loc.Country,
            ]);

            db.query(locationSql, [locationValues], (locationErr) => {
              if (locationErr) return reject(locationErr);
              resolve({ activityId, locationsInserted: locations.length });
            });
          } else {
            resolve({ activityId, locationsInserted: 0 });
          }
        },
      );
    } catch (err) {
      reject(err);
    }
  });
};

// Get all activities with their locations
export const getAllActivities = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT a.*, 
        al.Street as Location_Street, 
        al.City as Location_City, 
        al.Country as Location_Country
      FROM Activity a
      LEFT JOIN Activity_Locations al ON a.Activity_ID = al.Ac_ID
      ORDER BY a.Activity_ID
    `;

    db.query(sql, (err, results) => {
      if (err) return reject(err);

      // Group locations by activity
      const activitiesMap = new Map();

      results.forEach((row) => {
        if (!activitiesMap.has(row.Activity_ID)) {
          activitiesMap.set(row.Activity_ID, {
            Activity_ID: row.Activity_ID,
            Activity_name: row.Activity_name,
            Category: row.Category,
            Description: row.Description,
            Locations: [],
          });
        }

        if (row.Location_Street) {
          activitiesMap.get(row.Activity_ID).Locations.push({
            Street: row.Location_Street,
            City: row.Location_City,
            Country: row.Location_Country,
          });
        }
      });

      resolve(Array.from(activitiesMap.values()));
    });
  });
};

// Get single activity by ID with its locations
export const getActivityById = (activityId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT a.*, 
        al.Street as Location_Street, 
        al.City as Location_City, 
        al.Country as Location_Country
      FROM Activity a
      LEFT JOIN Activity_Locations al ON a.Activity_ID = al.Ac_ID
      WHERE a.Activity_ID = ?
    `;

    db.query(sql, [activityId], (err, results) => {
      if (err) return reject(err);

      if (results.length === 0) {
        return resolve(null);
      }

      const activity = {
        Activity_ID: results[0].Activity_ID,
        Activity_name: results[0].Activity_name,
        Category: results[0].Category,
        Description: results[0].Description,
        Locations: [],
      };

      results.forEach((row) => {
        if (row.Location_Street) {
          activity.Locations.push({
            Street: row.Location_Street,
            City: row.Location_City,
            Country: row.Location_Country,
          });
        }
      });

      resolve(activity);
    });
  });
};

// Delete activity by ID (cascade will delete locations automatically)
export const deleteActivityById = (activityId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Activity WHERE Activity_ID = ?`;

    db.query(sql, [activityId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
