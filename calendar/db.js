// db.js – SQLite connection + table bootstrap

const path = require('path');
const Database = require('better-sqlite3');

// NOTE: Students can rename this file for their project if desired.
const dbFile = path.join(__dirname, 'events.db');
const db = new Database(dbFile);

// Good practice: enable foreign keys even if not used yet
db.pragma('foreign_keys = ON');

// TEMP generic schema – students will customize this in Week 14
// Fields here are intentionally generic: name, detail, value
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eventName TEXT NOT NULL,
    performers TEXT,
    eventDate TEXT NOT NULL,
    eventTime TEXT NOT NULL
  );
`);

module.exports = db;
