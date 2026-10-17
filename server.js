
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

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
  const { title } = req.body || {};

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Title is required and must be a non-empty string."
    });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({
      success: false,
      message: "Title must not exceed 200 characters."
    });
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(task);

  return res.status(201).json({
    success: true,
    data: task
  });
});

// Handle requests to unknown endpoints.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found."
  });
});

// Centralized error handling.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body."
    });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body is too large."
    });
  }

 const errorStatus = err.status || err.statusCode;

const status =
  Number.isInteger(errorStatus) &&
  errorStatus >= 400 &&
  errorStatus < 500
    ? errorStatus
    : 500;

if (status >= 500) {
  console.error(err);
}

return res.status(status).json({
  success: false,
  message:
    status < 500
      ? "Invalid request."
      : "Internal server error."
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
