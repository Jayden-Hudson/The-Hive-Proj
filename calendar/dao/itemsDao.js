// dao/itemsDao.js – Data Access Object for items table

const db = require('../db'); 

function all() {
  return db.prepare('SELECT * FROM events ORDER BY id').all();
}

function find(id) {
  return db.prepare('SELECT * FROM events WHERE id = ?').get(id);
}

function create({ eventName, performers, eventDate, eventTime }) {
  const stmt = db.prepare(`
    INSERT INTO events (eventName, performers, eventDate, eventTime)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(eventName, performers, eventDate, eventTime);
  return find(info.lastInsertRowid);
}

function update(id, { eventName, performers, eventDate, eventTime }) {
  const stmt = db.prepare(`
    UPDATE events
    SET eventName = ?, performers = ?, eventDate = ?, eventTime = ?
    WHERE id = ?
  `);
  const info = stmt.run(eventName, performers, eventDate, eventTime, id);
  return info.changes > 0 ? find(id) : null;
}

function destroy(id) {
  const info = db.prepare('DELETE FROM events WHERE id = ?').run(id);
  return info.changes > 0;
}

module.exports = { all, find, create, update, destroy };
