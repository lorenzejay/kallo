import { Response, Router } from "express";
import pool from "../db";
import authorization from "../middlewares/authorization";
import hasProjectAccess from "../middlewares/hasProjectAccess";
const projectRouter = Router();
//get specific project
projectRouter.get(
  "/project/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { project_id } = req.params;

      //check if the project even exists
      const projectExistQuery = await pool.query(
        "SELECT * FROM projects WHERE project_id = $1",
        [project_id]
      );
      if (!projectExistQuery.rows[0]) {
        return res.json({
          success: false,
          message: "This project does not exist.",
        });
      }

      //check the security if its private or public
      const checkSecurityQuery = await pool.query(
        "SELECT project_owner, is_private FROM projects WHERE project_id = $1",
        [project_id]
      );
      const { is_private, project_owner } = checkSecurityQuery.rows[0];

      //check if you are part of those who the project is shared to
      const sharedToMeChecker = await pool.query(
        "SELECT shared_user FROM shared_users WHERE shared_project = $1",
        [project_id]
      );
      const isSharedToUserAlreadyChecker = sharedToMeChecker.rows.find(
        (x) => x.shared_user === user_id
      );

      //public = false anyone can see
      //private = true only owner can see for now and then shared future
      if (
        is_private === false ||
        project_owner === user_id ||
        isSharedToUserAlreadyChecker
      ) {
        const query = await pool.query(
          "SELECT * FROM projects WHERE project_id = $1",
          [project_id]
        );
        return res.status(200).json(query.rows[0]);
      }
      // res.send({ success: false, message: "You do not have access to see this project." });
    } catch (error) {
      console.log(error.message);
    }
  }
);

//CREATING A PROJECT
// projectRouter.post("/add", authorization, async (req:any, res: Response) => {
//   try {
//     const user_id = req.user;
//     const { title, header_img, is_private } = req.body;

//     //security check (check if the logged in user is the one actually making the project)
//     if (!user_id) return;

//     const query = await pool.query(
//       "INSERT INTO projects (title, is_private, header_img, project_owner) VALUES ($1, $2, $3, $4) RETURNING *",
//       [title, is_private, header_img, user_id]
//     );
//     if (query.rowCount > 0) {
//       res.send({ success: true, message: "New Project Created" });
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// });

projectRouter.post(
  "/create-project",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { title, header_img, is_private } = req.body;

      //if there is no user return
      if (!user_id) return;
      const query = await pool.query(
        "INSERT INTO projects (title, is_private, header_img, project_owner) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, is_private, header_img, user_id]
      );
      if (query.rowCount < 1) return;
      console.log(query.rows[0]);
      res.send({ success: true, message: "New Project Created" });
    } catch (error) {
      console.log(error);
    }
  }
);

projectRouter.post(
  "/create-column/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { name } = req.body;
      const { project_id } = req.params; // project_associated
      //handle index here or on the frontend?

      //if there is no user return
      if (!user_id) return;
      //check how many columns are associated with the project already
      const checker = await pool.query(
        "SELECT project_associated FROM columns WHERE project_associated= $1",
        [project_id]
      );
      console.log(checker.rowCount);
      const index = checker.rowCount;
      const query = await pool.query(
        "INSERT INTO columns (name, project_associated, index) VALUES ($1, $2, $3) RETURNING *",
        [name, project_id, index]
      );
      if (query.rowCount < 1) return;
      console.log(query.rows[0]);
      res.send({
        success: true,
        message: `New Column Created on index ${index}`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

//update the task
//can be updated to be reordered in its specific column
//can be moved to a different column
projectRouter.put(
  "/update-task-within-same-col/:column_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { movingTaskId, newIndex } = req.body;
      const { column_id } = req.params;
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
        console.log(previousTaskAtNewIndex);
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
projectRouter.put(
  "/update-task-to-different-col/:column_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { movingTaskId, newIndex, prev_col_id } = req.body;
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
        return res.json("Moved to an empty column");
      } else {
        previousTaskAtNewIndex = checkerQuery.rows[newIndex].task_id;
        //everything above the newIndex needs to move up one spot
        await pool.query(
          "UPDATE tasks SET index = index + 1 WHERE index >= $1 AND column_id = $2",
          [newIndex, column_id]
        );
        await pool.query("UPDATE tasks set index = $1 WHERE task_id = $2", [
          newIndex,
          movingTaskId,
        ]);
        return res.send("Moved to a column with values before and after it.");
      }
    } catch (error) {
      console.error(error);
      res.send("Something went wrong.");
    }
  }
);

// update the order of the projects based on their indexes
// takes in two specific columns that we will be moving
//cols must be from the same project
//col 1 and col 2
projectRouter.put(
  "/update-col-order/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      //originalIndex is the index that was the movingCol is moving to at that index because that has the move regardless
      const { movingCol, newIndex } = req.body;
      const { project_id } = req.params;
      if (!user_id) {
        throw new Error("You must be logged in.");
      }
      //check if the columns exist first
      const getCols = await pool.query(
        "SELECT column_id, index FROM columns WHERE project_associated = $1 ORDER BY index ASC",
        [project_id]
      );

      if (getCols.rowCount > 0) {
        const originalMovingColIndex = await Object.values(
          getCols.rows
        ).findIndex((col) => col.column_id === movingCol);
        if (originalMovingColIndex < 0) return;
        //check if it only moved one spot;

        if (
          newIndex - originalMovingColIndex === 1 ||
          originalMovingColIndex - newIndex === 1
        ) {
          //update indexes here
          //grab whatever is in the new spot first;
          const previousColAtNewIndex = getCols.rows[newIndex].column_id;
          console.log("previousColAtNewIndex", previousColAtNewIndex);
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

          return res.send("moved only one spot");
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
          return res.send("Moving Up");
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

          return res.send("Moving Down");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

//get all columns associated with the project
projectRouter.get(
  "/get-project-columns/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { project_id } = req.params;
      //if there is no user return
      if (!user_id || !project_id) return;

      //get all the columns with the associated project_id
      const query = await pool.query(
        "SELECT * FROM columns WHERE project_associated = $1 ORDER BY index ASC",
        [project_id]
      );
      console.log(typeof Object.values(query.rows));
      res.status(200).json(Object.values(query.rows));
    } catch (error) {
      console.log(error);
    }
  }
);

//create a task
projectRouter.post(
  "/create-task/:column_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { title } = req.body;
      const { column_id } = req.params; // project_associated
      //handle index here or on the frontend?

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
        error:
          "The column associated with this new task was not found, please try again.",
      });
    }
  }
);

