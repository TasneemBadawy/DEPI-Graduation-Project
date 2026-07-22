import express from "express";
import cors from "cors";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import reviewRoutes from './routes/reviewRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import activityRoutes from "./routes/activityRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import swaggerDocs from "./swagger/swaggerDocs.js";
import { createDefaultAdmin } from "./utils/createDefaultAdmin.js";

config();

const app = express();

swaggerDocs(app);
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api", tourRoutes);
app.use("/api", activityRoutes);
app.use("/api", guideRoutes);
app.use("/api", uploadRoutes);
app.use("/reviews", reviewRoutes);
app.use("/booking", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
  
  // ✅ Create default admin on server start
  await createDefaultAdmin();
});