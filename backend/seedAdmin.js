const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // adjust path

const seedUsers = async () => {
  try {
    // ADMIN SEED
    const adminEmail = "admin@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedAdminPassword = await bcrypt.hash("admin123", 10);

      const adminUser = new User({
        email: adminEmail,
        password: hashedAdminPassword,
        role: "admin",
        status: "approved",
      });

      await adminUser.save();
      console.log("Admin user created successfully");
    } else {
      console.log("Admin already exists");
    }

    const userEmail = "user@gmail.com";
    const userExists = await User.findOne({ email: userEmail });

    if (!userExists) {
      const hashedUserPassword = await bcrypt.hash("user123", 10);

      const normalUser = new User({
        email: userEmail,
        password: hashedUserPassword,
        role: "user",
        status: "approved",
      });

      await normalUser.save();
      console.log("Normal user created successfully");
    } else {
      console.log("User already exists");
    }

  } catch (err) {
    console.error("Error seeding users:", err.message);
  }
};

module.exports = seedUsers;
