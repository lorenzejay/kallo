import express, { Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/users";
import ProjectRouter from "./routes/projects";
import todoRouter from "./routes/todos";
import columnRouter from "./routes/columns";
import taskRouter from "./routes/tasks";
require("dotenv").config();

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
app.use("/api/todos", todoRouter);
app.use("/api/columns", columnRouter);
app.use("/api/tasks", taskRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
