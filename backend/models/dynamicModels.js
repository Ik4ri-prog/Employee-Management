const mongoose = require("mongoose");

// All models now handled dynamically
const modelDefinitions = {
  employees: {
    name: { type: String, required: true },
    position: { type: String },
    department: { type: String },
    salary: { type: Number }
  },
};

const models = {};

for (let modelName in modelDefinitions) {
  const schema = new mongoose.Schema(
    {
      ...modelDefinitions[modelName],
      createdBy: String,
      updatedBy: String,
      deletedBy: String,
      isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
  );

  // Safely register models to avoid OverwriteModelError
  models[modelName] = mongoose.models[modelName] || mongoose.model(modelName, schema);
}

module.exports = models;