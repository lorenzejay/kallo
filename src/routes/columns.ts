import { Response, Router } from "express";
import pool from "../db";
import authorization from "../middlewares/authorization";
import accessToProject from "../middlewares/privacyChecker";
const columnRouter = Router();

const getTasksForTheCol = async (arrOfCols: any[]) => {
  try {
    let allTasks = [];
    for (let col of arrOfCols) {
      const tasks = await pool.query(
        "select * from tasks where column_id = $1 order by index asc",
        [col.column_id]
      );

      // console.log("tasks", tasks.rows);
      allTasks.push({
        column_id: col.column_id,
        column_title: col.name,
        column_index: col.index,
        tasks: tasks.rows,
      });
      // allTasks.push(tasks.rows);
    }
    return allTasks;
    // return tasks.rows;
  } catch (error) {
    console.log(error);
  }
};

//fetch columns
columnRouter.get(
  "/get-project-columns/:project_id",

  async (req: any, res: Response) => {
    try {
      const { project_id } = req.params;
      if (!project_id) return;

      //get all the columns with the associated project_id
      const query = await pool.query(
        "SELECT * FROM columns WHERE project_associated = $1 ORDER BY index ASC",
        [project_id]
      );
      const board = await getTasksForTheCol(query.rows);
      // console.log("board", board);
      res.status(200).json(board);
    } catch (error) {
      console.log(error);
    }
  }
);

//create
columnRouter.post(
  "/create-column/:project_id",
  [authorization, accessToProject],
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { name } = req.body;
      const { project_id } = req.params; // project_associated
      const editingStatus = req.editingStatus;
      console.log(editingStatus);
      if (!editingStatus) return res.send(undefined);

      //if there is no user return
      if (!user_id) return;
      //check how many columns are associated with the project already
      const checker = await pool.query(
        "SELECT project_associated FROM columns WHERE project_associated= $1",
        [project_id]
      );
      // console.log(checker.rowCount);
      const index = checker.rowCount;
      const query = await pool.query(
        "INSERT INTO columns (name, project_associated, index) VALUES ($1, $2, $3) RETURNING *",
        [name, project_id, index]
      );
      if (query.rowCount < 1) return;
      // console.log(query.rows[0]);
      res.send({
        success: true,
        message: `New Column Created on index ${index}`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

// update the order of the projects based on their indexes
// takes in two specific columns that we will be moving
//cols must be from the same project
//col 1 and col 2
columnRouter.put(
  "/update-col-order/:project_id",
  [authorization, accessToProject],
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      //originalIndex is the index that was the movingCol is moving to at that index because that has the move regardless
      const { movingCol, newIndex } = req.body;
      const { project_id } = req.params;
      const editingStatus = req.editingStatus;
      if (!editingStatus) return res.send(undefined);

      if (!user_id) {
        throw new Error("You must be logged in.");
      }
      //check if the columns exist first
      const getCols = await pool.query(
        "SELECT column_id, index FROM columns WHERE project_associated = $1 ORDER BY index ASC",
        [project_id]
      );

      if (getCols.rowCount > 0) {
        const originalMovingColIndex = Object.values(getCols.rows).findIndex(
          (col) => col.column_id === movingCol
        );
        if (originalMovingColIndex < 0) return;
        //check if it only moved one spot;

        if (
          newIndex - originalMovingColIndex === 1 ||
          originalMovingColIndex - newIndex === 1
        ) {
          //update indexes here
          //grab whatever is in the new spot first;
          const previousColAtNewIndex = getCols.rows[newIndex].column_id;
          //set movingCol to the new index
          await pool.query(
            "UPDATE columns SET index = $1 WHERE column_id = $2",
            [newIndex, movingCol]
          );
          //set previousCol at the new index to
          await pool.query(
            "UPDATE columns SET index = $1 WHERE column_id = $2",
            [originalMovingColIndex, previousColAtNewIndex]
          );
          // console.log("moved only one spot");

          return res.send({ success: true, message: "moved only one spot" });
        }
        if (newIndex > originalMovingColIndex) {
          //find the range of affected indexes
          //affected indexes are all before the newIndex
          await pool.query(
            "UPDATE columns SET index = index - 1 WHERE index > $1",
            [originalMovingColIndex]
          );
          await pool.query(
            "UPDATE columns set index = $1 WHERE column_id = $2",
            [newIndex, movingCol]
          );
          // console.log("moved up");
          return res.send({ success: true, message: "Moving Up" });
        } else if (newIndex < originalMovingColIndex) {
          //range of indexs that are affected are between the newIndex till the original Index
          //find the range of affected indexes

          await pool.query(
            "UPDATE columns SET index = index + 1 WHERE index > $1 AND index < $2 ",
            [newIndex - 1, originalMovingColIndex + 1]
          );
          await pool.query(
            "UPDATE columns set index = $1 WHERE column_id = $2",
            [newIndex, movingCol]
          );
          // console.log("moved down");
          return res.send({ success: true, message: "Moving Down" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

columnRouter.put(
  "/update-column-name/:project_id/:column_id",
  [authorization, accessToProject],
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;

      const { name } = req.body;
      const { column_id } = req.params;
      const editingStatus = req.editingStatus;
      if (!editingStatus) return res.send(undefined);

      //user needs to either be the project owner or shared user
      const query = await pool.query(
        "UPDATE columns SET name = $1 WHERE column_id = $2 RETURNING *",
        [name, column_id]
      );
      if (query.rowCount < 0)
        res.status(400).send({
          success: false,
          message: "Something went wrong when updating the name of the column.",
        });
      res.send({ success: true, message: "Successfully updated the title" });
    } catch (error: any) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }
);

columnRouter.delete(
  "/delete-col/:project_id/:column_id",
  [authorization, accessToProject],
  async (req: any, res: Response) => {
    try {
      const adminStatus = req.adminStatus;
      const user_id = req.user;
      const { column_id } = req.params;
      if (!adminStatus || !user_id) return res.send(undefined);

      await pool.query("DELETE FROM columns WHERE column_id = $1", [column_id]);
      return res.send({
        success: true,
        message: "Successfully deleted the column",
      });
    } catch (error) {
      return error;
    }
  }
);

export default columnRouter;
