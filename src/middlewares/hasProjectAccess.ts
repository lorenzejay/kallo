import { Response } from "express";
import pool from "../db";
import authorization from "./authorization";

const hasProjectAccess = async (
  request: any,
  response: Response,
  next: any
) => {
  try {
    const { project_id } = request.params;
    authorization(request, response, next);
    // next();

    const user_id = request.user;

    if (!project_id) return response.status(404).json("No Project");

    //check if the user is the owner
    if (user_id) {
      const verifyQuery = await pool.query(
        "SELECT project_owner FROM projects WHERE project_id = $1",
        [project_id]
      );
      const { project_owner } = verifyQuery.rows[0];
      //check if the user is the owner of the project
      //   console.log(project_owner);
      if (project_owner === user_id) {
        return (request.isProjectOwner = true);
      }
      //if you are not the owner then we have to check if you are shared to the project
      const sharedToMeChecker = await pool.query(
        "SELECT shared_user FROM shared_users WHERE shared_project = $1",
        [project_id]
      );
      const isSharedToUserAlreadyChecker = sharedToMeChecker.rows.find(
        (x) => x.shared_user === user_id
      );

      if (isSharedToUserAlreadyChecker) {
        return (request.isProjectOwner = true);
      }
      request.isProjectOwner = false;
    }
  } catch (error) {
    console.log(error);
  }

  next();
};

export default hasProjectAccess;
