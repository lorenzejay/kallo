import { Response, Router } from "express";
import pool from "../db";
import authorization from "../middlewares/authorization";
import accessToProject from "../middlewares/privacyChecker";
const sharingRouter = Router();

enum Status {
  admin = "admin",
  viewer = "viewer",
  editor = "editor",
}

sharingRouter.post(
  "/share-to-user/:project_id",
  [authorization, accessToProject],
  async (req: any, res: Response) => {
    try {
      const { project_id } = req.params;

      const access = req.access;
      const adminStatus = req.adminStatus;

      if (!adminStatus) return res.send(undefined);

      const {
        status,
        shared_user_email,
      }: { status: Status; shared_user_email: string } = req.body;
      //check if the user being shared to exists
      const userExistsQuery = await pool.query(
        "SELECT user_id FROM users WHERE email = $1",
        [shared_user_email]
      );

      if (userExistsQuery.rows[0] === undefined)
        return res.send({
          success: false,
          message: `User with email ${shared_user_email} does not have an account.`,
        });

      // console.log(userExistsQuery.rows);
      //check if we already shared to this user already
      const sharedWithUserCheckerQuery = await pool.query(
        "SELECT shared_id FROM shared_users WHERE shared_user = $1 AND shared_project = $2",
        [userExistsQuery.rows[0].user_id, project_id]
      );
      if (sharedWithUserCheckerQuery.rowCount > 0)
        return res.send({
          success: false,
          message: `User ${shared_user_email} has access to the project already.`,
        });

      //check if user is admin or owner of the project
      if (!access || !adminStatus) {
        return res.send({
          success: false,
          message:
            "Only admins or project owner can share the project to others.",
        });
      }
      await pool.query(
        "INSERT INTO shared_users (shared_user, shared_project ,status) VALUES ($1,$2,$3)",
        [userExistsQuery.rows[0].user_id, project_id, status]
      );
      res.send({ success: true, message: "Successfully shared the project" });
    } catch (error) {
      console.log(error.message);
      res.send(error.message);
    }
  }
);

sharingRouter.get(
  "/list-of-shared-users/:project_id",
  [authorization],
  async (req: any, res: Response) => {
    try {
      const { project_id } = req.params;

      const query = await pool.query(
        "SELECT shared_user, status, shared_id FROM shared_users WHERE shared_project = $1",
        [project_id]
      );

      res.send(query.rows);
    } catch (error) {
      console.log(error);
    }
  }
);

//update a users status
sharingRouter.put(
  "/update-user-status/:project_id",
  [authorization, accessToProject],
  async (req: any, res: Response) => {
    try {
      const { status, shared_id }: { status: Status; shared_id: string } =
        req.body;
      // const { project_id } = req.params;

      const isAdmin = req.adminStatus;

      if (!isAdmin) {
        return res.status(403).send({
          success: false,
          message: "You do not have access to update the status of the user",
        });
      }

      await pool.query(
        "UPDATE shared_users SET status = $1 WHERE shared_id = $2",
        [status, shared_id]
      );
      res.send({ success: true, message: "Updated Completed" });
    } catch (error) {
      console.log(error);
      res
        .status(403)
        .send({ success: false, message: "Unable to update users status" });
    }
  }
);

//get shared projects
sharingRouter.get(
  "/get-shared-projects",
  authorization,
  async (req: any, res: Response) => {
    try {
      const user_id = req.user;
      const query = await pool.query(
        "SELECT * FROM projects WHERE project_id IN (SELECT shared_project FROM shared_users WHERE shared_user = $1) ORDER BY created_at DESC",
        [user_id]
      );

      res.send(query.rows);
    } catch (error) {
      console.log(error);
    }
  }
);

export default sharingRouter;
