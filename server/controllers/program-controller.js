const Program = require('../model/Program');
const asyncWrapper = require('../middleware/asyncWrapper');

// Create a new program
const createProgram = asyncWrapper(async (req, res) => {
  const { name, description } = req.body;

  try {
    const newProgram = await Program.create({
      name,
      description,
    });

    res.status(201).json(newProgram);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Error creating program' });
  }
});

// Get all programs
const getAllPrograms = asyncWrapper(async (req, res) => {
  try {
    const programs = await Program.findAll();
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Error fetching programs' });
  }
});

// Get a program by ID
const getProgramById = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  try {
    const program = await Program.findByPk(id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ message: 'Error fetching program' });
  }
});

// Update a program
const updateProgram = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const program = await Program.findByPk(id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    Object.assign(program, updateData);
    await program.save();

    res.json({ message: 'Program updated successfully', program });
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ message: 'Error updating program' });
  }
});

// Delete a program
const deleteProgram = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  try {
    const program = await Program.findByPk(id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    await Program.destroy({ where: { id } });
    res.status(200).json({ message: 'Program successfully deleted' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Error deleting program' });
  }
});

module.exports = {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
};
