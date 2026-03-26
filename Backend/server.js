require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { requireAuth } = require("./middleware/auth");
const { connectToDatabase } = require("./lib/db");

const app = express();
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.log("DB Error:", error);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// Basic check
app.get("/", (req, res) => {
  res.send("SciSync backend is running.");
});

// ROUTES
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/students", requireAuth, require("./routes/studentRoutes"));
app.use("/api/projects", requireAuth, require("./routes/projectRoutes"));
app.use("/api/mentors", requireAuth, require("./routes/mentorRoutes"));
app.use("/api/schools", requireAuth, require("./routes/schoolRoutes"));
app.use("/api/awards", requireAuth, require("./routes/awardRoutes"));
app.use("/api/visitors", requireAuth, require("./routes/visitorRoutes"));
app.use("/api/judges", requireAuth, require("./routes/judges"));
app.use("/api/queries", requireAuth, require("./routes/queries"));

// Start Server
const PORT = Number(process.env.PORT || 5000);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
