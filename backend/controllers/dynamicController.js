const models = require("../models/dynamicModels");
const jwt = require("jsonwebtoken");

const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    return null;
  }
};

const validateData = (data, schemaPaths) => {
  const errors = [];

  for (let field in schemaPaths) {
    const fieldType = schemaPaths[field].instance;

    if (schemaPaths[field].isRequired && !data[field]) {
      errors.push(`${field} is required`);
    }

    if (data[field]) {
      if (fieldType === "Number" && typeof data[field] !== "number") {
        errors.push(`${field} must be a number`);
      }

      if (fieldType === "String" && typeof data[field] !== "string") {
        errors.push(`${field} must be a string`);
      }

      if (field === "email" && !/\S+@\S+\.\S+/.test(data[field])) {
        errors.push(`Invalid email format`);
      }
    }
  }

  return errors;
};

exports.handleRequest = async (req, res) => {
  try {
    const { model, id } = req.params;
    const Model = models[model];

    if (!Model) {
      return res.status(404).json({ message: "Model not found" });
    }

    const userId = getUserFromToken(req) || "system";

    switch (req.method) {

      case "POST":
        const createErrors = validateData(req.body, Model.schema.paths);
        if (createErrors.length > 0) {
          return res.status(400).json({ errors: createErrors });
        }

        const created = await Model.create({
          ...req.body,
          createdBy: userId,
          isDeleted: false
        });

        return res.json(created);

      case "GET":
        const data = await Model.find({ isDeleted: false });
        return res.json(data);

      case "PUT":
        const updateErrors = validateData(req.body, Model.schema.paths);
        if (updateErrors.length > 0) {
          return res.status(400).json({ errors: updateErrors });
        }

        const updated = await Model.findByIdAndUpdate(
          id,
          {
            ...req.body,
            updatedBy: userId
          },
          { new: true }
        );

        return res.json(updated);

      case "DELETE":
        const deleted = await Model.findByIdAndUpdate(
          id,
          {
            isDeleted: true,
            deletedBy: userId,
            deletedAt: new Date()
          },
          { new: true }
        );

        return res.json({
          message: "Soft deleted successfully",
          deleted
        });

      default:
        return res.status(405).send("Method Not Allowed");
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
