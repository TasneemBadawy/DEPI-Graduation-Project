import db from "../config/database.js";
import mysql from "mysql2";

export const findGuideById = (Guide_ID)=>{

     return new Promise((resolve , reject) =>{
           const sql = `
            Select *
            From Tourguide
            Where Guide_ID = ?
            `;
            db.query(sql , [Guide_ID] , (err , result) =>{

                if(err){
                    return reject(err);
                }

                resolve(result);
            })
     })
};

export const checkExistingBooking = (User_ID, Guide_ID)=>{

     return new Promise((resolve , reject) =>{

        const sql = `
         Select *
         From Bookings
         Where U_ID = ? AND Guide_ID = ?
         `;

         db.query(sql , [User_ID , Guide_ID] , (err , result) =>{
            if(err){
                return reject(err);
            }
            resolve(result);
         })
     })
};

export const createBooking = (User_ID, Guide_ID) =>{

     return new Promise((resolve , reject) =>{
         
        const sql = `
          INSERT INTO Bookings (U_ID, Guide_ID)
          VALUES (?, ?) 
          `;

         db.query(sql , [User_ID , Guide_ID] , (err , result) =>{

            if(err){
                return reject(err);
            }

            resolve(result);
         });
     });
};

export const getBookingsByUserId = (User_ID) =>{

     return new Promise((resolve , reject) =>{

        const sql = `
           Select *
           From Bookings
           Where U_ID = ?
           `;

        db.query(sql , [User_ID] , (err , result) =>{

            if(err){
                return reject(err);
            }

            resolve(result);
        });   
     });
};

export const getBookingById = (Booking_ID) => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT *
            FROM Bookings
            WHERE Booking_ID = ?
        `;

        db.query(sql, [Booking_ID], (err, result) => {

            if (err) {
                return reject(err);
            }

            resolve(result);

        });

    });

};

export const deleteBooking = (Booking_ID)=>{

    return new Promise((resolve , reject) =>{

        const sql = `
        Delete 
        From Bookings
        Where Booking_ID = ?
        `;

        db.query(sql , [Booking_ID] , (err , result) =>{

            if(err){
                return reject(err);
            }

            resolve(result);
        });
    });
};