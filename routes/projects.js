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
      const query = await pool.query("SELECT * FROM projects WHERE project_id = $1", [project_id]);
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

module.exports = router;
