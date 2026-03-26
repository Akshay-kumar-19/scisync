const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: String,
  theme: String,
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
  student_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  mentor_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mentor" }],
  judge_scores: [Number],
  visitor_ratings: [Number],
  awards: [String]
});

module.exports = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
