const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
require("dotenv").config();

let db;

async function connectDB() {
  db = await open({
    filename: path.resolve(
      process.env.DB_PATH || "./data/internships.db"
    ),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS internships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      stipend REAL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'applied',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("SQLite Database Connected Successfully!");

  return db;
}

function getDB() {
  if (!db) {
    throw new Error("Database is not connected");
  }

  return db;
}

module.exports = {
  connectDB,
  getDB
};