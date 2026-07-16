import db from "../config/database.js";
import mysql from "mysql2";

export const createReview = (User_ID, Guide_ID, Title, Rate, username, Content)=>{
   
    return new Promise ((resolve , reject) =>{
         
        const sql = `
              INSERT INTO Reviews
(User_ID, Guide_ID, Title, Rate, username, Content)
              values (?,?,?,?,?,?)
              `;

        db.query(sql ,[User_ID, Guide_ID, Title, Rate, username, Content]  , (err , result) =>{
            if(err){
                 return reject(err);
            }
            resolve(result);
        });     
    });
};

export const getReviewsByPlace = (Guide_ID)=>{

     return new Promise((resolve , reject) =>{

         const sql = `
         SELECT *
         FROM Reviews
         WHERE Guide_ID = ?
         `;

         db.query(sql , [Guide_ID] , (err , result) =>{

            if(err){
                return reject(err);
            }

            resolve(result);
         });
     });
};

export const getReviewsByUserId = (User_ID)=>{

     return new Promise((resolve , reject) =>{
          
         const sql = `
          Select *
          From Reviews
          Where User_ID = ?
          `;

          db.query(sql , [User_ID] , (err , result)=>{

             if(err){
                return reject(err);
             }

             resolve(result);
          });
     });
};

export const deleteReview = (ReviewId) =>{
     
     return new Promise ((resolve , reject) =>{
          
          const sql = `
           Delete 
           From Reviews
           Where Review_ID = ?
           `;

           db.query(sql , [ReviewId] , (err , result) =>{
              
               if(err){
                   return reject(err);
               }

               resolve (result);
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

            if (err) return reject(err);

            resolve(result);

        });

    });

};