//add a todo
projectRouter.post(
  "/add-todo/:task_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { description } = req.body;
      const { task_id } = req.params; // task referenenced

      //if there is no user return
      if (!user_id) return;

      //check how many todos exist within the task already
      const checker = await pool.query(
        "SELECT task_id FROM todos WHERE task_id = $1",
        [task_id]
      );
      console.log(checker);
      const index = checker.rowCount;
      const query = await pool.query(
        "INSERT INTO todos (description, index, task_id, parent_todo) VALUES ($1, $2, $3, $4) RETURNING *",
        [description, index, task_id, null]
      );
      if (query.rowCount < 1) return;
      res.send({
        success: true,
        message: `New Todo Created on index ${index}`,
      });
    } catch (error) {
      console.log(error);
      res.send({
        success: false,
        error:
          "The task associated with this new todo was not found, please try again.",
      });
    }
  }
);

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
        tasks: tasks.rows,
      });
      allTasks.push(tasks.rows);
    }
    return allTasks;
    // return tasks.rows;
  } catch (error) {
    console.log(error);
  }
};
//get all the columns and tasks for the project
projectRouter.get(
  "/get-entire-board/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;

      const { project_id } = req.params;
      if (!user_id) return;
      // const query = await pool.query(
      //   "select tasks.task_id, tasks.index, columns.column_id, tasks.title from columns right join tasks on tasks.column_id = columns.column_id where columns.project_associated = $1 order by columns.index asc",
      //   [project_id]
      // );
      const getColumns = await pool.query(
        "select * from columns where project_associated = $1 order by index asc",
        [project_id]
      );
      // let tasksForEveryCol;
      if (getColumns.rowCount < 1) return;
      // sample state
      const board = await getTasksForTheCol(getColumns.rows);
      // console.log(tasks);

      return res.send(board);
    } catch (error) {
      console.error(error);
    }
  }
);

//get a users projects
projectRouter.get(
  "/get-user-projects",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      if (!user_id) return; //do nothing if not signed in

      const query = await pool.query(
        "SELECT * FROM projects WHERE project_owner = $1 ORDER BY created_at DESC",
        [user_id]
      );

      res.status(200).json(query.rows);
    } catch (error) {
      console.log(error.message);
    }
  }
);

//handle adding, updating, anything to do with the kanban board
projectRouter.put(
  "/add-column/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      //need to be an array of objects
      const { columns } = req.body;
      const { project_id } = req.params;
      if (!project_id) return;
      console.log("columns", columns);
      //verify we are thje owner or a member of the project
      const verifyQuery = await pool.query(
        "SELECT project_owner FROM projects WHERE project_id = $1",
        [project_id]
      );
      const { project_owner } = verifyQuery.rows[0];

      const sharedToMeChecker = await pool.query(
        "SELECT shared_user, can_edit FROM shared_users WHERE shared_project = $1",
        [project_id]
      );
      const isSharedToUserAlreadyChecker = sharedToMeChecker.rows.find(
        (x) => x.shared_user === user_id
      );

      if (
        project_owner !== user_id &&
        isSharedToUserAlreadyChecker &&
        !isSharedToUserAlreadyChecker.can_edit
      ) {
        return res.send({
          success: false,
          message: "Modifications to this project will not be saved.",
        });
      }

      //convert to json as we are passing to a json format
      const columnsInJsonFormat = JSON.stringify(columns);
      // console.log(columnsInJsonFormat);
      //update the column
      const updatedColumns = await pool.query(
        "UPDATE projects SET columns = $1 WHERE project_id = $2 RETURNING *",
        [columnsInJsonFormat, project_id]
      );
      //return the current array
      const cols = updatedColumns.rows;
      res.status(200).json({ columns: cols });
    } catch (error) {
      console.log(error);
    }
  }
);

