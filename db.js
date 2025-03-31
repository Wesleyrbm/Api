const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:uTV7Y3Gm1HQJJWWa@externally-infinite-elver.data-1.use1.tembo.io:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
