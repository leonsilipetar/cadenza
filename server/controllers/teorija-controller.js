const RasporedTeorija = require('../model/RasporedTeorija');

const updateTeorija = async (req, res) => {
    try {
        const { raspored } = req.body;

        // Assuming you have a logged-in user and their ID is stored in req.userId
        const userId = req.userId;

        // Find the existing RasporedTeorija for the logged-in user
        let rasporedTeorija = await RasporedTeorija.findOne({ userId });

        if (!rasporedTeorija) {
            // If the RasporedTeorija doesn't exist, create a new one
            rasporedTeorija = new RasporedTeorija({ userId });
        }

        // Iterate over each day in raspored and update the schedule
        raspored.forEach((item) => {
            const { day, dvorana, vrijeme, mentor } = item;

            // Check if the day already has an array, if not, initialize it
            if (!rasporedTeorija[day]) {
                rasporedTeorija[day] = [];
            }

            // Add the new term to the array for the specific day
            rasporedTeorija[day].push({
                dvorana: dvorana || '',
                vrijeme: vrijeme || '', // Assuming you want to store hours as a number
                mentor: mentor || '',
            });
        });

        // Save the updated RasporedTeorija
        await rasporedTeorija.save();

        res.status(200).json({ message: 'Raspored teorija updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


const getTeorija = async (req, res) => {
    try {
        // Assuming you want to retrieve all Teorija data
        const teorija = await RasporedTeorija.find();

        res.status(200).json({teorija});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const deleteTermin = async (req, res) => {
    try {
        const { id } = req.params;
        const { day, teorijaID } = req.query;

        // Log the values for debugging
        console.log("id:", id);
        console.log("day:", day);
        console.log("teorijaID:", teorijaID);

        // Find the document by teorija ID
        const rasporedTeorija = await RasporedTeorija.findById(teorijaID);

        if (!rasporedTeorija) {
            return res.status(404).json({ message: 'RasporedTeorija not found' });
        }

        // Find the index of the term in the specified day array
        const termIndex = rasporedTeorija[day].findIndex(term => term._id == id);

        if (termIndex === -1) {
            return res.status(404).json({ message: 'Termin not found' });
        }

        // Remove the term from the specified day array
        rasporedTeorija[day].splice(termIndex, 1);

        // Save the updated document
        await rasporedTeorija.save();

        res.status(200).json({ message: 'Termin deleted successfully' });
    } catch (error) {
        console.error('Error deleting term:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};









module.exports = { updateTeorija, getTeorija, deleteTermin };
