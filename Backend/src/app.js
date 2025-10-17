const express = require("express");
const { connectDB } = require("./config/database");
const cors = require("cors");
const taskRouter = require("./routes/task");
const authRouter = require("./routes/auth");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smarttask-covalense.netlify.app",
    ],
  })
);

app.use("/", authRouter);
app.use("/", taskRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on port:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection not established");
  });
