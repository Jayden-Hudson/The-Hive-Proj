// dao/itemsDao.js – Data Access Object for items table

const db = require('../db'); 

function all() {
  return db.prepare('SELECT * FROM events ORDER BY eventID').all();
}

function find(eventID) {
  return db.prepare('SELECT * FROM events WHERE eventID = ?').get(eventID);
}

function create({ title, description, eventDate, eventTime, venueID }) {
  const stmt = db.prepare(`
    INSERT INTO events (title, description, eventDate, eventTime, venueID)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(title, description, eventDate, eventTime, venueID);
  return find(info.lastInsertRowid);
}

function update(eventID, { title, description, eventDate, eventTime, venueID }) {
  const stmt = db.prepare(`
    UPDATE events
    SET title = ?, description = ?, eventDate = ?, eventTime = ?, venueID = ?
    WHERE eventID = ?
  `);
  const info = stmt.run(title, description, eventDate, eventTime, venueID, eventID);
  return info.changes > 0 ? find(eventID) : null;
}

function destroy(eventID) {
  const info = db.prepare('DELETE FROM events WHERE eventID = ?').run(eventID);
  return info.changes > 0;
}

module.exports = { all, find, create, update, destroy };
