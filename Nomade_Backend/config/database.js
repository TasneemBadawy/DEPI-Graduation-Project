//const express = require("express");
import express from "express";
import { createPool } from "mysql2";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 3000;

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 3306,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

app.get("/users", (req, res) => {
  pool.query("SELECT * FROM user", (err, Results) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(Results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default pool;
