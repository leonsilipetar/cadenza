const Program = require('../model/Program');

// Get all programs
const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().populate('skola', 'naziv');
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching programs' });
  }
};

// Get program by ID
const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate('skola mentori students');
    if (!program) return res.status(404).send('Program not found');
    res.json(program);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Create a new program
const createProgram = async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error creating program' });
  }
};

// Update a program
const updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!program) return res.status(404).send('Program not found');
    res.json(program);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a program
const deleteProgram = async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting program' });
  }
};

// Exporting the functions
module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
};
