import path from "path";
import express, { Response } from "express";
import cors from "cors";
import userRouter from "./routes/users";
import ProjectRouter from "./routes/projects";
import todoRouter from "./routes/todos";
import columnRouter from "./routes/columns";
import taskRouter from "./routes/tasks";
import tagRouter from "./routes/tags";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

//routes
app.use("/api/users", userRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/todos", todoRouter);
app.use("/api/columns", columnRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/tags", tagRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/out/")));

  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/out/index.html"));
  });
} else {
  app.get("/", (_, res: Response) => {
    res.send("Server Started");
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
