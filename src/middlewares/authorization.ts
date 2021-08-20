import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
require("dotenv").config();
//checks if the token is valid
const authorization = async (req: any, res: Response, next: any) => {
  try {
    //pull the token from the request of the user
    const jwtToken = req.header("token");
    //if there is no token = not authorized
    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }
    const jwtSecret: Secret = <string>process.env.JWT_SECRET;
    //check if the json token is valid rather than a fake one inputted by a user
    const payload: any = jwt.verify(jwtToken, jwtSecret);
    req.user = payload.user; //gives us access to the user id
  } catch (error) {
    console.log("user error", error.message);
    return res.status(403).json("Not Authorized");
  }
  next(); //moves on
};
export default authorization;
