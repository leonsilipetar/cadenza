// controllers/classroom-controller.js

const Classroom = require('../model/Classroom');
const asyncWrapper = require('../middleware/asyncWrapper');

// Create a new classroom
const createClassroom = asyncWrapper(async (req, res) => {
  const { name, schoolId } = req.body;

  try {
    const newClassroom = await Classroom.create({
      name,
      schoolId,
    });

    res.status(201).json(newClassroom);
  } catch (error) {
    console.error('Error creating classroom:', error);
    res.status(500).json({ message: 'Error creating classroom' });
  }
});

// Get all classrooms
const getAllClassrooms = asyncWrapper(async (req, res) => {
  try {
    const classrooms = await Classroom.findAll();
    res.json(classrooms);
  } catch (error) {
    console.error('Error fetching classrooms:', error);
    res.status(500).json({ message: 'Error fetching classrooms' });
  }
});

// Update a classroom
const updateClassroom = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const classroom = await Classroom.findByPk(id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    Object.assign(classroom, updateData);
    await classroom.save();

    res.json({ message: 'Classroom updated successfully', classroom });
  } catch (error) {
    console.error('Error updating classroom:', error);
    res.status(500).json({ message: 'Error updating classroom' });
  }
});

// Delete a classroom
const deleteClassroom = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  try {
    const classroom = await Classroom.findByPk(id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    await Classroom.destroy({ where: { id } });
    res.status(200).json({ message: 'Classroom successfully deleted' });
  } catch (error) {
    console.error('Error deleting classroom:', error);
    res.status(500).json({ message: 'Error deleting classroom' });
  }
});

module.exports = {
  createClassroom,
  getAllClassrooms,
  updateClassroom,
  deleteClassroom,
};
