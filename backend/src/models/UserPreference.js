const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  language: {
    type: String,
    default: 'English'
  },
  interests: [
    {
      type: String
    }
  ],
  preferredBudgetRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10000 },
    currency: { type: String, default: 'USD' }
  },
  savedDestinations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City'
    }
  ]
});

module.exports = userPreferenceSchema;
