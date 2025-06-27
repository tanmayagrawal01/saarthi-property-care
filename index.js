require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");

// Models (just importing them is okay if needed for seeders/migrations)
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


// Connect to MongoDB
connectDB();

// Setup view engine (if you're using EJS pages)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ✅ Middleware
app.use(express.json()); // To parse JSON body
app.use(express.urlencoded({ extended: true })); // For form submissions

// ✅ Routes
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

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("Server is working!");
});

// ✅ Global error handler (optional but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
console.log('JWT_SECRET:', process.env.JWT_SECRET);