// adding a new task to the kanban board
projectRouter.post(
  "/add-new-task/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      // we are manually creating the task_id and title
      const { task_id, title } = req.body;
      const { project_id } = req.params;
      //verify we are thje owner or a member of the project
      const verifyQuery = await pool.query(
        "SELECT project_owner FROM projects WHERE project_id = $1",
        [project_id]
      );
      const { project_owner } = verifyQuery.rows[0];

      const sharedToMeChecker = await pool.query(
        "SELECT shared_user, can_edit FROM shared_users WHERE shared_project = $1",
        [project_id]
      );
      const isSharedToUserAlreadyChecker = sharedToMeChecker.rows.find(
        (x) => x.shared_user === user_id
      );

      if (
        project_owner !== user_id &&
        isSharedToUserAlreadyChecker &&
        !isSharedToUserAlreadyChecker.can_edit
      ) {
        return res.send({
          success: false,
          message: "Modifications to this project will not be saved.",
        });
      }
      //now we insert to the db
      await pool.query(
        "INSERT INTO tasks(task_id, title, project) VALUES ($1, $2, $3)",
        [task_id, title, project_id]
      );
    } catch (error) {
      console.log(error);
    }
  }
);

//just get the columns from the project
projectRouter.get(
  "/get-board-columns/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { project_id } = req.params;

      //make sure we allowed to see the project
      const verifyQuery = await pool.query(
        "SELECT project_owner FROM projects WHERE project_id = $1",
        [project_id]
      );
      // return res.json(verifyQuery.rows[0]);
      const { project_owner } = verifyQuery.rows[0];

      const sharedToMeChecker = await pool.query(
        "SELECT shared_user FROM shared_users WHERE shared_project = $1",
        [project_id]
      );
      const isSharedToUserAlreadyChecker = sharedToMeChecker.rows.find(
        (x) => x.shared_user === user_id
      );

      if (project_owner !== user_id && !isSharedToUserAlreadyChecker) {
        return res.send({
          success: false,
          message: "You do not have authorization to modify this project.",
        });
      }
      //else show the columns only - because kanban board only needs access to the columns
      const query = await pool.query(
        "SELECT columns FROM projects WHERE project_id = $1",
        [project_id]
      );

      res.json(query.rows[0].columns);
    } catch (error) {
      console.log(error.message);
    }
  }
);

//update the privacy settings of the project
projectRouter.put(
  "/update-privacy/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { project_id } = req.params;
      const { is_private } = req.body;

      const verifyQuery = await pool.query(
        "SELECT project_owner FROM projects WHERE project_id = $1",
        [project_id]
      );
      const { project_owner } = verifyQuery.rows[0];
      if (project_owner !== user_id) {
        return res.send({
          success: false,
          message: "You do not have authorization to modify this project.",
        });
      }

      //else we update the is_private column
      const query = await pool.query(
        "UPDATE projects SET is_private = $1 WHERE project_id = $2 RETURNING * ",
        [is_private, project_id]
      );
      res.json(query.rows[0]);
    } catch (error) {
      console.log(error);
    }
  }
);

//get all the users that are shared to on your project
projectRouter.get(
  "/shared-users/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { project_id } = req.params;
      if (!user_id) return;
      const getUserName = await pool.query(
        "SELECT username, user_id FROM users WHERE user_id = $1",
        [user_id]
      );
      const query = await pool.query(
        "SELECT username, user_id FROM users WHERE user_id IN (SELECT shared_user FROM shared_users WHERE shared_project = $1)",
        [project_id]
      );
      // const query = await pool.query("SELECT shared_id FROM shared_users WHERE shared_project = $1", [
      //   project_id,
      // ]);
      const projectOwner = getUserName.rows[0];
      const sharedUsers = query.rows;

      res.json([projectOwner, ...sharedUsers]);
    } catch (error) {
      console.log(error);
    }
  }
);

