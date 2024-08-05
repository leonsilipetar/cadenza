const School = require('../model/School'); // Adjust the path to your School model

// Controller function to get the list of schools
const getSchools = async (req, res) => {
  try {
    const schools = await School.find({});
    res.status(200).json(schools);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

module.exports = {
  getSchools,
};
