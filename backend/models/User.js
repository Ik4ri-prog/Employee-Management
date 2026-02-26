const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },

    password: { 
      type: String, 
      required: true 
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },

    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);