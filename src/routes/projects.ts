import { Response, Router } from "express";
import pool from "../db";
import authorization from "../middlewares/authorization";
import hasProjectAccess from "../middlewares/hasProjectAccess";
const projectRouter = Router();
export interface ProjectDeets {
  project_id: string;
  header_img: string;
  project_owner: string;
  created_at: string;
  project_title: string;
  is_private: boolean;
}

//get project details and columns - project_owner, created_at, boards
projectRouter.get("/project-assets/:project_id", async (req, res) => {
  try {
    const { project_id } = req.params;
    if (!project_id) return;

    //project_owner, created_on, header_img,  board columns
    const query1 = await pool.query<{
      project_id: string;
      header_img: string;
      project_owner: string;
      created_at: string;
      is_private: boolean;
      title: string;
    }>("SELECT * FROM projects WHERE project_id = $1", [project_id]);
    let projectDeets: ProjectDeets = {
      project_id: "",
      header_img: "",
      project_owner: "",
      created_at: "",
      is_private: false,
      project_title: "",
    };
    // console.log(query1.rows[0]);
    if (!query1.rows[0]) return;
    projectDeets.project_id = query1.rows[0].project_id;
    projectDeets.header_img = query1.rows[0].header_img;
    projectDeets.project_owner = query1.rows[0].project_owner;
    projectDeets.created_at = query1.rows[0].created_at;
    projectDeets.project_title = query1.rows[0].title;
    projectDeets.is_private = query1.rows[0].is_private;

    res.send(projectDeets);
  } catch (error) {
    console.error(error);
  }
});

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

//get project_owner_username
projectRouter.get(
  "/project-owner/:owner_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { owner_id } = req.params;
      const query = await pool.query(
        "SELECT username FROM users WHERE user_id = $1",
        [owner_id]
      );
      res.json(query.rows[0].username);
      if (!user_id) return;
    } catch (error: any) {
      res.send(error);
      console.error(error);
    }
  }
);

//get project_details
projectRouter.get(
  "/details/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const { project_id } = req.params;
      const query = await pool.query(
        "SELECT * FROM projects WHERE project_id = $1",
        [project_id]
      );
      res.json(query.rows[0]);
      if (!user_id) return;
    } catch (error: any) {
      res.send(error);
      console.error(error);
    }
  }
);

//get all the projects the user has
export interface AllUserProjects {
  project_id: string;
  title: string;
  is_private: boolean;
  header_img: string;
  project_owner: string;
  created_at: string;
}
projectRouter.get(
  "/get-all-user-projects",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      // the user exists already because they won't be able to get on the page if they are not logged in with the authorization middleware
      const usersProjects = await pool.query(
        "SELECT * FROM projects WHERE project_owner = $1 order by created_at desc",
        [user_id]
      );
      res.send(usersProjects.rows);
    } catch (error) {
      console.error(error);
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
      res.send({ success: true, message: "New Project Created" });
    } catch (error) {
      console.log(error);
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

projectRouter.put(
  "/update-project-title/:project_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;

      const { title } = req.body;
      const { project_id } = req.params;

      //user needs to either be the project owner or shared user
      const query = await pool.query(
        "UPDATE projects SET title = $1 WHERE project_id = $2 RETURNING *",
        [title, project_id]
      );
      if (query.rowCount < 0)
        res.status(400).send("Something went wrong when updating the title.");
      res.send("Successfully updated the title");
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
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
      const user_id: string = req.user;
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
      const { shared_user_email, can_edit, given_admin_status } = req.body;
      //admins cannot make other people admins only the project_owner has that privledge
      //1. check if the user_id is the owner of the project or an admin
      const verifyQuery1 = await pool.query(
        "SELECT project_owner FROM projects WHERE project_id = $1",
        [project_id]
      );
      const verifyQuery2 = await pool.query<{ is_admin: boolean }>(
        "SELECT is_admin FROM shared_users WHERE shared_user = $1",
        [user_id]
      );
      const { project_owner } = verifyQuery1.rows[0];
      const { is_admin } = verifyQuery2.rows[0];
      if (project_owner !== user_id || !is_admin) {
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
      if (checkedSharedUsers.rows[0].user_id === user_id) {
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
