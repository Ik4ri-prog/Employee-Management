const mongoose = require("mongoose");

const changeLogSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },       
    docId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    action: { type: String, enum: ["create", "update", "delete"], required: true },
    changedBy: { type: String },                   
    changes: { type: Object },                    
  },
  { timestamps: true }                             
);

module.exports = mongoose.model("ChangeLog", changeLogSchema);