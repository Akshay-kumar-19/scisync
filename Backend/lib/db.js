const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/science_exhibition";

if (!global.__mongooseConnection) {
    global.__mongooseConnection = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (global.__mongooseConnection.conn) {
        return global.__mongooseConnection.conn;
    }

    if (!global.__mongooseConnection.promise) {
        global.__mongooseConnection.promise = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10
        }).then((mongooseInstance) => {
            console.log("MongoDB Connected");
            return mongooseInstance;
        });
    }

    try {
        global.__mongooseConnection.conn = await global.__mongooseConnection.promise;
    } catch (error) {
        global.__mongooseConnection.promise = null;
        throw error;
    }

    return global.__mongooseConnection.conn;
}

module.exports = { connectToDatabase };
