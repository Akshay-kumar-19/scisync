const express = require("express");
const School = require("../models/school");
const router = express.Router();

router.post("/", async (req, res) => {
  const school = new School(req.body);
  await school.save();
  res.json(school);
});

router.get("/", async (req, res) => {
  res.json(await School.find());
});

router.put("/:id", async (req, res) => {
  res.json(await School.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/:id", async (req, res) => {
  await School.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
