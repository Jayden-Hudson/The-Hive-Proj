
/* const path = require('path');
const Database = require('better-sqlite3');

 const { Client } = require('pg');
        const AWS = require('aws-sdk');
        AWS.config.update({ region: 'us-east-2' });

        async function main() {
        let password = '<Enter_DB_Password>';


        const client = new Client({
        host: 'hive-postgres-db.chm4siqec45u.us-east-2.rds.amazonaws.com',
        port: 5432,
        database: 'postgres',
        user: 'Hivepostgres',
        password,
        ssl: { rejectUnauthorized: false, ca: require('fs').readFileSync('/certs/global-bundle.pem').toString() }
        });

        try {
        await client.connect();
        const res = await client.query('SELECT version()');
        console.log(res.rows[0].version);
        } catch (error) {
        console.error('Database error:', error);
        throw error;
        } finally {
        await client.end();
        }
        }
        main().catch(console.error);
       */
 
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
    eventID INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    eventDate TEXT NOT NULL,
    eventTime TEXT NOT NULL,
    venueID INTEGER NOT NULL
  );
`);

module.exports = db;

