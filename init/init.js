const mongoose = require("mongoose");
const initData = require("./sampleAdmins.js");
const Admin= require("../models/schema/Admin.js");


main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/tanmaydb");
}

const initDB = async () => {
  await Admin.deleteMany({});
  await Admin.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();