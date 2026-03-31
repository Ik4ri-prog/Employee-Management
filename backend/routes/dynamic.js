const express = require("express");
const router = express.Router();
const models = require("../models/dynamicModels");

const mongoose = require("mongoose");
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

router.use("/:model", (req, res, next) => {
  const modelName = req.params.model.toLowerCase();
  if (!models[modelName]) return res.status(404).json({ error: `Model '${modelName}' not found.` });
  req.Model = models[modelName];
  next();
});

// CREATE
router.post("/:model", async (req, res) => {
  try {
    const doc = new req.Model(req.body);
    await doc.save();

    // Log creation
    await AuditLog.create({
      model: req.params.model,
      action: "CREATE",
      documentId: doc._id.toString(),
      performedBy: req.body.createdBy || "system",
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL (non-deleted)
router.get("/:model", async (req, res) => {
  try {
    const docs = await req.Model.find({ isDeleted: false });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get("/:model/:id", async (req, res) => {
  try {
    const doc = await req.Model.findOne({ _id: req.params.id, isDeleted: false });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:model/:id", async (req, res) => {
  try {
    const doc = await req.Model.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "Not found" });

    // Log update
    await AuditLog.create({
      model: req.params.model,
      action: "UPDATE",
      documentId: doc._id.toString(),
      performedBy: req.body.updatedBy || "system",
    });

    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// SOFT DELETE
router.delete("/:model/:id", async (req, res) => {
  try {
    const doc = await req.Model.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, deletedBy: req.body.deletedBy || "system" },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "Not found" });

    // Log deletion
    await AuditLog.create({
      model: req.params.model,
      action: "DELETE",
      documentId: doc._id.toString(),
      performedBy: req.body.deletedBy || "system",
    });

    res.json({ message: `${req.params.model} deleted successfully`, doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AUDIT LOGS
router.get("/audit-logs", async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }); // newest first
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;