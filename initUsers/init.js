const mongoose = require("mongoose");
const initData = require("./sampleUsers.js");
const User = require("../models/schema/User.js");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/tanmaydb");
    console.log("Connected to DB");
    await initDB();
    await mongoose.disconnect();
    console.log("🔌 Disconnected from DB");
  } catch (err) {
    console.error("Connection error:", err);
  }
}

const initDB = async () => {
  try {
    await User.deleteMany({});
    await User.insertMany(initData.data);
    console.log("User data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};

main();
