const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  class: String,
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School" }
});

module.exports = mongoose.models.Student || mongoose.model("Student", StudentSchema);
