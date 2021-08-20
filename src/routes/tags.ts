import { Response, Router } from "express";
import pool from "../db";
import authorization from "../middlewares/authorization";
import accessToProject from "../middlewares/privacyChecker";

const tagRouter = Router();

//create a tag
tagRouter.post(
  "/create/:project_id/:task_id",
  [authorization, accessToProject],
  async (req: any, res: Response) => {
    try {
      const { title, hex_color } = req.body;
      const { task_id } = req.params;
      const user_id = req.user;
      const adminStatus = req.adminStatus;

      if (!user_id || !adminStatus) return res.send(undefined);
      //check how many columns are associated with the project already
      const checker = await pool.query(
        "SELECT task_id FROM tags WHERE task_id = $1",
        [task_id]
      );
      const index = checker.rowCount;
      const query = await pool.query(
        "INSERT INTO tags (title, hex_color, index, task_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, hex_color, index, task_id]
      );
      if (query.rowCount < 1)
        return res.send({ success: false, message: "something went wrong..." });
      res.send({ success: true, message: "New Tag created on " });
    } catch (error) {
      console.log(error.message);
      res.send(error.message);
    }
  }
);

//fetch tags for the task
tagRouter.get("/fetch/:task_id", async (req: any, res: Response) => {
  try {
    const { task_id } = req.params;

    const query = await pool.query(
      "SELECT * FROM tags WHERE task_id = $1 ORDER BY created_at",
      [task_id]
    );

    res.send(query.rows);
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

//update task title on double click
tagRouter.put(
  "/update-title/:tag_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const { title } = req.body;
      const { tag_id } = req.params;
      const user_id = req.user;

      if (!user_id || !tag_id) return;
      if (title === "" || title === null) return;
      const updateQuery = await pool.query(
        "UPDATE tags SET title = $1 WHERE tag_id = $2",
        [title, tag_id]
      );
      if (updateQuery.rowCount === 1) {
        res.send({ success: true, message: "Updated tag title successfully." });
      }
    } catch (error) {
      console.log(error.message);
      res.send(error.message);
    }
  }
);

//update task color
tagRouter.put(
  "/update-hex-color/:tag_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const { hex_color } = req.body;
      const { tag_id } = req.params;
      const user_id = req.user;
      if (!user_id || !tag_id) return;
      if (hex_color === "" || hex_color === null) return;
      const updateQuery = await pool.query(
        "UPDATE tags SET hex_color = $1 WHERE tag_id = $2 RETURNING *",
        [hex_color, tag_id]
      );
      if (updateQuery.rowCount === 1) {
        res.send({ success: true, message: "Updated hex color successfully." });
      } else {
        res
          .status(404)
          .send({ success: false, message: "Something went wrong" });
      }
    } catch (error) {
      console.log(error.message);
      res.send(error.message);
    }
  }
);

// delete tag
tagRouter.delete(
  "/delete-tag/:tag_id",
  authorization,
  async (req: any, res: Response) => {
    try {
      const { tag_id } = req.params;
      const user_id = req.user;
      if (!user_id) return;
      const updateQuery = await pool.query(
        "DELETE FROM tags WHERE tag_id = $1 RETURNING *",
        [tag_id]
      );
      if (updateQuery.rowCount === 1) {
        res.send({ success: true, message: "Deleted tag successfully." });
      } else {
        res
          .status(404)
          .send({ success: false, message: "Something went wrong" });
      }
    } catch (error) {
      console.log(error.message);
      res.send(error.message);
    }
  }
);

export default tagRouter;
