require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/science_exhibition")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

async function bootstrapAdmin() {
    try {
        const fullName = process.env.ADMIN_NAME || "SciSync Admin";
        const email = (process.env.ADMIN_EMAIL || "admin@sciencefair.local").toLowerCase();
        const plainPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
        const password = await bcrypt.hash(plainPassword, 10);

        const user = await User.findOneAndUpdate(
            { email },
            { fullName, email, password, role: "admin" },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`Admin ready: ${user.email}`);
        console.log("No dummy data was inserted.");
        mongoose.connection.close();
    } catch (err) {
        console.log(err);
        mongoose.connection.close();
    }
}

bootstrapAdmin();
