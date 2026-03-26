const express = require("express");
const Router = express.Router();
const Judge = require("../models/judge");
const Project = require("../models/project");

async function syncProjectScores(projectId) {
    if (!projectId) return;

    const scores = await Judge.find({ projectId }).select("score -_id");
    await Project.findByIdAndUpdate(projectId, {
        judge_scores: scores.map((entry) => entry.score).filter((score) => Number.isFinite(score))
    });
}

Router.post("/", async (req, res) => {
    try {
        const judge = new Judge(req.body);
        await judge.save();
        await syncProjectScores(judge.projectId);
        res.json({ success: true, judge });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

Router.get("/", async (req, res) => {
    try {
        const judges = await Judge.find().populate("projectId");
        res.json(judges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = Router;
