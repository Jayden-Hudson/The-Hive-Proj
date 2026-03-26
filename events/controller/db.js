const { Pool } = require('pg');

const pool = new Pool({
  host: 'hive-postgres-db.chm4siqec45u.us-east-2.rds.amazonaws.com',
  port: 5432,
  user: 'Hivepostgres',
  password: 'KnM3XC8tzh5z',
  database: 'Goldenfield Database', 
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;