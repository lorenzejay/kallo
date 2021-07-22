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
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
// const pool = require("../db.js");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtGenerator_1 = __importDefault(require("../utils/jwtGenerator"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
// const bycrypt = require("bcrypt");
// const jwtGenerator = require("../utils/jwtGenerator");
// const authorization = require("../middlewares/authorization.js");
const userRouter = express_1.Router();
userRouter.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //we need username, firstname, lastname,email, and password
        const { username, first_name, last_name, email, password } = req.body;
        //check if user exists already then throw error
        const checker = yield db_1.default.query("SELECT * FROM users WHERE email = $1 OR username = $2", [email, username]);
        const isTaken = checker.rowCount;
        if (isTaken !== 0) {
            return res.status(401).json({
                success: false,
                message: "There is already an account associate with the email or username.",
            });
        }
        //bycrypt users password
        const saltRounds = 10;
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const bcryptPassword = yield bcrypt_1.default.hash(password, salt);
        const noSpaceUsernameAndMakeLowerCase = yield username
            .split(" ")
            .join("")
            .toLowerCase();
        const newUser = yield db_1.default.query("INSERT INTO users(username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *", [
            noSpaceUsernameAndMakeLowerCase,
            first_name,
            last_name,
            email,
            bcryptPassword,
        ]);
        //genrate jwt token
        const token = jwtGenerator_1.default(newUser.rows[0].user_id);
        //this is what is returned when our call is successful
        res.json({
            success: true,
            token,
        });
    }
    catch (error) {
        console.log(error.message);
    }
}));
//post route for logining in users
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //get the user details by checking the username
        const query = yield db_1.default.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        //if there are no users associated with the given username
        if (query.rows.length === 0) {
            return res.json({
                success: false,
                message: "User Email or Password is incorrect",
            });
        }
        else {
            const savedHashPassword = query.rows[0].password;
            yield bcrypt_1.default.compare(password, savedHashPassword, function (err, isMatch) {
                if (err) {
                    throw err;
                }
                else if (!isMatch) {
                    return res.json({
                        success: false,
                        message: "User Email or Password is incorrect",
                    });
                }
                else {
                    //passwrods match so we should authenticate user
                    const token = jwtGenerator_1.default(query.rows[0].user_id);
                    return res.json({ success: true, token });
                }
            });
        }
    }
    catch (error) {
        console.error("user error login", error.message);
    }
}));
//get user details
userRouter.get("/identification", authorization_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user;
        if (!user_id)
            return;
        const query = yield db_1.default.query("SELECT user_id FROM users where user_id = $1", [user_id]);
        if (query.rowCount === 0) {
            return res
                .status(404)
                .json({ error: "Something went wrong, please try again." });
        }
        res.status(200).json(query.rows[0]);
    }
    catch (error) {
        console.log(error.message);
    }
}));
//get user details
userRouter.get("/details", authorization_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user;
        if (!user_id)
            return;
        const query = yield db_1.default.query("SELECT * FROM users where user_id = $1", [
            user_id,
        ]);
        if (query.rowCount === 0) {
            return res
                .status(404)
                .json({ error: "Something went wrong, please try again." });
        }
        res.status(200).json(query.rows[0]);
    }
    catch (error) {
        console.log(error.message);
    }
}));
userRouter.get("/username", authorization_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user;
        if (!user_id)
            return;
        const query = yield db_1.default.query("SELECT username FROM users WHERE user_id = $1", [user_id]);
        if (query.rowCount === 0)
            return;
        res.status(200).json(query.rows[0].username);
    }
    catch (error) {
        throw new Error("Unable to get username");
    }
}));
exports.default = userRouter;
