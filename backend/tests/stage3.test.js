const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Trip = require('../src/models/Trip');
const City = require('../src/models/City');
const Activity = require('../src/models/Activity');
const config = require('../src/config/env');

describe('STAGE 3 — TRIPS + ITINERARY BUILDER + DASHBOARD TEST SUITE', () => {
  let user1Token = '';
  let user2Token = '';
  let user1Id = '';
  let user2Id = '';
  let sampleCityId = '';
  let sampleActivityId = '';
  let tripId = '';
  let stopId = '';
  let dayId = '';
  let activityItemId = '';
  let mongoServer;

  const user1 = {
    firstName: 'Marco',
    lastName: 'Polo',
    username: 'marcopolo_test',
    email: 'marco.polo.test@example.com',
    password: 'TravelPassword123!',
    phoneNumber: '+1112223333',
    city: 'Venice',
    country: 'Italy'
  };

  const user2 = {
    firstName: 'Ibn',
    lastName: 'Battuta',
    username: 'ibnbattuta_test',
    email: 'ibn.battuta.test@example.com',
    password: 'TravelPassword123!',
    phoneNumber: '+4445556666',
    city: 'Tangier',
    country: 'Morocco'
  };

  beforeAll(async () => {
    // Database connection setup
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 1500 });
      } catch (err) {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
      }
    }

    // Clean up test data
    await User.deleteMany({ email: { $in: [user1.email, user2.email] } });
    await City.deleteMany({ name: { $in: ['Tokyo Test City', 'Rome Test City'] } });

    // Register User 1
    const res1 = await request(app).post('/api/v1/auth/register').send(user1);
    user1Token = res1.body.data.token;
    user1Id = res1.body.data.user._id;

    // Register User 2
    const res2 = await request(app).post('/api/v1/auth/register').send(user2);
    user2Token = res2.body.data.token;
    user2Id = res2.body.data.user._id;

    // Seed Sample City
    const city = await City.create({
      name: 'Tokyo Test City',
      country: 'Japan',
      region: 'Asia',
      description: 'The bustling capital of Japan',
      costIndex: 4,
      popularityScore: 95,
      tags: ['culture', 'food', 'technology']
    });
    sampleCityId = city._id.toString();

    // Seed Sample Activity
    const activity = await Activity.create({
      cityId: city._id,
      name: 'Shibuya Crossing & Hachiko Tour',
      description: 'Experience the world-famous scramble crossing',
      category: 'SIGHTSEEING',
      durationMinutes: 90,
      estimatedCost: 20,
      popularityScore: 92
    });
    sampleActivityId = activity._id.toString();
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: [user1.email, user2.email] } });
    await Trip.deleteMany({ userId: { $in: [user1Id, user2Id] } });
    await City.deleteMany({ name: { $in: ['Tokyo Test City', 'Rome Test City'] } });
    await Activity.deleteMany({ name: 'Shibuya Crossing & Hachiko Tour' });
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  // ====================================================
  // 1. TRIP CRUD TESTS
  // ====================================================
  describe('1. Trip CRUD Operations', () => {
    test('POST /api/v1/trips — Should successfully create a new trip', async () => {
      const tripData = {
        name: 'Japan Autumn Explorer',
        description: 'A 10-day trip exploring Tokyo, Kyoto, and Osaka',
        coverImage: 'https://example.com/japan.jpg',
        startDate: '2026-10-01',
        endDate: '2026-10-10',
        budget: {
          totalBudget: 3500,
          currency: 'USD'
        },
        isPublic: false
      };

      const res = await request(app)
        .post('/api/v1/trips')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(tripData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.name).toBe('Japan Autumn Explorer');
      expect(res.body.data.status).toBe('PLANNED');
      expect(res.body.data.budget.totalBudget).toBe(3500);

      tripId = res.body.data._id;
    });

    test('POST /api/v1/trips — Should fail if end date is before start date', async () => {
      const invalidTrip = {
        name: 'Invalid Date Trip',
        startDate: '2026-10-10',
        endDate: '2026-10-01'
      };

      const res = await request(app)
        .post('/api/v1/trips')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(invalidTrip);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('GET /api/v1/trips — Should list user trips with pagination and classification metadata', async () => {
      const res = await request(app)
        .get('/api/v1/trips')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.meta).toHaveProperty('counts');
      expect(res.body.meta.counts).toHaveProperty('upcoming');
      expect(res.body.meta.counts).toHaveProperty('total');
    });

    test('GET /api/v1/trips — Should filter trips by search query', async () => {
      const res = await request(app)
        .get('/api/v1/trips?search=Autumn')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toContain('Japan Autumn Explorer');
    });

    test('GET /api/v1/trips/:tripId — Should retrieve single trip details', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${tripId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(tripId);
      expect(res.body.data.name).toBe('Japan Autumn Explorer');
    });

    test('PUT /api/v1/trips/:tripId — Should update trip details', async () => {
      const updateData = {
        name: 'Japan Autumn Explorer - Deluxe Edition',
        budget: {
          totalBudget: 4000,
          currency: 'USD'
        }
      };

      const res = await request(app)
        .put(`/api/v1/trips/${tripId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Japan Autumn Explorer - Deluxe Edition');
      expect(res.body.data.budget.totalBudget).toBe(4000);
    });
  });

  // ====================================================
  // 2. STOP MANAGEMENT TESTS
  // ====================================================
  describe('2. Stop Management APIs', () => {
    test('POST /api/v1/trips/:tripId/stops — Should add a stop linking catalog city', async () => {
      const stopData = {
        cityId: sampleCityId,
        startDate: '2026-10-01',
        endDate: '2026-10-05',
        notes: 'Explore central Tokyo and Shibuya',
        sequenceOrder: 1
      };

      const res = await request(app)
        .post(`/api/v1/trips/${tripId}/stops`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send(stopData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.cityName).toBe('Tokyo Test City');
      expect(res.body.data.country).toBe('Japan');

      stopId = res.body.data._id;
    });

    test('POST /api/v1/trips/:tripId/stops — Should add a custom stop without catalog cityId', async () => {
      const customStop = {
        cityName: 'Kyoto',
        country: 'Japan',
        startDate: '2026-10-05',
        endDate: '2026-10-08',
        notes: 'Visit historic temples and gardens',
        sequenceOrder: 2
      };

      const res = await request(app)
        .post(`/api/v1/trips/${tripId}/stops`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send(customStop);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.cityName).toBe('Kyoto');
      expect(res.body.data.sequenceOrder).toBe(2);
    });

    test('GET /api/v1/trips/:tripId/stops — Should get all stops sorted by sequence', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${tripId}/stops`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].sequenceOrder).toBeLessThanOrEqual(res.body.data[1].sequenceOrder);
    });

    test('PUT /api/v1/trips/:tripId/stops/:stopId — Should update stop notes and dates', async () => {
      const updateStop = {
        notes: 'Updated notes: Visit teamLab Planets and Akihabara'
      };

      const res = await request(app)
        .put(`/api/v1/trips/${tripId}/stops/${stopId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send(updateStop);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.notes).toBe('Updated notes: Visit teamLab Planets and Akihabara');
    });

    test('PATCH /api/v1/trips/:tripId/stops/reorder — Should reorder stops', async () => {
      const trip = await Trip.findById(tripId);
      const stopIds = trip.stops.map(s => s._id.toString());

      // Reverse order
      const reorderPayload = {
        stops: [
          { stopId: stopIds[1], sequenceOrder: 1 },
          { stopId: stopIds[0], sequenceOrder: 2 }
        ]
      };

      const res = await request(app)
        .patch(`/api/v1/trips/${tripId}/stops/reorder`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send(reorderPayload);

      expect(res.statusCode).toBe(200);
      expect(res.body.data[0]._id.toString()).toBe(stopIds[1]);
    });
  });

  // ====================================================
  // 3. ITINERARY & ACTIVITY BUILDER TESTS
  // ====================================================
  describe('3. Itinerary Days & Activities APIs', () => {
    test('POST /api/v1/trips/:tripId/itinerary/days — Should add an itinerary day', async () => {
      const dayData = {
        dayNumber: 1,
        date: '2026-10-01',
        title: 'Arrival & Shinjuku Night Walk',
        notes: 'Check-in at hotel, grab ramen'
      };

      const res = await request(app)
        .post(`/api/v1/trips/${tripId}/itinerary/days`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send(dayData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dayNumber).toBe(1);
      expect(res.body.data.title).toBe('Arrival & Shinjuku Night Walk');

      dayId = res.body.data._id;
    });

    test('POST /api/v1/trips/:tripId/itinerary/days/:dayId/activities — Should add an activity with catalog reference', async () => {
      const activityData = {
        activityId: sampleActivityId,
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        sequenceOrder: 1,
        notes: 'Meet guide at statue'
      };

      const res = await request(app)
        .post(`/api/v1/trips/${tripId}/itinerary/days/${dayId}/activities`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send(activityData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Shibuya Crossing & Hachiko Tour');
      expect(res.body.data.estimatedCost).toBe(20);
      expect(res.body.data.category).toBe('SIGHTSEEING');

      activityItemId = res.body.data._id;
    });

    test('POST /api/v1/trips/:tripId/itinerary/days/:dayId/activities — Should add custom activity', async () => {
      const customActivity = {
        title: 'Ramen Dinner at Ichiran',
        description: 'Classic tonkotsu ramen in private dining booth',
        startTime: '07:00 PM',
        endTime: '08:30 PM',
        estimatedCost: 15,
        category: 'FOOD',
        sequenceOrder: 2
      };

      const res = await request(app)
        .post(`/api/v1/trips/${tripId}/itinerary/days/${dayId}/activities`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send(customActivity);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.title).toBe('Ramen Dinner at Ichiran');
      expect(res.body.data.category).toBe('FOOD');
    });

    test('GET /api/v1/trips/:tripId/itinerary — Should retrieve full day-wise itinerary', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${tripId}/itinerary`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].activities.length).toBe(2);
    });

    test('PUT /api/v1/trips/:tripId/itinerary/days/:dayId/activities/:itemId — Should update activity', async () => {
      const updateActivity = {
        estimatedCost: 25,
        notes: 'Pre-booked fast pass ticket'
      };

      const res = await request(app)
        .put(`/api/v1/trips/${tripId}/itinerary/days/${dayId}/activities/${activityItemId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send(updateActivity);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.estimatedCost).toBe(25);
      expect(res.body.data.notes).toBe('Pre-booked fast pass ticket');
    });

    test('DELETE /api/v1/trips/:tripId/itinerary/days/:dayId/activities/:itemId — Should delete activity', async () => {
      const res = await request(app)
        .delete(`/api/v1/trips/${tripId}/itinerary/days/${dayId}/activities/${activityItemId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====================================================
  // 4. DASHBOARD API TESTS
  // ====================================================
  describe('4. Dashboard Overview API', () => {
    test('GET /api/v1/dashboard — Should return personalized dashboard with trips, recommendations, and budget metrics', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('welcomeMessage');
      expect(res.body.data.welcomeMessage).toContain('Marco');
      expect(res.body.data).toHaveProperty('upcomingTrips');
      expect(res.body.data).toHaveProperty('recentTrips');
      expect(res.body.data).toHaveProperty('popularDestinations');
      expect(res.body.data).toHaveProperty('budgetHighlights');
      expect(res.body.data.budgetHighlights.totalTrips).toBeGreaterThanOrEqual(1);
    });
  });

  // ====================================================
  // 5. SECURITY & AUTHORIZATION TESTS
  // ====================================================
  describe('5. Access Control and Ownership Tests', () => {
    test('PUT /api/v1/trips/:tripId — User 2 should NOT be able to modify User 1 trip', async () => {
      const res = await request(app)
        .put(`/api/v1/trips/${tripId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ name: 'Hacked Trip Name' });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    test('DELETE /api/v1/trips/:tripId — User 2 should NOT be able to delete User 1 trip', async () => {
      const res = await request(app)
        .delete(`/api/v1/trips/${tripId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    test('DELETE /api/v1/trips/:tripId — User 1 can successfully delete their own trip', async () => {
      const res = await request(app)
        .delete(`/api/v1/trips/${tripId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const check = await Trip.findById(tripId);
      expect(check).toBeNull();
    });
  });
});
