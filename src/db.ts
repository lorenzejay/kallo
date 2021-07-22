require("dotenv").config();
import pg, { PoolConfig } from "pg";
const Pool = pg.Pool;

const devConfig: PoolConfig = {
  user: process.env.PG_USER,
  password: process.env!.PG_PASSWORD,
  host: process.env!.PG_HOST,
  port: 5432,
  database: process.env!.PG_DATABASE,
};

// const prodConfig = {
//   connectionString: process.env.DATABASE_URL, //THIS COMES FROM HEROKU ADD ON
//   ssl: {
//     rejectUnauthorized: false,
//   },
// };

const pool = new Pool(devConfig);
export default pool;
// console.log("pool", pool);
