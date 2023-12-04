const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    pon: {
      type: [{
        hour: Number,
        task: String, // You can add more attributes as needed
      }],
      default: [],
    },
    uto: {
      type: [{
        hour: Number,
        task: String,
      }],
      default: [],
    },
    sri: {
      type: [{
        hour: Number,
        task: String,
      }],
      default: [],
    },
    cet: {
      type: [{
        hour: Number,
        task: String,
      }],
      default: [],
    },
    pet: {
      type: [{
        hour: Number,
        task: String,
      }],
      default: [],
    },
    sub: {
        type: [{
          hour: Number,
          task: String,
        }],
        default: [],
      },
  },
  { timestamps: true }
  );

module.exports = mongoose.model('Tjedan', scheduleSchema);