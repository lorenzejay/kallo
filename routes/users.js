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

//post route for logining in users
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //get the user details by checking the username
    const query = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    //if there are no users associated with the given username

    if (query.rows.length === 0) {
      return res.json({ success: false, message: "User Email or Password is incorrect" });
    } else {
      const savedHashPassword = query.rows[0].password;
      await bycrypt.compare(password, savedHashPassword, function (err, isMatch) {
        if (err) {
          throw err;
        } else if (!isMatch) {
          return res.json({ success: false, message: "User Email or Password is incorrect" });
        } else {
          //passwrods match so we should authenticate user
          const token = jwtGenerator(query.rows[0].user_id);

          return res.json({ success: true, token });
        }
      });
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
