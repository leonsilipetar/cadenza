const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classroomSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  school: { type: Schema.Types.ObjectId, ref: 'School', required: true }, // Reference to School
}, { timestamps: true });

module.exports = mongoose.model('Classroom', classroomSchema);
