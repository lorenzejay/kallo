import { Request, Response, Router } from "express";
import pool from "../db";
// const pool = require("../db.js");
import bcrypt from "bcrypt";
import jwtGenerator from "../utils/jwtGenerator";
import authorization from "../middlewares/authorization";
// const bycrypt = require("bcrypt");
// const jwtGenerator = require("../utils/jwtGenerator");
// const authorization = require("../middlewares/authorization.js");
const userRouter = Router();
userRouter.post("/register", async (req, res) => {
  try {
    //we need username, firstname, lastname,email, and password
    const { username, first_name, last_name, email, password } = req.body;

    //check if user exists already then throw error
    const checker = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    const isTaken = checker.rowCount;

    if (isTaken !== 0) {
      return res.status(401).json({
        success: false,
        message:
          "There is already an account associate with the email or username.",
      });
    }

    //bycrypt users password

    const saltRounds = 10;

    const salt = await bcrypt.genSalt(saltRounds);

    const bcryptPassword = await bcrypt.hash(password, salt);

    const noSpaceUsernameAndMakeLowerCase = await username
      .split(" ")
      .join("")
      .toLowerCase();

    const newUser = await pool.query(
      "INSERT INTO users(username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        noSpaceUsernameAndMakeLowerCase,
        first_name,
        last_name,
        email,
        bcryptPassword,
      ]
    );

    //genrate jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    //this is what is returned when our call is successful
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error.message);
  }
});

//post route for logining in users
userRouter.post("/login", async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;

    //get the user details by checking the username
    const query = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    //if there are no users associated with the given username

    if (query.rows.length === 0) {
      return res.json({
        success: false,
        message: "User Email or Password is incorrect",
      });
    } else {
      const savedHashPassword = query.rows[0].password;
      await bcrypt.compare(
        password,
        savedHashPassword,
        function (err, isMatch) {
          if (err) {
            throw err;
          } else if (!isMatch) {
            return res.json({
              success: false,
              message: "User Email or Password is incorrect",
            });
          } else {
            //passwrods match so we should authenticate user
            const token = jwtGenerator(query.rows[0].user_id);

            return res.json({ success: true, token });
          }
        }
      );
    }
  } catch (error) {
    console.error("user error login", error.message);
  }
});

//get user details
userRouter.get(
  "/identification",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      if (!user_id) return;
      const query = await pool.query(
        "SELECT user_id FROM users where user_id = $1",
        [user_id]
      );

      if (query.rowCount === 0) {
        return res
          .status(404)
          .json({ error: "Something went wrong, please try again." });
      }
      res.status(200).json(query.rows[0]);
    } catch (error) {
      console.log(error.message);
    }
  }
);
//get user details
userRouter.get("/details", authorization, async (req: any, res: Response) => {
  try {
    const user_id = req.user;
    if (!user_id) return;
    const query = await pool.query(
      "SELECT user_id, username, first_name, last_name, email FROM users where user_id = $1",
      [user_id]
    );

    if (query.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Something went wrong, please try again." });
    }
    res.status(200).json(query.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

userRouter.get("/username", authorization, async (req: any, res: Response) => {
  try {
    const user_id = req.user;
    if (!user_id) return;
    const query = await pool.query(
      "SELECT username FROM users WHERE user_id = $1",
      [user_id]
    );
    if (query.rowCount === 0) return;
    res.status(200).json(query.rows[0].username);
  } catch (error) {
    throw new Error("Unable to get username");
  }
});
export default userRouter;
