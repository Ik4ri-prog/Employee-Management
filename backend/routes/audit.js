const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Audit Log model
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

const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

// GET all audit logs
router.get("/", async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;