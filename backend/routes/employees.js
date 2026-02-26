const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { name, position, department, salary } = req.body;

    if (!name || !position || !department || salary === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const employee = new Employee({ name, position, department, salary });
    await employee.save();
    res.json(employee);
  } catch (err) {
    console.error("EMPLOYEE CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


router.get('/', auth, async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

router.put('/:id', auth, async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(employee);
});

router.delete('/:id', auth, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
});

module.exports = router;