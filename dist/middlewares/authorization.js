"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
//checks if the token is valid
const authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //pull the token from the request of the user
        const jwtToken = req.header("token");
        //if there is no token = not authorized
        if (!jwtToken) {
            return res.status(403).json("Not Authorized");
        }
        const jwtSecret = process.env.JWT_SECRET;
        //check if the json token is valid rather than a fake one inputted by a user
        const payload = jsonwebtoken_1.default.verify(jwtToken, jwtSecret);
        console.log("payload", payload);
        req.user = payload.user; //gives us access to the user id
    }
    catch (error) {
        console.log("user error", error.message);
        return res.status(403).json("Not Authorized");
    }
    next(); //moves on
});
exports.default = authorization;
