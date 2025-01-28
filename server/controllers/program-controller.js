const Program = require('../model/Program');

// Get all programs
const getAllPrograms = async (req, res) => {
  try {
    const { school } = req.query;
    const programs = await Program.find({ school });
    res.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Error fetching programs' });
  }
};

// Get program by ID
const getProgramById = async (req, res) => {
  try {
    const program = await Program.findOne({
      _id: req.params.id,
      school: req.user.school
    });
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }
    res.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ error: 'Error fetching program' });
  }
};

// Create a new program
const createProgram = async (req, res) => {
  try {
    const { naziv, tipovi, school } = req.body;
    
    // Validate school exists
    if (!school) {
      return res.status(400).json({ 
        error: 'School ID is required' 
      });
    }
    
    // Transform tipovi from object to array format if needed
    const transformedTipovi = Array.isArray(tipovi) 
      ? tipovi 
      : Object.entries(tipovi)
          .filter(([_, cijena]) => cijena !== '' && parseFloat(cijena) > 0)
          .map(([tip, cijena]) => ({
            tip,
            cijena: parseFloat(cijena)
          }));

    const program = new Program({
      naziv,
      tipovi: transformedTipovi,
      school  // Use school from request body
    });

    await program.save();
    res.status(201).json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(400).json({ 
      error: error.message || 'Error creating program'
    });
  }
};

// Update a program
const updateProgram = async (req, res) => {
  try {
    const { naziv, tipovi } = req.body;

    // Transform tipovi from object to array format if needed
    const transformedTipovi = Array.isArray(tipovi) 
      ? tipovi 
      : Object.entries(tipovi)
          .filter(([_, cijena]) => cijena !== '' && parseFloat(cijena) > 0)
          .map(([tip, cijena]) => ({
            tip,
            cijena: parseFloat(cijena)
          }));

    const program = await Program.findOneAndUpdate(
      { 
        _id: req.params.id,
        school: req.user.school 
      },
      {
        naziv,
        tipovi: transformedTipovi
      },
      { new: true, runValidators: true }
    );

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(400).json({ 
      error: error.message || 'Error updating program'
    });
  }
};

// Delete a program
const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findOneAndDelete({
      _id: req.params.id,
      school: req.user.school
    });

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ error: 'Error deleting program' });
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
