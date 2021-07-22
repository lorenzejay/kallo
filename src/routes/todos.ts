import { Response, Router } from "express";
import pool from "../db";
import authorization from "../middlewares/authorization";

const todoRouter = Router();

//fetch all todos of a task
todoRouter.get("/get-all-todos/:task_id", async (req: any, res: Response) => {
  try {
    const { task_id } = req.params;
    const todos = await pool.query(
      "SELECT * FROM todos WHERE task_id = $1 ORDER BY index ASC",
      [task_id]
    );
    if (todos.rowCount < 1)
      return res.send({ completedTodos: [], notCompletedTodos: [] });
    const completedTodos = todos.rows.filter(
      (todo) => todo.is_checked === true
    );
    const notCompletedTodos = todos.rows.filter(
      (todo) => todo.is_checked === false
    );

    res.send({ completedTodos, notCompletedTodos });
  } catch (error) {
    console.error(error);
  }
});

//create a todo
todoRouter.post("/create-todo/:task_id", async (req: any, res: Response) => {
  try {
    const { task_id } = req.params;
    type CreateTodo = {
      description: string;
      parent_todo: string;
      index: number;
      is_child: boolean;
    };
    const { description, parent_todo, index, is_child }: CreateTodo = req.body;
    //find what index it needs to go ~ default index is the next one
    const todos = await pool.query(
      "SELECT * FROM todos WHERE task_id = $1 ORDER BY index ASC",
      [task_id]
    );
    //is a parent todo ~ not indented
    if (!is_child) {
      const currentIndex = todos.rowCount;

      const createQuery = await pool.query(
        "INSERT INTO todos (description, index, task_id) VALUES ($1, $2, $3)",
        [description, currentIndex, task_id]
      );
      res.send("added a new todo");
    }
  } catch (error) {
    console.error(error);
  }
});

//toggle todo completion
todoRouter.put(
  "/update-todo-is-checked/:todo_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { is_checked } = req.body;
      const { todo_id } = req.params;
      const query = await pool.query(
        "UPDATE todos SET is_checked = $1 WHERE todo_id = $2",
        [is_checked, todo_id]
      );

      res.send("Updated Todo is_checked");
    } catch (error) {
      console.log(error);
    }
  }
);

//update the todo description text ~ todo_id, description
todoRouter.put(
  "/update-todo-description/:todo_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { description } = req.body;
      const { todo_id } = req.params;

      const query = await pool.query(
        "UPDATE todos SET description = $1 WHERE todo_id = $2",
        [description, todo_id]
      );

      res.send("Updated Todo's description");
    } catch (error) {
      console.error(error);
    }
  }
);

//delete todo
todoRouter.delete(
  "/delete-todo/:todo_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;

      const { todo_id } = req.params;

      const query = await pool.query("DELETE FROM todos WHERE todo_id = $1 ", [
        todo_id,
      ]);
      res.send("Successfully Deleted ");
    } catch (error) {
      console.error(error);
    }
  }
);

export default todoRouter;
