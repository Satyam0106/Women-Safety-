const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = new Set([
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://women-safety-delta.vercel.app"
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Smart Women Safety System API running" });
});

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/contacts", require("./src/routes/contactRoutes"));
app.use("/api/sos", require("./src/routes/sosRoutes"));
app.use("/api/predict-crime", require("./src/routes/crimeRoutes"));
app.use("/api/history", require("./src/routes/historyRoutes"));
app.use("/api/profile", require("./src/routes/profileRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
