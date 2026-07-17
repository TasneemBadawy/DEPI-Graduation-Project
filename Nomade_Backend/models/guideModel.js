import db from "../config/database.js";

// Find guide by email
export const findGuideByEmail = (Email) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Tourguide WHERE Email = ?`;
    
    db.query(sql, [Email], (err, results) => {
      if (err) {
        console.error("Error finding guide by email:", err);
        return reject(err);
      }
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};

// Create guide with all related data
export const createGuide = async (
  FName,
  LName,
  Email,
  Password,
  Country,
  About,
  FaceBook,
  Linkedin,
  Instagram,
  phoneNumbers = [],
  specializations = [],
  certificates = [],
  languages = [],
  Profile_Image
) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Creating guide with data:", {
        FName,
        LName,
        Email,
        Country,
        About,
        Profile_Image
      });

      // Check if Tourguide table exists and has correct columns
      const checkTableSql = `SHOW COLUMNS FROM Tourguide`;
      db.query(checkTableSql, (checkErr, columns) => {
        if (checkErr) {
          console.error("Error checking Tourguide table:", checkErr);
          return reject(new Error("Tourguide table doesn't exist or cannot be accessed"));
        }
        
        const columnNames = columns.map(c => c.Field);
        console.log("Tourguide columns:", columnNames);
        
        // Check if Profile_Image column exists
        if (!columnNames.includes('Profile_Image')) {
          console.warn("Profile_Image column not found in Tourguide table");
        }
      });

      // Insert guide - use correct column names
      const guideSql = `
        INSERT INTO Tourguide 
        (FName, LName, Email, Password, Country, About, FaceBook, Linkedin, Instagram${Profile_Image ? ', Profile_Image' : ''})
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?${Profile_Image ? ', ?' : ''})
      `;

      const params = [
        FName,
        LName,
        Email,
        Password,
        Country || null,
        About || null,
        FaceBook || null,
        Linkedin || null,
        Instagram || null,
      ];
      
      if (Profile_Image) {
        params.push(Profile_Image);
      }

      console.log("SQL:", guideSql);
      console.log("Params:", params);

      db.query(guideSql, params, async (err, result) => {
        if (err) {
          console.error("Error inserting guide:", err);
          console.error("SQL Error:", err.sqlMessage);
          return reject(err);
        }

        const guideId = result.insertId;
        console.log(`Guide created with ID: ${guideId}`);

        // Insert related data (with error handling for each)
        try {
          // Insert phone numbers
          if (phoneNumbers && phoneNumbers.length > 0) {
            const phoneSql = `INSERT INTO Guide_PhoneNumbers (G_ID, Phone_Number) VALUES ?`;
            const phoneValues = phoneNumbers.map((phone) => [guideId, phone]);
            await new Promise((resolvePhone, rejectPhone) => {
              db.query(phoneSql, [phoneValues], (phoneErr) => {
                if (phoneErr) {
                  console.warn("Phone numbers insertion failed:", phoneErr.message);
                  resolvePhone(); // Don't fail the whole operation
                } else {
                  console.log(`Inserted ${phoneNumbers.length} phone numbers`);
                  resolvePhone();
                }
              });
            });
          }
        } catch (err) {
          console.warn("Error with phone numbers:", err.message);
        }

        try {
          // Insert specializations
          if (specializations && specializations.length > 0) {
            const specSql = `INSERT INTO Guide_Specializations (G_ID, Specialization) VALUES ?`;
            const specValues = specializations.map((spec) => [guideId, spec]);
            await new Promise((resolveSpec, rejectSpec) => {
              db.query(specSql, [specValues], (specErr) => {
                if (specErr) {
                  console.warn("Specializations insertion failed:", specErr.message);
                  resolveSpec();
                } else {
                  console.log(`Inserted ${specializations.length} specializations`);
                  resolveSpec();
                }
              });
            });
          }
        } catch (err) {
          console.warn("Error with specializations:", err.message);
        }

        try {
          // Insert certificates
          if (certificates && certificates.length > 0) {
            const certSql = `INSERT INTO Guide_Certificates (G_ID, Certificate) VALUES ?`;
            const certValues = certificates.map((cert) => [guideId, cert]);
            await new Promise((resolveCert, rejectCert) => {
              db.query(certSql, [certValues], (certErr) => {
                if (certErr) {
                  console.warn("Certificates insertion failed:", certErr.message);
                  resolveCert();
                } else {
                  console.log(`Inserted ${certificates.length} certificates`);
                  resolveCert();
                }
              });
            });
          }
        } catch (err) {
          console.warn("Error with certificates:", err.message);
        }

        try {
          // Insert languages
          if (languages && languages.length > 0) {
            const langSql = `INSERT INTO Guide_Languages (G_ID, Language) VALUES ?`;
            const langValues = languages.map((lang) => [guideId, lang]);
            await new Promise((resolveLang, rejectLang) => {
              db.query(langSql, [langValues], (langErr) => {
                if (langErr) {
                  console.warn("Languages insertion failed:", langErr.message);
                  resolveLang();
                } else {
                  console.log(`Inserted ${languages.length} languages`);
                  resolveLang();
                }
              });
            });
          }
        } catch (err) {
          console.warn("Error with languages:", err.message);
        }

        resolve({ guideId, inserted: true });
      });
    } catch (err) {
      console.error("Error in createGuide:", err);
      reject(err);
    }
  });
};

// Get all guides
export const getAllGuides = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Tourguide`;

    db.query(sql, async (err, guides) => {
      if (err) return reject(err);

      const guidesWithDetails = await Promise.all(
        guides.map(async (guide) => {
          return await getGuideCompleteProfile(guide.Guide_ID);
        }),
      );

      resolve(guidesWithDetails);
    });
  });
};

