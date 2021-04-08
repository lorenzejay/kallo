const router = require("express").Router();
const pool = require("../db.js");
const authorization = require("../middlewares/authorization");

//get all posts
router.get("/project/:project_id", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const { project_id } = req.params;
    //check the security first
    const checkSecurityQuery = await pool.query(
      "SELECT project_owner, is_private FROM projects WHERE project_id = $1",
      [project_id]
    );
    const { is_private, project_owner } = checkSecurityQuery.rows[0];

    //private = false anyone can see
    //private = true only owner can see for now and then shared future
    if (is_private === false || project_owner === user_id) {
      const query = await pool.query(
        "SELECT * FROM projects WHERE project_id = $1 ORDER BY created_at DESC",
        [project_id]
      );
      return res.status(200).json(query.rows[0]);
    }
    res.send({ message: "You do not have access to see this project." });
  } catch (error) {
    console.log(error.message);
  }
});

//CREATING A PROJECT
router.post("/add", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const { title, header_img, is_private } = req.body;

    //security check (check if the logged in user is the one actually making the project)
    if (!user_id) return;

    const query = await pool.query(
      "INSERT INTO projects (title, is_private, header_img, project_owner) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, is_private, header_img, user_id]
    );
    if (query.rowCount > 0) {
      res.send({ success: true, message: "New Project Created" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

//get a specific project
router.get("/get-user-projects", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    if (!user_id) return; //do nothing if not signed in

    const query = await pool.query("SELECT * FROM projects WHERE project_owner = $1", [user_id]);

    if (query.rowCount === 0) {
      return res.send({ message: "You do not have any posts." });
    }
    res.status(200).json(query.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//add a column to the project board
router.put("/add-column/:project_id", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    //need to be an array of objects
    const { columns } = req.body;
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
        message: "You do either do not have authorization to modify this project.",
      });
    }

    //convert to json as we are passing to a json format
    const columnsInJsonFormat = JSON.stringify(columns);

    //update the column
    await pool.query("UPDATE projects SET columns = $1 WHERE project_id = $2", [
      columnsInJsonFormat,
      project_id,
    ]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
});

//just get the columns from the project
router.get("/get-board-columns/:project_id", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const { project_id } = req.params;
    //make sure we allowed to see the project
    const verifyQuery = await pool.query(
      "SELECT project_owner FROM projects WHERE project_id = $1",
      [project_id]
    );
    const { project_owner } = verifyQuery.rows[0];
    if (project_owner !== user_id) {
      return res.send({
        success: false,
        message: "You do either do not have authorization to modify this project.",
      });
    }
    //else show the columns only - because kanban board only needs access to the columns
    const query = await pool.query("SELECT columns FROM projects WHERE project_id = $1", [
      project_id,
    ]);
    res.json(query.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//update the privacy settings of the project
router.put("/update-privacy/:project_id", authorization, async (req, res) => {
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
});

//get all the users that are shared to on your project
router.get("/shared-users/:project_id", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const { project_id } = req.params;
    if (!user_id) return;
    const getUserName = await pool.query("SELECT username, user_id FROM users WHERE user_id = $1", [
      user_id,
    ]);
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
});

//invite users
router.post("/share/:project_id", authorization, async (req, res) => {
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

    const checkIsAUser = await pool.query("SELECT user_id, username FROM users WHERE email = $1", [
      shared_user_email,
    ]);
    if (!checkIsAUser.rows[0]) {
      return res.send({ success: false, message: "There is no user associated with that email." });
    }
    //make sure you dont share it to yourself or to someone already added on the project
    const checkedSharedUsers = await pool.query(
      "SELECT shared_user FROM shared_users WHERE shared_user = $1",
      [checkIsAUser.rows[0].user_id]
    );
    //check if you shared to yourself
    if (checkIsAUser.rows[0].user_id === user_id) {
      return res.send({ success: false, message: "You cannot share the project to yourself." });
    }

    //check if you shared to someone already shared
    if (checkedSharedUsers.rows[0]) {
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
});

module.exports = router;
