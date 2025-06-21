const express = require("express");
const app = express();
const City= require("./schema/City");
const Caretaker= require("./schema/Caretaker");
const Property= require("./schema/Property");
const Booking= require("./schema/Booking");
const User=require("./schema/User");
const Payment=require("./schema/Payment");
const Service=require("./schema/Service");
const Admin=require("./schema/Admin");
const Cancellation=require("./schema/cancellation");
const mongoose= require('mongoose');
main().then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/tanmaydb');
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});