// Get guide by ID
export const getGuideCompleteProfile = (guideId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Tourguide WHERE Guide_ID = ?`;

    db.query(sql, [guideId], async (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      const guide = results[0];
      delete guide.Password;
      
      // Fetch phone numbers
      const phoneSql = `SELECT Phone_Number FROM Guide_PhoneNumbers WHERE G_ID = ?`;
      const phoneNumbers = await new Promise((resolvePhone, rejectPhone) => {
        db.query(phoneSql, [guideId], (phoneErr, phoneResults) => {
          if (phoneErr) rejectPhone(phoneErr);
          else resolvePhone(phoneResults.map((p) => p.Phone_Number));
        });
      });

      // Fetch specializations
      const specSql = `SELECT Specialization FROM Guide_Specializations WHERE G_ID = ?`;
      const specializations = await new Promise((resolveSpec, rejectSpec) => {
        db.query(specSql, [guideId], (specErr, specResults) => {
          if (specErr) rejectSpec(specErr);
          else resolveSpec(specResults.map((s) => s.Specialization));
        });
      });

      // Fetch certificates
      const certSql = `SELECT Certificate FROM Guide_Certificates WHERE G_ID = ?`;
      const certificates = await new Promise((resolveCert, rejectCert) => {
        db.query(certSql, [guideId], (certErr, certResults) => {
          if (certErr) rejectCert(certErr);
          else resolveCert(certResults.map((c) => c.Certificate));
        });
      });

      // Fetch languages
      const langSql = `SELECT Language FROM Guide_Languages WHERE G_ID = ?`;
      const languages = await new Promise((resolveLang, rejectLang) => {
        db.query(langSql, [guideId], (langErr, langResults) => {
          if (langErr) rejectLang(langErr);
          else resolveLang(langResults.map((l) => l.Language));
        });
      });

      resolve({
        ...guide,
        phoneNumbers,
        specializations,
        certificates,
        languages,
      });
    });
  });
};

// Update guide profile
export const updateGuideProfile = (guideId, updateData) => {
  return new Promise((resolve, reject) => {
    const {
      FName,
      LName,
      Email,
      Country,
      About,
      FaceBook,
      Linkedin,
      Instagram,
    } = updateData;

    const sql = `
      UPDATE Tourguide 
      SET FName = ?, LName = ?, Email = ?, Country = ?, About = ?, FaceBook = ?, Linkedin = ?, Instagram = ?
      WHERE Guide_ID = ?
    `;

    db.query(
      sql,
      [
        FName,
        LName,
        Email,
        Country,
        About,
        FaceBook,
        Linkedin,
        Instagram,
        guideId,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
  });
};

// Update guide phone numbers (replace all)
export const updateGuidePhoneNumbers = (guideId, phoneNumbers) => {
  return new Promise((resolve, reject) => {
    const deleteSql = `DELETE FROM Guide_PhoneNumbers WHERE G_ID = ?`;

    db.query(deleteSql, [guideId], (deleteErr) => {
      if (deleteErr) return reject(deleteErr);

      if (!phoneNumbers || phoneNumbers.length === 0) {
        return resolve({ deleted: true, inserted: 0 });
      }

      const insertSql = `INSERT INTO Guide_PhoneNumbers (G_ID, Phone_Number) VALUES ?`;
      const values = phoneNumbers.map((phone) => [guideId, phone]);

      db.query(insertSql, [values], (insertErr, result) => {
        if (insertErr) return reject(insertErr);
        resolve({ deleted: true, inserted: result.affectedRows });
      });
    });
  });
};

// Update guide specializations (replace all)
export const updateGuideSpecializations = (guideId, specializations) => {
  return new Promise((resolve, reject) => {
    const deleteSql = `DELETE FROM Guide_Specializations WHERE G_ID = ?`;

    db.query(deleteSql, [guideId], (deleteErr) => {
      if (deleteErr) return reject(deleteErr);

      if (!specializations || specializations.length === 0) {
        return resolve({ deleted: true, inserted: 0 });
      }

      const insertSql = `INSERT INTO Guide_Specializations (G_ID, Specialization) VALUES ?`;
      const values = specializations.map((spec) => [guideId, spec]);

      db.query(insertSql, [values], (insertErr, result) => {
        if (insertErr) return reject(insertErr);
        resolve({ deleted: true, inserted: result.affectedRows });
      });
    });
  });
};

// Update guide certificates (replace all)
export const updateGuideCertificates = (guideId, certificates) => {
  return new Promise((resolve, reject) => {
    const deleteSql = `DELETE FROM Guide_Certificates WHERE G_ID = ?`;

    db.query(deleteSql, [guideId], (deleteErr) => {
      if (deleteErr) return reject(deleteErr);

      if (!certificates || certificates.length === 0) {
        return resolve({ deleted: true, inserted: 0 });
      }

      const insertSql = `INSERT INTO Guide_Certificates (G_ID, Certificate) VALUES ?`;
      const values = certificates.map((cert) => [guideId, cert]);

      db.query(insertSql, [values], (insertErr, result) => {
        if (insertErr) return reject(insertErr);
        resolve({ deleted: true, inserted: result.affectedRows });
      });
    });
  });
};

// Update guide languages (replace all)
export const updateGuideLanguages = (guideId, languages) => {
  return new Promise((resolve, reject) => {
    const deleteSql = `DELETE FROM Guide_Languages WHERE G_ID = ?`;

    db.query(deleteSql, [guideId], (deleteErr) => {
      if (deleteErr) return reject(deleteErr);

      if (!languages || languages.length === 0) {
        return resolve({ deleted: true, inserted: 0 });
      }

      const insertSql = `INSERT INTO Guide_Languages (G_ID, Language) VALUES ?`;
      const values = languages.map((lang) => [guideId, lang]);

      db.query(insertSql, [values], (insertErr, result) => {
        if (insertErr) return reject(insertErr);
        resolve({ deleted: true, inserted: result.affectedRows });
      });
    });
  });
};

// Delete Guide by ID
export const deleteGuideById = (guideId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Tourguide WHERE Guide_ID = ?`;

    db.query(sql, [guideId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Search Guides by Country and Specialization
export const searchAndFilterGuides = (Country, specialization) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT DISTINCT g.Guide_ID 
      FROM Tourguide g
      LEFT JOIN Guide_Specializations s ON g.Guide_ID = s.G_ID
      WHERE 1=1
    `;
    const params = [];

    if (Country && Country.trim() !== "") {
      sql += ` AND g.Country LIKE ?`;
      params.push(`%${Country}%`);
    }

    if (specialization && specialization.trim() !== "") {
      sql += ` AND s.Specialization LIKE ?`;
      params.push(`%${specialization}%`);
    }

    db.query(sql, params, async (err, rows) => {
      if (err) return reject(err);

      if (rows.length === 0) {
        return resolve([]);
      }

      try {
        const fullGuidesResults = [];

        for (const row of rows) {
          const guideId = row.Guide_ID;

          const guideInfo = await new Promise((resGuide, rejGuide) => {
            db.query(
              "SELECT * FROM Tourguide WHERE Guide_ID = ?",
              [guideId],
              (err, res) => {
                if (err) rejGuide(err);
                else resGuide(res[0]);
              },
            );
          });

          const phoneNumbers = await new Promise((resPhone, rejPhone) => {
            db.query(
              "SELECT Phone_Number FROM Guide_PhoneNumbers WHERE G_ID = ?",
              [guideId],
              (err, res) => {
                if (err) rejPhone(err);
                else resPhone(res.map((p) => p.Phone_Number));
              },
            );
          });

          const specializations = await new Promise((resSpec, rejSpec) => {
            db.query(
              "SELECT Specialization FROM Guide_Specializations WHERE G_ID = ?",
              [guideId],
              (err, res) => {
                if (err) rejSpec(err);
                else resSpec(res.map((s) => s.Specialization));
              },
            );
          });

          const certificates = await new Promise((resCert, rejCert) => {
            db.query(
              "SELECT Certificate FROM Guide_Certificates WHERE G_ID = ?",
              [guideId],
              (err, res) => {
                if (err) rejCert(err);
                else resCert(res.map((c) => c.Certificate));
              },
            );
          });

          const languages = await new Promise((resLang, rejLang) => {
            db.query(
              "SELECT Language FROM Guide_Languages WHERE G_ID = ?",
              [guideId],
              (err, res) => {
                if (err) rejLang(err);
                else resLang(res.map((l) => l.Language));
              },
            );
          });

          const completeGuide = {
            ...guideInfo,
            phoneNumbers,
            specializations,
            certificates,
            languages,
          };

          delete completeGuide.Password;

          fullGuidesResults.push(completeGuide);
        }

        resolve(fullGuidesResults);
      } catch (innerErr) {
        reject(innerErr);
      }
    });
  });
};