const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // adjust path

const seedAdmin = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = new User({
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      status: "approved",
    });

    await adminUser.save();
    console.log("Admin user created successfully");
  } catch (err) {
    console.error("Error creating admin:", err.message);
  }
};

module.exports = seedAdmin;
