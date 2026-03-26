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

async function insertTestData() {
    try {
        const existingProjects = await Project.countDocuments();
        if (existingProjects > 0) {
            console.log("Test data insert skipped because projects already exist in the database.");
            console.log("Clear the data first with `npm run clear-data` if you want a fresh test dataset.");
            mongoose.connection.close();
            return;
        }

        const schools = await School.insertMany([
            { name: "National Public School", location: "Rajajinagar, Bengaluru" },
            { name: "Jnana Sagara Vidyalaya", location: "Shivamogga, Karnataka" },
            { name: "Vidyodaya PU College", location: "Udupi, Karnataka" },
            { name: "Sahyadri High School", location: "Chikkamagaluru, Karnataka" },
            { name: "Sri Kumaran Public School", location: "Mysuru, Karnataka" },
            { name: "BGS Central School", location: "Hassan, Karnataka" }
        ]);

        const mentors = await Mentor.insertMany([
            { name: "Dr. Meghana Rao", specialization: "Renewable Energy" },
            { name: "Prof. Dhanush Bhat", specialization: "Agritech Systems" },
            { name: "Ms. Pooja Kulkarni", specialization: "Robotics" },
            { name: "Mr. Niranjan Shetty", specialization: "Water Conservation" },
            { name: "Dr. Harini Iyer", specialization: "Environmental Analytics" }
        ]);

        const students = await Student.insertMany([
            { name: "Niharika Gowda", class: "10A", school_id: schools[0]._id },
            { name: "Arjun Hegde", class: "10B", school_id: schools[0]._id },
            { name: "Pruthvi Patil", class: "11A", school_id: schools[1]._id },
            { name: "Anvitha Shekar", class: "11B", school_id: schools[1]._id },
            { name: "Rakshit Poojary", class: "9A", school_id: schools[2]._id },
            { name: "Keerthana Naik", class: "10C", school_id: schools[2]._id },
            { name: "Sanjana Bhat", class: "12A", school_id: schools[3]._id },
            { name: "Likith R", class: "9B", school_id: schools[3]._id },
            { name: "Dhruv Kulkarni", class: "10A", school_id: schools[4]._id },
            { name: "Vaishnavi Rao", class: "11C", school_id: schools[4]._id },
            { name: "Akhil M", class: "9C", school_id: schools[5]._id },
            { name: "Harshita S", class: "10D", school_id: schools[5]._id }
        ]);

        const projects = await Project.insertMany([
            {
                title: "Solar-Powered Smart Irrigation",
                theme: "Renewable Energy",
                school_id: schools[0]._id,
                student_ids: [students[0]._id, students[1]._id],
                mentor_ids: [mentors[0]._id, mentors[3]._id],
                judge_scores: [9, 8, 9],
                visitor_ratings: [9, 9, 8],
                awards: ["Best Innovation"]
            },
            {
                title: "AI Crop Health Scanner",
                theme: "Agritech",
                school_id: schools[0]._id,
                student_ids: [students[0]._id],
                mentor_ids: [mentors[1]._id, mentors[0]._id],
                judge_scores: [10, 9, 9],
                visitor_ratings: [9, 10, 9],
                awards: ["Best Presentation", "Best Innovation"]
            },
            {
                title: "Autonomous Waste Segregation Bot",
                theme: "Robotics",
                school_id: schools[0]._id,
                student_ids: [students[1]._id],
                mentor_ids: [mentors[2]._id, mentors[0]._id],
                judge_scores: [9, 9, 10],
                visitor_ratings: [10, 10, 9],
                awards: ["Best Prototype"]
            },
            {
                title: "Lake Water Quality Monitor",
                theme: "Environmental Science",
                school_id: schools[0]._id,
                student_ids: [students[0]._id, students[1]._id],
                mentor_ids: [mentors[4]._id, mentors[0]._id],
                judge_scores: [9, 9, 10],
                visitor_ratings: [9, 9, 9],
                awards: ["Community Impact"]
            },
            {
                title: "Smart Rain Alert Network",
                theme: "Climate Tech",
                school_id: schools[0]._id,
                student_ids: [students[1]._id],
                mentor_ids: [mentors[0]._id],
                judge_scores: [8, 8, 9],
                visitor_ratings: [8, 8, 9],
                awards: []
            },
            {
                title: "Biogas Unit for Rural Homes",
                theme: "Renewable Energy",
                school_id: schools[1]._id,
                student_ids: [students[2]._id, students[3]._id],
                mentor_ids: [mentors[0]._id],
                judge_scores: [8, 8, 8],
                visitor_ratings: [7, 8, 8],
                awards: []
            },
            {
                title: "Greywater Reuse Planner",
                theme: "Water Management",
                school_id: schools[2]._id,
                student_ids: [students[4]._id, students[5]._id],
                mentor_ids: [mentors[3]._id],
                judge_scores: [8, 9, 8],
                visitor_ratings: [8, 9, 8],
                awards: []
            },
            {
                title: "Millet Storage Humidity Sensor",
                theme: "Agritech",
                school_id: schools[3]._id,
                student_ids: [students[6]._id],
                mentor_ids: [mentors[1]._id],
                judge_scores: [7, 8, 8],
                visitor_ratings: [8, 7, 8],
                awards: []
            },
            {
                title: "Bus Emission Heatmap",
                theme: "Environmental Science",
                school_id: schools[4]._id,
                student_ids: [students[8]._id, students[9]._id],
                mentor_ids: [mentors[4]._id],
                judge_scores: [8, 9, 8],
                visitor_ratings: [8, 8, 9],
                awards: []
            },
            {
                title: "Portable Hydro Turbine",
                theme: "Renewable Energy",
                school_id: schools[5]._id,
                student_ids: [students[10]._id],
                mentor_ids: [mentors[0]._id],
                judge_scores: [8, 8, 7],
                visitor_ratings: [7, 8, 8],
                awards: []
            },
            {
                title: "Robotic Seed Sowing Cart",
                theme: "Robotics",
                school_id: schools[1]._id,
                student_ids: [students[2]._id],
                mentor_ids: [mentors[2]._id, mentors[1]._id],
                judge_scores: [9, 8, 9],
                visitor_ratings: [8, 9, 8],
                awards: []
            },
            {
                title: "Flood Warning Siren Grid",
                theme: "Climate Tech",
                school_id: schools[2]._id,
                student_ids: [students[4]._id],
                mentor_ids: [mentors[3]._id],
                judge_scores: [8, 8, 8],
                visitor_ratings: [8, 8, 7],
                awards: []
            }
        ]);

        await Award.insertMany([
            { project_id: projects[0]._id, award_name: "Best Innovation" },
            { project_id: projects[1]._id, award_name: "Best Presentation" },
            { project_id: projects[1]._id, award_name: "Best Innovation" },
            { project_id: projects[2]._id, award_name: "Best Prototype" },
            { project_id: projects[3]._id, award_name: "Community Impact" }
        ]);

        await Judge.insertMany([
            { projectId: projects[0]._id, judgeName: "Dr. Kiran Deshpande", score: 9 },
            { projectId: projects[0]._id, judgeName: "Ms. Lavanya Murthy", score: 8 },
            { projectId: projects[0]._id, judgeName: "Prof. Ritesh Naik", score: 9 },
            { projectId: projects[1]._id, judgeName: "Dr. Kiran Deshpande", score: 10 },
            { projectId: projects[1]._id, judgeName: "Ms. Lavanya Murthy", score: 9 },
            { projectId: projects[1]._id, judgeName: "Prof. Ritesh Naik", score: 9 },
            { projectId: projects[2]._id, judgeName: "Dr. Asha Kulkarni", score: 9 },
            { projectId: projects[2]._id, judgeName: "Mr. Sudeep Rao", score: 10 },
            { projectId: projects[3]._id, judgeName: "Dr. Asha Kulkarni", score: 9 },
            { projectId: projects[3]._id, judgeName: "Mr. Sudeep Rao", score: 10 }
        ]);

        const visitorEntries = [
            { name: "Mahesh H", feedback: "Very practical for farms", rating: 9, projectId: projects[0]._id },
            { name: "Priya N", feedback: "Clean working model", rating: 8, projectId: projects[0]._id },
            { name: "Sunil Kumar", feedback: "Impressive AI idea", rating: 10, projectId: projects[1]._id },
            { name: "Shreya B", feedback: "Helpful for agriculture", rating: 9, projectId: projects[1]._id },
            { name: "Vinayak P", feedback: "Robot demo was good", rating: 8, projectId: projects[2]._id },
            { name: "Manasa R", feedback: "Nice implementation", rating: 9, projectId: projects[2]._id },
            { name: "Raghu M", feedback: "Relevant for local lakes", rating: 9, projectId: projects[3]._id },
            { name: "Aditi S", feedback: "Strong presentation", rating: 8, projectId: projects[3]._id },
            { name: "Neha K", feedback: "Useful in rainy regions", rating: 8, projectId: projects[4]._id },
            { name: "Rohit V", feedback: "Affordable concept", rating: 8, projectId: projects[5]._id },
            { name: "Ananya P", feedback: "Good rural use case", rating: 7, projectId: projects[5]._id }
        ];

        for (let index = 0; index < 11; index += 1) {
            visitorEntries.push({
                name: "Anand Murali",
                feedback: "Good exhibit with clear explanation",
                rating: 8 + (index % 2),
                projectId: projects[index]._id
            });
        }

        await Visitor.insertMany(visitorEntries);

        console.log("Realistic test data inserted into MongoDB.");
        console.log(`Schools: ${schools.length}`);
        console.log(`Students: ${students.length}`);
        console.log(`Mentors: ${mentors.length}`);
        console.log(`Projects: ${projects.length}`);
        mongoose.connection.close();
    } catch (error) {
        console.log(error);
        mongoose.connection.close();
    }
}

insertTestData();
