const mongoose = require("mongoose");
require('dotenv').config();

async function connectDB() {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI not defined in environment variables");
    }

    await mongoose.connect(MONGO_URI, {
    });

    console.log("Connected to DB");
  } catch (err) {
    console.error("DB connection error:", err.message);
  }
}

module.exports = connectDB;
