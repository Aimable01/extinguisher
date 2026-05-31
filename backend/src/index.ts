import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import swaggerUi from "swagger-ui-express";

import { connectDB } from "./config/db";

import { swaggerSpec } from "./config/swagger";

import authRoutes from "./routes/authRoutes";
import extinguisherRoutes from "./routes/extinguisherRoutes";

import { startCronJobs } from "./services/cronService";

import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();

const app = express();

app.use(morgan("dev"));

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Fire Extinguisher Management API",
    documentation: "/api-docs",
  });
});

app.get("/health", (req, res) => {
  return res.json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);

app.use("/api/extinguishers", extinguisherRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    startCronJobs();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

startServer();
