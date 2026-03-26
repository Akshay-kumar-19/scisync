const express = require("express");
const router = express.Router();

router.use("/projects", require("./projectRoutes"));
router.use("/schools", require("./schoolRoutes"));
router.use("/students", require("./studentRoutes"));
router.use("/mentors", require("./mentorRoutes"));
router.use("/visitors", require("./visitorRoutes"));
router.use("/awards", require("./awardRoutes"));
router.use("/queries", require("./queryRoutes"));

module.exports = router;
