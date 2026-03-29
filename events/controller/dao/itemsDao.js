// itemsDao.js
const pool = require('../db');

// Get all events
async function all() {
  const result = await pool.query(`SELECT * FROM event`);
  return result.rows;
}

// Create a new event
async function create({ title, description, eventdate, eventtime, venueid }) {
  console.log('DAO create called with:', { title, description, eventdate, eventtime, venueid });

  const result = await pool.query(
    `INSERT INTO event (title, description, eventdate, eventtime, venueid)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, eventdate, eventtime, venueid]
  );

  console.log('DAO insert result:', result.rows[0]);
  return result.rows[0];
}

// Get event by ID
async function getById(id) {
  try {
    const res = await pool.query('SELECT * FROM event WHERE eventid = $1', [id]);
    return res.rows[0];
  } catch (err) {
    console.error('Error fetching event by ID:', err);
    throw err;
  }
}

// Update event by ID
async function update(id, { title, description, eventdate, eventtime, venueid }) {
  console.log('DAO update called with:', { id, title, description, eventdate, eventtime, venueid });

  const result = await pool.query(
    `UPDATE event SET title = $1, description = $2, eventdate = $3, eventtime = $4, venueid = $5
     WHERE eventid = $6 RETURNING *`,
    [title, description, eventdate, eventtime, venueid, id]
  );

  console.log('DAO update result:', result.rows[0]);
  return result.rows[0];
}

async function deleteEvent(id) {
  console.log('DAO delete called with:', { id });

  const result = await pool.query(
    `DELETE FROM event WHERE eventid = $1 RETURNING *`,
    [id]
  );

  console.log('DAO delete result:', result.rows[0]);
  return result.rows[0];
}

module.exports = { all, create, getById, update, deleteEvent };