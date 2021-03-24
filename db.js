const Pool = require("pg").Pool;
require("dotenv").config();

const devConfig = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
};

// const prodConfig = {
//   connectionString: process.env.DATABASE_URL, //THIS COMES FROM HEROKU ADD ON
//   ssl: {
//     rejectUnauthorized: false,
//   },
// };

const pool = new Pool(devConfig);

module.exports = pool;
