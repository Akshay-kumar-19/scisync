const mongoose = require("mongoose");

const AwardSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  award_name: String
});

module.exports = mongoose.models.Award || mongoose.model("Award", AwardSchema);
