const router = require("express").Router();
const pool = require("../db.js");
const bycrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator.js");
const authorization = require("../middlewares/authorization");

router.post("/register", async (req, res) => {
  try {
    //we need username, firstname, lastname,email, and password
    const { username, first_name, last_name, email, password } = req.body;

    //check if user exists already then throw error
    const checker = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $2", [
      email,
      username,
    ]);
    const isTaken = checker.rowCount;

    if (isTaken !== 0) {
      return res.status(401).json({
        success: false,
        message: "There is already an account associate with the email or username.",
      });
    }

    //bycrypt users password

    const saltRounds = 10;

    const salt = await bycrypt.genSalt(saltRounds);

    const bycryptPassword = await bycrypt.hash(password, salt);

    const noSpaceUsernameAndMakeLowerCase = await username.split(" ").join("").toLowerCase();

    const newUser = await pool.query(
      "INSERT INTO users(username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [noSpaceUsernameAndMakeLowerCase, first_name, last_name, email, bycryptPassword]
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

module.exports = router;
