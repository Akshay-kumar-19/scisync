const mongoose = require("mongoose");

const JudgeSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    judgeName: String,
    score: Number
});

module.exports = mongoose.models.Judge || mongoose.model("Judge", JudgeSchema);
