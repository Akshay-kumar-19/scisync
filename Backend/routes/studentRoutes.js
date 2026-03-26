const express = require("express");
const Student = require("../models/student");
const router = express.Router();

router.post("/", async (req, res) => {
  const item = new Student(req.body);
  await item.save();
  res.json(item);
});

router.get("/", async (req, res) => {
  res.json(await Student.find().populate("school_id", "name location"));
});

router.put("/:id", async (req, res) => {
  res.json(await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
