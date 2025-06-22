const express = require("express");
const app = express();
const City= require("./models/schema/City");
const Caretaker= require("./models/schema/Caretaker");
const Property= require("./models/schema/Property");
const Booking= require("./models/schema/Booking");
const User=require("./models/schema/User");
const Payment=require("./models/schema/Payment");
const Service=require("./models/schema/Service");
const Admin=require("./models/schema/Admin");
const Cancellation=require("./models/schema/cancellation");
const mongoose= require('mongoose');

const connectDB = require("./config/db.js");
connectDB();

app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
