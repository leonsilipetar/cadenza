const Teorija = require('../model/Teorija');
const asyncWrapper = require('../middleware/asyncWrapper');

// Create a new theory
const createTeorija = asyncWrapper(async (req, res) => {
  const { title, description, programId } = req.body;

  try {
    const newTeorija = await Teorija.create({
      title,
      description,
      programId,
    });

    res.status(201).json(newTeorija);
  } catch (error) {
    console.error('Error creating theory:', error);
    res.status(500).json({ message: 'Error creating theory' });
  }
});

// Get all theories
const getTeorija = asyncWrapper(async (req, res) => {
  try {
    const teorijaList = await Teorija.findAll();
    res.json(teorijaList);
  } catch (error) {
    console.error('Error fetching theories:', error);
    res.status(500).json({ message: 'Error fetching theories' });
  }
});

// Update a theory
const updateTeorija = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const teorija = await Teorija.findByPk(id);
    if (!teorija) {
      return res.status(404).json({ message: 'Theory not found' });
    }

    Object.assign(teorija, updateData);
    await teorija.save();

    res.json({ message: 'Theory updated successfully', teorija });
  } catch (error) {
    console.error('Error updating theory:', error);
    res.status(500).json({ message: 'Error updating theory' });
  }
});

// Delete a theory
const deleteTeorija = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  try {
    const teorija = await Teorija.findByPk(id);
    if (!teorija) {
      return res.status(404).json({ message: 'Theory not found' });
    }

    await Teorija.destroy({ where: { id } });
    res.status(200).json({ message: 'Theory successfully deleted' });
  } catch (error) {
    console.error('Error deleting theory:', error);
    res.status(500).json({ message: 'Error deleting theory' });
  }
});

module.exports = {
  createTeorija,
  getTeorija,
  updateTeorija,
  deleteTeorija,
};