//invite users
projectRouter.post(
  "/share/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { project_id } = req.params;
      const { shared_user_email, can_edit } = req.body;

      //1. check if the user_id is the owner
      const verifyQuery = await pool.query(
        "SELECT project_owner FROM projects WHERE project_id = $1",
        [project_id]
      );
      const { project_owner } = verifyQuery.rows[0];
      if (project_owner !== user_id) {
        return res.send({
          success: false,
          message: "You do not have authorization to modify this project.",
        });
      }
      //2. if false return no authorization / else true we need to verify that the user we sent the share access to is a user in our app

      const checkIsAUser = await pool.query(
        "SELECT user_id, username FROM users WHERE email = $1",
        [shared_user_email]
      );
      if (!checkIsAUser.rows[0]) {
        return res.send({
          success: false,
          message: "There is no user associated with that email.",
        });
      }
      //make sure you dont share it to yourself or to someone already added on the project
      const checkedSharedUsers = await pool.query(
        "SELECT shared_user FROM shared_users WHERE shared_project = $1",
        [project_id]
      );
      //check if you shared to yourself
      if (checkIsAUser.rows[0].user_id === user_id) {
        return res.send({
          success: false,
          message: "You cannot share the project to yourself.",
        });
      }

      const isSharedToUserAlreadyChecker = checkedSharedUsers.rows.find(
        (x) => x.shared_user === checkIsAUser.rows[0].user_id
      );

      // return res.json(isSharedToUserAlreadyChecker ? true : false);

      //check if you shared to someone already shared
      if (isSharedToUserAlreadyChecker) {
        return res.send({
          success: false,
          message: `This project is already being shared with the user associated with ${shared_user_email}.`,
        });
      }

      await pool.query(
        "INSERT INTO shared_users (shared_user, shared_project, can_edit) VALUES ($1, $2, $3)",
        [checkIsAUser.rows[0].user_id, project_id, can_edit]
      );

      return res.json({
        success: true,
        message: `${checkIsAUser.rows[0].username} now access to your project.`,
      });

      //3. if was shared to a user thats not themselves and does exist => insert else send back error message
    } catch (error) {
      console.log(error);
    }
  }
);

//get all projects that are shared with the user
projectRouter.get(
  "/shared-projects",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const query = await pool.query(
        "SELECT project_id, title, header_img FROM projects WHERE project_id IN (SELECT shared_project FROM shared_users WHERE shared_user = $1)",
        [user_id]
      );
      res.json(query.rows);
    } catch (error) {
      console.log(error);
    }
  }
);

projectRouter.delete(
  "/delete-project/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      //need to be an array of objects
      const { project_id } = req.params;
      //verify we are thje owner or a member of the project
      const verifyQuery = await pool.query(
        "SELECT project_owner FROM projects WHERE project_id = $1",
        [project_id]
      );
      const { project_owner } = verifyQuery.rows[0];
      if (project_owner !== user_id) {
        return res.send({
          success: false,
          message: "Only the project owner can delete the project.",
        });
      }
      //delete the project
      await pool.query("DELETE FROM projects WHERE project_id = $1", [
        project_id,
      ]);
      res.json({ success: true, message: "Successfully deleted project." });
    } catch (error) {
      console.log(error);
    }
  }
);

//get project owner
projectRouter.get(
  "/project-owner/:project_id",
  async (req: any, res: Response) => {
    try {
      //need to be an array of objects
      const { project_id } = req.params;

      //   const query = await pool.query(
      // "SELECT username, user_id FROM users WHERE user_id IN (SELECT shared_user FROM shared_users WHERE shared_project = $1)",
      // [project_id]

      const getOwnerQuery = await pool.query(
        "SELECT username FROM users WHERE user_id IN (SELECT project_owner FROM projects WHERE project_id = $1)",
        [project_id]
      );

      res.json(getOwnerQuery.rows[0]);
    } catch (error) {
      console.log(error);
    }
  }
);

projectRouter.get(
  "/verify-project-access/:project_id",
  hasProjectAccess,
  async (req: any, res: Response) => {
    try {
      const { project_id } = req.params;
      console.log(req);
      // console.log(projectAccess);
      res.send("s");
    } catch (error) {
      console.log(error);
    }
  }
);

projectRouter.put(
  "/update-header-img/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { project_id } = req.params;
      const { header_img } = req.body;
      //verify we are thje owner or a member of the project
      const verifyQuery = await pool.query(
        "SELECT project_owner FROM projects WHERE project_id = $1",
        [project_id]
      );
      const { project_owner } = verifyQuery.rows[0];
      if (project_owner !== user_id) {
        return res.send({
          success: false,
          message: "Only the project owner can update the project's header.",
        });
      }
      //delete the project
      await pool.query(
        "UPDATE projects SET header_img = $1 WHERE project_id = $2",
        [header_img, project_id]
      );
      res.json({
        success: true,
        message: "Successfully updated the project header.",
      });
    } catch (error) {
      console.log(error);
    }
  }
);

export default projectRouter;
