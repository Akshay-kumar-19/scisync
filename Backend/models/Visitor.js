const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
    name: String,
    feedback: String,
    rating: Number,
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project",
        default: null
    }
});

module.exports = mongoose.models.Visitor || mongoose.model("Visitor", VisitorSchema);
