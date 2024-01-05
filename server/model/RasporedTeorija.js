const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    pon: {
      type: [{
        dvorana: String,
        vrijeme: String,
        mentor: String, 
      }],
      default: [],
    },
    uto: {
      type: [{
        dvorana: String,
        vrijeme: String,
        mentor: String, 
      }],
      default: [],
    },
    sri: {
      type: [{
        dvorana: String,
        vrijeme: String,
        mentor: String, 
      }],
      default: [],
    },
    cet: {
      type: [{
        dvorana: String,
        vrijeme: String,
        mentor: String, 
      }],
      default: [],
    },
    pet: {
      type: [{
        dvorana: String,
        vrijeme: String,
        mentor: String, 
      }],
      default: [],
    },
    sub: {
        type: [{
          dvorana: String,
          vrijeme: String,
          mentor: String, 
        }],
        default: [],
      },
  },
  { timestamps: true }
  );

module.exports = mongoose.model('RasporedTeorija', scheduleSchema);