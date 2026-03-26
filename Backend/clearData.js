require("dotenv").config();
const mongoose = require("mongoose");

const School = require("./models/school");
const Student = require("./models/student");
const Mentor = require("./models/mentor");
const Project = require("./models/project");
const Judge = require("./models/judge");
const Visitor = require("./models/Visitor");
const Award = require("./models/award");

mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/science_exhibition")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

async function clearData() {
    try {
        await Promise.all([
            School.deleteMany({}),
            Student.deleteMany({}),
            Mentor.deleteMany({}),
            Project.deleteMany({}),
            Judge.deleteMany({}),
            Visitor.deleteMany({}),
            Award.deleteMany({})
        ]);

        console.log("All exhibition data cleared. User accounts were kept.");
        mongoose.connection.close();
    } catch (error) {
        console.log(error);
        mongoose.connection.close();
    }
}

clearData();
