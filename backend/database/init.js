require("dotenv").config();

const fs = require("fs");
const path = require("path");

const db = require("../config/db");

const run = async () => {
  const schemaSql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const seedSql = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");

  await db.query(schemaSql);
  await db.query(seedSql);

  console.log("Database schema and seed data applied.");
  await db.pool.end();
};

run().catch(async (error) => {
  console.error(error);
  await db.pool.end();
  process.exit(1);
});
