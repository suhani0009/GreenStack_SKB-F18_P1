import 'dotenv/config';

import cors from "cors";
import express from "express";

import authRoutes from "./routes/authRoutes.js";
import emissionsRoutes from "./routes/emissionsRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import scenarioRoutes from "./routes/scenarioRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "greenstack-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRoutes);
app.use("/emissions", emissionsRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/reports", reportRoutes);
app.use("/scenario", scenarioRoutes);
app.use("/settings", settingsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(`GreenStack API running on port ${port}`);
});