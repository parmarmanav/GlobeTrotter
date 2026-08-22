const mongoose = require('mongoose');
const { ACTIVITY_CATEGORIES } = require('../constants/expenseCategories');

const activitySchema = new mongoose.Schema(
  {
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City ID is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: Object.values(ACTIVITY_CATEGORIES),
      default: ACTIVITY_CATEGORIES.SIGHTSEEING,
      index: true
    },
    image: {
      type: String,
      default: ''
    },
    durationMinutes: {
      type: Number,
      default: 60
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: 0
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
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

activitySchema.index({ cityId: 1, category: 1 });
activitySchema.index({ popularityScore: -1 });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
