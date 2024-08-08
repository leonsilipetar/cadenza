// controllers/classroom-controller.js

const Classroom = require('../model/Classroom'); // Import the Classroom model

// Create a new classroom
exports.createClassroom = async (req, res) => {
  try {
    const classroom = new Classroom(req.body);
    await classroom.save();
    res.status(201).json(classroom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all classrooms
exports.getAllClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.json(classrooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getClassrooms = async (req, res) => {
    const { schoolId } = req.query;
    try {
      const query = schoolId ? { school: schoolId } : {};
      const classrooms = await Classroom.find(query).populate('school');
      res.status(200).json(classrooms);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  };

// Update a classroom
exports.updateClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(classroom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a classroom
exports.deleteClassroom = async (req, res) => {
  try {
    await Classroom.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
