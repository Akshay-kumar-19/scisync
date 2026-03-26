const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
  name: String,
  location: String
});

module.exports = mongoose.models.School || mongoose.model("School", SchoolSchema);
