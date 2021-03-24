const jwt = require("jsonwebtoken");
require("dotenv").config(); //access to all environment variables

function jwtGenerator(user_id) {
  const payload = {
    user: user_id,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40d" });
}

module.exports = jwtGenerator;
