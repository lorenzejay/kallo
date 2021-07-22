"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const pg_1 = __importDefault(require("pg"));
const Pool = pg_1.default.Pool;
const devConfig = {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: 5432,
    database: process.env.PG_DATABASE,
};
// const prodConfig = {
//   connectionString: process.env.DATABASE_URL, //THIS COMES FROM HEROKU ADD ON
//   ssl: {
//     rejectUnauthorized: false,
//   },
// };
const pool = new Pool(devConfig);
exports.default = pool;
// console.log("pool", pool);
