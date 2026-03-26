const express = require("express");
const Award = require("../models/award");
const Project = require("../models/project");
const router = express.Router();

async function syncProjectAwards(projectId) {
  if (!projectId) return;

  const awards = await Award.find({ project_id: projectId }).select("award_name -_id");
  const awardNames = awards.map((award) => award.award_name).filter(Boolean);
  await Project.findByIdAndUpdate(projectId, { awards: awardNames });
}

router.post("/", async (req, res) => {
  try {
    const item = new Award(req.body);
    await item.save();
    await syncProjectAwards(item.project_id);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    res.json(await Award.find().populate("project_id", "title theme"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const existing = await Award.findById(req.params.id);
    const updated = await Award.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await syncProjectAwards(existing?.project_id);
    await syncProjectAwards(updated?.project_id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const existing = await Award.findById(req.params.id);
    await Award.findByIdAndDelete(req.params.id);
    await syncProjectAwards(existing?.project_id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
