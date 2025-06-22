const mongoose = require("mongoose");
const initData = require("./sampleCities.js");
const City= require("../models/schema/City.js");


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
  await City.deleteMany({});
  await City.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();