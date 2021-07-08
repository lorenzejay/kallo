require("dotenv").config();
import pg, { PoolConfig } from "pg";
const Pool = pg.Pool;
// declare var process: {
//   env: {
//     PG_HOST: string;
//     PG_USER: string;
//     PG_PASSWORD: string;
//     PG_DATABASE: string;
//     PG_PORT: number;
//   };
// };

const devConfig: PoolConfig = {
  user: process.env.PG_USER,
  password: process.env!.PG_PASSWORD,
  host: process.env!.PG_HOST,
  port: 5432,
  database: process.env!.PG_DATABASE,
};
console.log("devConfig", devConfig);

// const prodConfig = {
//   connectionString: process.env.DATABASE_URL, //THIS COMES FROM HEROKU ADD ON
//   ssl: {
//     rejectUnauthorized: false,
//   },
// };

const pool = new Pool(devConfig);
export default pool;
// console.log("pool", pool);
