const express = require("express");

const cors = require("cors");

const routes = require("./routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.originalUrl}`, req.body);
  next();
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.listen(5000, () => {
  console.log("server running on port 5000");
});