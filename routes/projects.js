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

module.exports = router;
