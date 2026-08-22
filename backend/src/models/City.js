const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
      index: true
    },
    country: {
      type: String,
      required: [true, 'Country name is required'],
      trim: true,
      index: true
    },
    region: {
      type: String,
      default: '',
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    costIndex: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
      index: true
    },
    popularityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

// Compound indexes for searching and sorting
citySchema.index({ name: 1, country: 1 }, { unique: true });

const City = mongoose.model('City', citySchema);

module.exports = City;
