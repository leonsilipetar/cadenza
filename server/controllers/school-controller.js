const School = require('../model/School');
const asyncWrapper = require('../middleware/asyncWrapper');

// Create a new school
const createSchool = asyncWrapper(async (req, res) => {
  const { name, address } = req.body;

  try {
    const newSchool = await School.create({
      name,
      address,
    });

    res.status(201).json(newSchool);
  } catch (error) {
    console.error('Error creating school:', error);
    res.status(500).json({ message: 'Error creating school' });
  }
});

// Get all schools
const getSchools = asyncWrapper(async (req, res) => {
  try {
    const schools = await School.findAll();
    res.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ message: 'Error fetching schools' });
  }
});

// Update a school
const updateSchool = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const school = await School.findByPk(id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    Object.assign(school, updateData);
    await school.save();

    res.json({ message: 'School updated successfully', school });
  } catch (error) {
    console.error('Error updating school:', error);
    res.status(500).json({ message: 'Error updating school' });
  }
});

// Delete a school
const deleteSchool = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  try {
    const school = await School.findByPk(id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    await School.destroy({ where: { id } });
    res.status(200).json({ message: 'School successfully deleted' });
  } catch (error) {
    console.error('Error deleting school:', error);
    res.status(500).json({ message: 'Error deleting school' });
  }
});

module.exports = {
  createSchool,
  getSchools,
  updateSchool,
  deleteSchool,
};
