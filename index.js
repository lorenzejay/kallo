const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

//routes
app.use("/api/users", require("./routes/users"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
