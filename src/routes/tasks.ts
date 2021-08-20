import { Response, Router } from "express";
import pool from "../db";
import authorization from "../middlewares/authorization";
import accessToProject from "../middlewares/privacyChecker";
const taskRouter = Router();

//get the specific task contents - title, createdby
taskRouter.get(
  "/get-task/:task_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { task_id } = req.params;

      //middleware to catch if you have access there

      const query = await pool.query("SELECT * FROM tasks WHERE task_id = $1", [
        task_id,
      ]);
      if (query.rowCount < 0)
        return res
          .status(404)
          .send("Something went wrong with fetching the tasks.");
      res.send(query.rows[0]);
    } catch (error) {
      console.error(error);
    }
  }
);

taskRouter.put(
  "/update-task-to-different-col/:project_id/:column_id",
  [authorization, accessToProject],
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { movingTaskId, newIndex } = req.body;
      const editingStatus: boolean = req.editingStatus;

      if (!editingStatus) return res.send(undefined);
      //to the new column
      const { column_id } = req.params;
      if (!user_id) return;

      //check the tasks in the column you will be dropping to;
      const checkerQuery = await pool.query(
        "SELECT task_id, index FROM tasks WHERE column_id = $1 ORDER BY index ASC",
        [column_id]
      );
      // if (checkerQuery.rowCount < 1) return;
      // const originalMovingTaskIndex = Object.values(
      //   checkerQuery.rows
      // ).findIndex((task) => task.task_id === movingTaskId);
      // if (originalMovingTaskIndex < 0) return;

      //checker can be empty as there can be a column with no tasks yet

      let previousTaskAtNewIndex;

      //if there is no tasks in the column
      if (checkerQuery.rowCount < 1) {
        //get the task that is in the new index position
        //set the moving task to the index 0 in the new column because column has no tasks yet
        await pool.query(
          "UPDATE tasks SET index = 0, column_id = $1 WHERE task_id = $2",
          [column_id, movingTaskId]
        );
        // //set previousTask to its new index
        // await pool.query(
        //   "UPDATE tasks SET index = $1 WHERE task_id = $2 RETURNING *",
        //   [originalMovingTaskIndex, previousTaskAtNewIndex]
        // );
        // console.log("Moved to an empty column");
        return res.json({ status: true, message: "Moved to an empty column" });
      } else {
        //newIndex can be the end of the list so its currently empty
        if (!checkerQuery.rows[newIndex]) {
          return await pool.query(
            "UPDATE tasks set index = $1, column_id = $2  WHERE task_id = $3",
            [newIndex, column_id, movingTaskId]
          );
        }
        previousTaskAtNewIndex = checkerQuery.rows[newIndex].task_id;

        //everything above the newIndex needs to move up one spot
        await pool.query(
          "UPDATE tasks SET index = index + 1 WHERE index >= $1 AND column_id = $2",
          [newIndex, column_id]
        );
        await pool.query(
          "UPDATE tasks set index = $1, column_id = $2  WHERE task_id = $3",
          [newIndex, column_id, movingTaskId]
        );
        // console.log("Moved to a column with other tasks");
        return res.send({
          success: true,
          message: "Moved to a column with values before and after it.",
        });
      }
    } catch (error) {
      console.error(error);
      res.send("Something went wrong.");
    }
  }
);

//update the task
//can be updated to be reordered in its specific column
//can be moved to a different column
taskRouter.put(
  "/update-task-within-same-col/:project_id/:column_id",
  [authorization, accessToProject],
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { movingTaskId, newIndex } = req.body;
      const { column_id } = req.params;
      const editingStatus = req.editingStatus;
      if (!editingStatus) return res.send(undefined);
      if (!user_id) return;
      //check if the task even exists;
      const checkerQuery = await pool.query(
        "SELECT task_id, index FROM tasks WHERE column_id = $1 ORDER BY index ASC",
        [column_id]
      );
      if (checkerQuery.rowCount < 1) return;
      const originalMovingTaskIndex = Object.values(
        checkerQuery.rows
      ).findIndex((task) => task.task_id === movingTaskId);
      if (originalMovingTaskIndex < 0) return;

      const previousTaskAtNewIndex = checkerQuery.rows[newIndex].task_id;

      //check if the task just moved from one spot
      if (
        newIndex - originalMovingTaskIndex === 1 ||
        originalMovingTaskIndex - newIndex === 1
      ) {
        //get the task that is in the new index position
        // console.log(previousTaskAtNewIndex);
        //set the moving task to the new index

        await pool.query("UPDATE tasks SET index = $1 WHERE task_id = $2", [
          newIndex,
          movingTaskId,
        ]);
        //set previousTask to its new index
        await pool.query(
          "UPDATE tasks SET index = $1 WHERE task_id = $2 RETURNING *",
          [originalMovingTaskIndex, previousTaskAtNewIndex]
        );
        return res.json("Moved up one spot");
      }
      if (newIndex > originalMovingTaskIndex) {
        await pool.query(
          "UPDATE tasks SET index = index - 1 WHERE index <= $1 AND column_id = $2",
          [newIndex, column_id]
        );
        await pool.query("UPDATE tasks set index = $1 WHERE task_id = $2", [
          newIndex,
          movingTaskId,
        ]);
        return res.send("Moving Up");
      } else if (newIndex < originalMovingTaskIndex) {
        //range of indexs that are affected are between the newIndex till the original Index
        //find the range of affected indexes

        await pool.query(
          "UPDATE tasks SET index = index + 1 WHERE index > $1 AND index < $2 AND column_id = $3",
          [newIndex - 1, originalMovingTaskIndex + 1, column_id]
        );
        await pool.query("UPDATE tasks set index = $1 WHERE task_id = $2", [
          newIndex,
          movingTaskId,
        ]);

        return res.send("Moving Down");
      }
    } catch (error) {
      console.error(error);
      res.send("Something went wrong.");
    }
  }
);

//create a task
taskRouter.post(
  "/create-task/:project_id/:column_id",
  [authorization, accessToProject],
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { title } = req.body;
      const { column_id } = req.params; // project_associated
      const editingStatus: boolean = req.editingStatus;
      console.log(editingStatus);

      if (!editingStatus) return res.send(undefined);

      //if there is no user return
      if (!user_id) return;
      //check how many columns are associated with the project already
      const checker = await pool.query(
        "SELECT column_id FROM tasks WHERE column_id= $1",
        [column_id]
      );

      const index = checker.rowCount;
      const query = await pool.query(
        "INSERT INTO tasks (title, column_id, index) VALUES ($1, $2, $3) RETURNING *",
        [title, column_id, index]
      );
      if (query.rowCount < 1) return;
      res.send({
        success: true,
        message: `New Task Created on index ${index}`,
      });
    } catch (error) {
      console.log(error);
      res.send({
        success: false,
        message:
          "The column associated with this new task was not found, please try again.",
      });
    }
  }
);

//delete tasks
//delete todo
taskRouter.delete(
  "/delete-task/:project_id/:task_id",
  [authorization, accessToProject],
  async (req: any, res: Response) => {
    try {
      const { task_id } = req.params;
      const editingStatus: boolean = req.editingStatus;
      if (!editingStatus) return res.send(undefined);

      await pool.query("DELETE FROM tasks WHERE task_id = $1 ", [task_id]);
      res.send({ success: true, message: "Successfully Deleted Task" });
    } catch (error) {
      console.error(error);
    }
  }
);

export default taskRouter;
