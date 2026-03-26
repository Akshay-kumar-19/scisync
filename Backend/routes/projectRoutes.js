const express = require("express");
const Project = require("../models/project");
const router = express.Router();

// CREATE project
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET distinct themes
router.get("/themes", async (req, res) => {
  try {
    const themes = await Project.distinct("theme");
    res.json(themes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET all
router.get("/", async (req, res) => {
  const projects = await Project.find()
    .populate("school_id", "name location")
    .populate("student_ids", "name class")
    .populate("mentor_ids", "name specialization");
  res.json(projects);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
