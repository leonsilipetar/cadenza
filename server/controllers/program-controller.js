const Program = require('../model/Program.js'); // Pretpostavljamo da je model programa postavljen

// Get all programs
const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().populate('skola mentori students');
    res.json(programs);
  } catch (error) {
    res.status(500).send(error);
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
    res.status(400).send(error);
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
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).send('Program not found');
    res.json(program);
  } catch (error) {
    res.status(500).send(error);
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
