const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const { auth, adminOnly } = require("../middleware/auth");

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

router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE USER =================
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const { status, role, updatedBy } = req.body;

    const updateFields = {};
    let action = [];

    if (status) {
      updateFields.status = status;
      action.push(`STATUS_${status.toUpperCase()}`);
    }

    if (role) {
      updateFields.role = role;
      action.push(`ROLE_${role.toUpperCase()}`);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const performedBySafe = req.user.id;
    const performedByDisplay = updatedBy || req.user.email || "unknown";

    await AuditLog.create({
      model: "users",
      action: action.join(" | "),
      documentId: user._id.toString(),
      performedBy: `${performedByDisplay} (${performedBySafe})`,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
