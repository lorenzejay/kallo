import jwt, { Secret } from "jsonwebtoken";
require("dotenv").config();

function jwtGenerator(user_id: string) {
  const payload = {
    user: user_id,
  };
  return jwt.sign(payload, process.env.JWT_SECRET as Secret, {
    expiresIn: "40d",
  });
}

export default jwtGenerator;
