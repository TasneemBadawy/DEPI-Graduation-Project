import express from "express";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import reviewRoutes from './routes/reviewRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import activityRoutes from "./routes/activityRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
//import { version } from "react";
config();

import swaggerDocs from "./swagger/swaggerDocs.js";


const app = express();

swaggerDocs(app);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
/*const options = {
  definition:
const swaggerSpec = swaggerJsdoc(options);*/



app.use("/api/auth", authRoutes);
app.use("/api", tourRoutes);
app.use("/api", activityRoutes);
app.use("/api", guideRoutes);
app.use("/reviews", reviewRoutes);
app.use("/booking", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
