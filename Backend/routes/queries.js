const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const School = require("../models/school");
const Visitor = require("../models/Visitor");

function parseNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function getThemesFromRequest(req) {
    const raw = req.query.themes ?? req.body?.themes;

    if (Array.isArray(raw)) {
        return raw.filter(Boolean);
    }

    if (typeof raw === "string") {
        return raw
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);
    }

    return [];
}

router.all("/q1", async (req, res) => {
    try {
        const theme = req.query.theme || req.body?.theme || "Renewable Energy";
        const projects = await Project.find({ theme }).populate("school_id");
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/q2", async (req, res) => {
    try {
        const result = await Project.aggregate([
            { $match: { awards: { $exists: true, $not: { $size: 0 } } } },
            { $group: { _id: "$school_id", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
            { $lookup: { from: "schools", localField: "_id", foreignField: "_id", as: "school" } },
            { $unwind: "$school" }
        ]);
        if (!result[0]) {
            return res.json({});
        }

        res.json({
            school: result[0].school.name,
            location: result[0].school.location,
            awardWinningProjects: result[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/q3", async (req, res) => {
    try {
        const result = await Project.aggregate([
            { $unwind: "$mentor_ids" },
            { $group: { _id: "$mentor_ids", count: { $sum: 1 } } },
            { $match: { count: { $gt: 3 } } },
            { $lookup: { from: "mentors", localField: "_id", foreignField: "_id", as: "mentor" } },
            { $unwind: "$mentor" }
        ]);
        res.json(result.map((row) => row.mentor));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/q4", async (req, res) => {
    try {
        const result = await Project.aggregate([
            { $unwind: "$judge_scores" },
            { $group: { _id: "$theme", avgScore: { $avg: "$judge_scores" } } }
        ]);
        res.json(result.map((row) => ({
            theme: row._id,
            averageJudgeScore: Number(row.avgScore.toFixed(2))
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/q5", async (req, res) => {
    try {
        const projects = await Project.find({
            awards: { $all: ["Best Innovation", "Best Presentation"] }
        });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/q6", async (req, res) => {
    try {
        const projects = await Project.find({
            $expr: { $gt: [{ $size: "$mentor_ids" }, 1] }
        }).populate("mentor_ids");
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.all("/q7", async (req, res) => {
    try {
        const requestedThemes = getThemesFromRequest(req);
        const themesToMatch = requestedThemes.length ? requestedThemes : await Project.distinct("theme");

        const result = await Project.aggregate([
            { $group: { _id: "$school_id", themes: { $addToSet: "$theme" } } },
            { $match: { themes: { $all: themesToMatch } } },
            { $lookup: { from: "schools", localField: "_id", foreignField: "_id", as: "school" } },
            { $unwind: "$school" }
        ]);
        res.json(result.map((row) => row.school));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.all("/q8", async (req, res) => {
    try {
        const minCount = parseNumber(req.query.count || req.body?.count, 10);
        const result = await Visitor.aggregate([
            {
                $group: {
                    _id: "$name",
                    feedbackCount: { $sum: 1 },
                    projectIds: { $addToSet: "$projectId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    feedbackCount: 1,
                    distinctProjects: {
                        $size: {
                            $filter: {
                                input: "$projectIds",
                                as: "projectId",
                                cond: { $ne: ["$$projectId", null] }
                            }
                        }
                    }
                }
            },
            { $match: { distinctProjects: { $gt: minCount } } }
        ]);
        res.json(result.map((row) => ({
            visitor: row.name,
            feedbackCount: row.feedbackCount,
            distinctProjects: row.distinctProjects
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.all("/q9", async (req, res) => {
    try {
        const judgeThreshold = parseNumber(req.query.judge || req.body?.judge, 9);
        const visitorThreshold = parseNumber(req.query.visitor || req.body?.visitor, 9);

        const projects = await Project.aggregate([
            {
                $project: {
                    title: 1,
                    theme: 1,
                    avgJudge: { $avg: "$judge_scores" },
                    avgVisitor: { $avg: "$visitor_ratings" }
                }
            },
            {
                $match: {
                    avgJudge: { $gt: judgeThreshold },
                    avgVisitor: { $gt: visitorThreshold }
                }
            }
        ]);
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/q10", async (req, res) => {
    try {
        const result = await Project.aggregate([
            { $match: { awards: { $exists: true, $not: { $size: 0 } } } },
            { $group: { _id: "$theme", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);
        if (!result[0]) {
            return res.json({});
        }

        res.json({
            theme: result[0]._id,
            winningProjectCount: result[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/q11", async (req, res) => {
    try {
        const result = await Project.aggregate([
            {
                $project: {
                    title: 1,
                    totalScore: {
                        $add: [
                            { $ifNull: [{ $avg: "$judge_scores" }, 0] },
                            { $ifNull: [{ $avg: "$visitor_ratings" }, 0] }
                        ]
                    }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 1 }
        ]);
        if (!result[0]) {
            return res.json({});
        }

        res.json({
            project: result[0].title,
            totalScore: Number(result[0].totalScore.toFixed(2))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/q12", async (req, res) => {
    try {
        const winningSchoolIds = await Project.distinct("school_id", {
            awards: { $exists: true, $not: { $size: 0 } }
        });

        const schools = await School.find({ _id: { $nin: winningSchoolIds } });
        res.json(schools);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
