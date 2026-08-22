const mongoose = require('mongoose');
const config = require('../src/config/env');
const User = require('../src/models/User');
const City = require('../src/models/City');
const Activity = require('../src/models/Activity');
const Trip = require('../src/models/Trip');

const seedData = async () => {
  try {
    console.log(`[Seed Script] Connecting to MongoDB: ${config.mongodbUri}...`);
    await mongoose.connect(config.mongodbUri);
    console.log(`[Seed Script] Connected to database: ${mongoose.connection.name}`);

    // Seed Initial User
    const existingUser = await User.findOne({ email: 'admin@globetrotter.com' });
    let adminUser;
    if (!existingUser) {
      adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'GlobeTrotter',
        username: 'admin',
        email: 'admin@globetrotter.com',
        passwordHash: 'Admin@12345',
        role: 'ADMIN',
        city: 'New York',
        country: 'USA'
      });
      console.log('[Seed Script] Initial Admin User created!');
    } else {
      adminUser = existingUser;
      console.log('[Seed Script] Admin User already exists.');
    }

    // Seed Sample City
    let paris = await City.findOne({ name: 'Paris' });
    if (!paris) {
      paris = await City.create({
        name: 'Paris',
        country: 'France',
        region: 'Europe',
        description: 'The City of Light',
        costIndex: 4,
        popularityScore: 98,
        tags: ['romantic', 'culture', 'food', 'museums']
      });
      console.log('[Seed Script] Sample City (Paris) created!');
    }

    // Seed Sample Activity
    let eiffelTour = await Activity.findOne({ name: 'Eiffel Tower Visit' });
    if (!eiffelTour && paris) {
      eiffelTour = await Activity.create({
        cityId: paris._id,
        name: 'Eiffel Tower Visit',
        description: 'Guided tour of the iconic Eiffel Tower with summit access.',
        category: 'SIGHTSEEING',
        durationMinutes: 120,
        estimatedCost: 35,
        rating: 4.8,
        popularityScore: 99,
        tags: ['landmark', 'views', 'iconic']
      });
      console.log('[Seed Script] Sample Activity (Eiffel Tower Visit) created!');
    }

    // Seed Sample Trip
    const existingTrip = await Trip.findOne({ userId: adminUser._id });
    if (!existingTrip && paris) {
      await Trip.create({
        userId: adminUser._id,
        name: 'Paris Escape 2026',
        description: 'A 5-day getaway to Paris',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-05'),
        status: 'PLANNED',
        isPublic: true,
        stops: [
          {
            cityId: paris._id,
            cityName: 'Paris',
            country: 'France',
            startDate: new Date('2026-09-01'),
            endDate: new Date('2026-09-05'),
            sequenceOrder: 1
          }
        ],
        budget: {
          totalBudget: 2500,
          currency: 'USD'
        }
      });
      console.log('[Seed Script] Sample Trip created!');
    }

    console.log('[Seed Script] Database seeded successfully! Check MongoDB Atlas Collections now.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script] Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
