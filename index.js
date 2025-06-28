require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");

const City = require("./models/schema/City");
const Caretaker = require("./models/schema/Caretaker");
const Property = require("./models/schema/Property");
const Booking = require("./models/schema/Booking");
const User = require("./models/schema/User");
const Payment = require("./models/schema/Payment");
const Service = require("./models/schema/Service");
const Admin = require("./models/schema/Admin");
const Cancellation = require("./models/schema/cancellation");
const notification=require("./models/schema/notification");


connectDB();

// Setup view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json()); // To parse JSON body
app.use(express.urlencoded({ extended: true })); // For form submissions

app.use("/api/users", require("./routes/user.routes"));
app.use("/api/admins", require("./routes/admin.routes"));
app.use("/api/caretakers", require("./routes/caretaker.routes"));
app.use("/api/properties", require("./routes/property.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/subscriptions", require("./routes/subscription.routes"));
app.use("/api/services", require("./routes/service.routes"));
app.use("/api/cancellations", require("./routes/cancellation.routes"));
app.use("/api/cities", require("./routes/city.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));

// Root endpoint
app.get("/", (req, res) => {
  res.send("Server is working!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
console.log('JWT_SECRET:', process.env.JWT_SECRET);
