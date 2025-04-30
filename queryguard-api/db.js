const { Pool } = require('pg');

const pool = new Pool({
  user: 'adminQueryGuard',
  host: 'queryguard-db.cv6s68yy2n2q.us-east-2.rds.amazonaws.com',
  database: 'queryguard_db',
  password: 'adminQueryGuard',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
