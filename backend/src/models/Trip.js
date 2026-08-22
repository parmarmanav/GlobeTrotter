const mongoose = require('mongoose');
const TRIP_STATUS = require('../constants/tripStatus');
const { EXPENSE_CATEGORIES, ACTIVITY_CATEGORIES } = require('../constants/expenseCategories');

const stopSchema = new mongoose.Schema({
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  },
  cityName: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  sequenceOrder: {
    type: Number,
    default: 1
  },
  notes: {
    type: String,
    default: ''
  }
});

const itineraryActivitySchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  startTime: {
    type: String,
    default: ''
  },
  endTime: {
    type: String,
    default: ''
  },
  estimatedCost: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: Object.values(ACTIVITY_CATEGORIES),
    default: ACTIVITY_CATEGORIES.OTHER
  },
  sequenceOrder: {
    type: Number,
    default: 1
  },
  notes: {
    type: String,
    default: ''
  }
});

const itineraryDaySchema = new mongoose.Schema({
  date: {
    type: Date
  },
  dayNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  activities: [itineraryActivitySchema]
});

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: Object.values(EXPENSE_CATEGORIES),
    default: EXPENSE_CATEGORIES.OTHER
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
});

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    coverImage: {
      type: String,
      default: ''
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    status: {
      type: String,
      enum: Object.values(TRIP_STATUS),
      default: TRIP_STATUS.PLANNED,
      index: true
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true
    },
    stops: [stopSchema],
    itineraryDays: [itineraryDaySchema],
    budget: {
      totalBudget: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    expenses: [expenseSchema]
  },
  {
    timestamps: true
  }
);

// Indexes
tripSchema.index({ userId: 1, createdAt: -1 });
tripSchema.index({ isPublic: 1, createdAt: -1 });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
