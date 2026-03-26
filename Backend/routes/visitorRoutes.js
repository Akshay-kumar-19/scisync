const express = require("express");
const Visitor = require("../models/Visitor");
const Project = require("../models/project");
const router = express.Router();

async function syncProjectRatings(projectId) {
  if (!projectId) return;

  const visitors = await Visitor.find({ projectId }).select("rating -_id");
  await Project.findByIdAndUpdate(projectId, {
    visitor_ratings: visitors
      .map((entry) => entry.rating)
      .filter((rating) => Number.isFinite(rating))
  });
}

router.post("/", async (req, res) => {
  try {
    const item = new Visitor(req.body);
    await item.save();
    await syncProjectRatings(item.projectId);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    res.json(await Visitor.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const existing = await Visitor.findById(req.params.id);
    const updated = await Visitor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await syncProjectRatings(existing?.projectId);
    await syncProjectRatings(updated?.projectId);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const existing = await Visitor.findById(req.params.id);
    await Visitor.findByIdAndDelete(req.params.id);
    await syncProjectRatings(existing?.projectId);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
