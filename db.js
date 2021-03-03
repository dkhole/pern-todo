const Pool = require("pg").Pool;
require('dotenv').config();

const devConfig = {
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE
}

const prodConfig = {
    connectionString: process.env.DATABASE_URL //heroku postgres addon
}

const pool = new Pool(process.env.NODE_ENV === "production" ? prodConfig : devConfig);

module.exports = pool;