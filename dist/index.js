"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const projects_1 = __importDefault(require("./routes/projects"));
// const express = require("express");
// const cors = require("cors");
const app = express_1.default();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(cors_1.default());
app.get("/", (req, res) => {
    res.send("Server is running");
});
//routes
app.use("/api/users", users_1.default);
app.use("/api/projects", projects_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
