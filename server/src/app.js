import dotenv from "dotenv";
dotenv.config(); // 👈 FIRST. NOTHING ABOVE THIS.
import express from "express";
import cors from "cors";
import morgan from "morgan";
import planRoutes from "./routes/plan.routes.js";
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/plans", planRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "CEREBRO API" });
});

export default app;
