const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  ucenikId: String,
  mentorId: String,
    pon: {
      type: [{
        dvorana: String,
        hour: Number,
        mentor: String, 
      }],
      default: [],
    },
    uto: {
      type: [{
        dvorana: String,
        hour: Number,
        mentor: String, 
      }],
      default: [],
    },
    sri: {
      type: [{
        dvorana: String,
        hour: Number,
        mentor: String, 
      }],
      default: [],
    },
    cet: {
      type: [{
        dvorana: String,
        hour: Number,
        mentor: String, 
      }],
      default: [],
    },
    pet: {
      type: [{
        dvorana: String,
        hour: Number,
        mentor: String, 
      }],
      default: [],
    },
    sub: {
        type: [{
          dvorana: String,
          hour: Number,
          mentor: String, 
        }],
        default: [],
      },
  },
  { timestamps: true }
  );

module.exports = mongoose.model('Raspored', scheduleSchema);