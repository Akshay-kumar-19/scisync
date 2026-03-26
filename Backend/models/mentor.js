const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  name: String,
  specialization: String
});

module.exports = mongoose.models.Mentor || mongoose.model("Mentor", MentorSchema);
