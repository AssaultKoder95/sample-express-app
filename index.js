const express = require("express");
const app = express();

const PORT = 3000;

const noteRoutes = require("./routes/notes");

// Middleware
app.use(express.json());

// API Routes
app.use(noteRoutes);

// Generic Handler
app.get("*", (req, res) => {
  res.statusCode = 404;
  res.json({
    message: `Unable to find a matching route for ${req.url}`,
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
