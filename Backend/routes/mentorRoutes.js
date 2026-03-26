const express = require("express");
const Mentor = require("../models/mentor");
const router = express.Router();

router.post("/", async (req, res) => {
  const item = new Mentor(req.body);
  await item.save();
  res.json(item);
});

router.get("/", async (req, res) => {
  res.json(await Mentor.find());
});

router.put("/:id", async (req, res) => {
  res.json(await Mentor.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/:id", async (req, res) => {
  await Mentor.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
