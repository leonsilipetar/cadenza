const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  ucenikId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'Mentor',
  },
    pon: {
      type: [{
        dvorana: String,
        vrijeme: Number,
        mentor: String, 
      }],
      default: [],
    },
    uto: {
      type: [{
        dvorana: String,
        vrijeme: Number,
        mentor: String, 
      }],
      default: [],
    },
    sri: {
      type: [{
        dvorana: String,
        vrijeme: Number,
        mentor: String, 
      }],
      default: [],
    },
    cet: {
      type: [{
        dvorana: String,
        vrijeme: Number,
        mentor: String, 
      }],
      default: [],
    },
    pet: {
      type: [{
        dvorana: String,
        vrijeme: Number,
        mentor: String, 
      }],
      default: [],
    },
    sub: {
        type: [{
          dvorana: String,
          vrijeme: Number,
          mentor: String, 
        }],
        default: [],
      },
  },
  { timestamps: true }
  );

module.exports = mongoose.model('Raspored', scheduleSchema);