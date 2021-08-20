import { NextFunction, Response } from "express";
import pool from "../db";

enum Status {
  admin = "admin",
  viewer = "viewer",
  editor = "editor",
}

const accessToProject = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { project_id } = req.params;
    const user_id = req.user;
    if (!user_id) return;

    //check if youre not the owner
    const projectOwners = await pool.query(
      "SELECT project_owner FROM projects WHERE project_id = $1",
      [project_id]
    );

    //check if we are the owner of the project
    // console.log(projectOwners.rows[0]);
    // console.log(user_id);
    if (projectOwners.rows[0].project_owner !== user_id) {
      req.access = false;
      req.adminStatus = false;
      req.editingStatus = false;
    } else {
      req.access = true;
      req.adminStatus = true;
      req.editingStatus = true;
      return next();
    }
    const checker = await pool.query<{ status: Status; shared_user: string }>(
      "SELECT status, shared_user FROM shared_users WHERE shared_project = $1",
      [project_id]
    );

    const verifyUser = checker.rows.find(
      (sharedUser) => sharedUser.shared_user === user_id
    );

    if (!verifyUser) {
      console.log("does not have access");
      //no access
      req.access = false;
      req.editingStatus = false;
      req.adminStatus = false;
      return next();
    } else if (verifyUser.status === Status.viewer) {
      //youre just a viewer
      // console.log("viewer status");
      req.editingStatus = false;
      req.adminStatus = false;
      req.access = true;
      return next();
    } else if (verifyUser.status === Status.editor) {
      // console.log("editor");
      req.editingStatus = true;
      req.adminStatus = false;
      req.access = true;
      return next();
    } else {
      console.log("admin status");
      req.editingStatus = true;
      req.access = true;
      req.adminStatus = true;
      return next();
    }
  } catch (error) {
    console.log("user error", error.message);
    return res.status(403).json("Not Authorized to access project");
  }
};
export default accessToProject;
