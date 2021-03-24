require("dotenv").config();
const jwt = require("jsonwebtoken");

//checks if the token is valid
module.exports = async (req, res, next) => {
  try {
    //pull the token from the request of the user
    const jwtToken = req.header("token");
    //if there is no token = not authorized
    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }
    //check if the json token is valid rather than a fake one inputted by a user
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

    req.user = payload.user; //gives us access to the user id
  } catch (error) {
    console.log(error.message);
    return res.status(403).json("Not Authorized");
  }
  next(); //moves on
};
