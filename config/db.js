const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/tanmaydb");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("DB connection error:", err);
  }
}

module.exports = connectDB;
