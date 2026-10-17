
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const tasks = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.json({
    message: "Task Management API",
    version: "1.0.0"
  });
});

app.get("/tasks", (req, res) => {
  res.json({
    success: true,
    data: tasks
  });
});

app.post("/tasks", (req, res) => {
  const task = {
    id: nextId++,
    title: req.body.title,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);

  res.status(201).json({
    success: true,
    data: task
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
