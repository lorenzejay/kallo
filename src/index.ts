import express, { Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/users";
import ProjectRouter from "./routes/projects";

// const express = require("express");
// const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});
//routes
app.use("/api/users", userRouter);
app.use("/api/projects", ProjectRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
