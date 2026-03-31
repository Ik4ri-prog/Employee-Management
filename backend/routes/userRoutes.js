const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

const auditLogSchema = new mongoose.Schema(
  {
    model: String,
    action: String,
    documentId: String,
    performedBy: String,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});


router.put("/:id", async (req, res) => {
  try {
    const { status, updatedBy } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    await AuditLog.create({
      model: "users",
      action: `STATUS_${status.toUpperCase()}`,
      documentId: user._id.toString(),
      performedBy: updatedBy || "unknown",
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
