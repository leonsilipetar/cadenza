const mongoose = require('mongoose');

const invoiceSettingsSchema = new mongoose.Schema({
  nazivObrta: {
    type: String,
    required: true
  },
  oib: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{11}$/.test(v);
      },
      message: props => `${props.value} nije validan OIB!`
    }
  },
  iban: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^HR\d{19}$/.test(v);
      },
      message: props => `${props.value} nije validan IBAN!`
    }
  },
  brojRacuna: {
    type: String,
    required: true
  },
  adresa: {
    ulica: {
      type: String,
      required: true
    },
    kucniBroj: {
      type: String,
      required: true
    },
    mjesto: {
      type: String,
      required: true
    },
    postanskiBroj: {
      type: String,
      required: true
    }
  },
  dodatneInformacije: {
    type: String,
    default: ''
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InvoiceSettings', invoiceSettingsSchema); 