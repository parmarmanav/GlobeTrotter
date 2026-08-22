const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Trip = require('../src/models/Trip');
const City = require('../src/models/City');
const Activity = require('../src/models/Activity');
const config = require('../src/config/env');

describe('STAGE 4 — CITY & ACTIVITY DISCOVERY + BUDGET & EXPENSES + CALENDAR TEST SUITE', () => {
  let userToken = '';
  let adminToken = '';
  let unauthorizedUserToken = '';
  let userId = '';
  let tripId = '';
  let cityId = '';
  let activityId = '';
  let expenseId = '';
  let mongoServer;

  const standardUser = {
    firstName: 'Amelia',
    lastName: 'Earhart',
    username: 'amelia_stage4',
    email: 'amelia.stage4@example.com',
    password: 'TravelPassword123!',
    phoneNumber: '+1987654321',
    city: 'Atchison',
    country: 'USA'
  };

  const adminUserData = {
    firstName: 'Admin',
    lastName: 'Explorer',
    username: 'admin_stage4',
    email: 'admin.stage4@example.com',
    password: 'AdminPassword123!',
    phoneNumber: '+1122334455',
    city: 'London',
    country: 'UK',
    role: 'ADMIN'
  };

  const otherUser = {
    firstName: 'Ferdinand',
    lastName: 'Magellan',
    username: 'magellan_stage4',
    email: 'magellan.stage4@example.com',
    password: 'TravelPassword123!',
    phoneNumber: '+1231231234',
    city: 'Lisbon',
    country: 'Portugal'
  };

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 1500 });
      } catch (err) {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
      }
    }

    // Clean up
    await User.deleteMany({ email: { $in: [standardUser.email, adminUserData.email, otherUser.email] } });
    await City.deleteMany({ name: { $in: ['Barcelona Test', 'Kyoto Discovery', 'Admin New City'] } });
    await Activity.deleteMany({ name: { $in: ['Sagrada Familia Guided Tour', 'Park Guell Hike', 'Admin New Activity'] } });

    // Register User
    const resUser = await request(app).post('/api/v1/auth/register').send(standardUser);
    userToken = resUser.body.data.token;
    userId = resUser.body.data.user._id;

    // Register Admin
    const resAdmin = await request(app).post('/api/v1/auth/register').send(adminUserData);
    // Explicitly grant ADMIN role in DB
    await User.findByIdAndUpdate(resAdmin.body.data.user._id, { role: 'ADMIN' });
    const loginAdmin = await request(app).post('/api/v1/auth/login').send({
      identifier: adminUserData.email,
      password: adminUserData.password
    });
    adminToken = loginAdmin.body.data.token;

    // Register Other User
    const resOther = await request(app).post('/api/v1/auth/register').send(otherUser);
    unauthorizedUserToken = resOther.body.data.token;

    // Seed Discovery City
    const city = await City.create({
      name: 'Barcelona Test',
      country: 'Spain',
      region: 'Europe',
      description: 'Cosmopolitan capital of Spain’s Catalonia region',
      costIndex: 3,
      popularityScore: 92,
      tags: ['architecture', 'beach', 'tapas', 'gaudi']
    });
    cityId = city._id.toString();

    // Seed Discovery Activity
    const activity = await Activity.create({
      cityId: city._id,
      name: 'Sagrada Familia Guided Tour',
      description: 'Exclusive priority access and tower visit',
      category: 'CULTURE',
      estimatedCost: 45,
      rating: 4.9,
      popularityScore: 97,
      durationMinutes: 120,
      tags: ['gaudi', 'unesco', 'architecture']
    });
    activityId = activity._id.toString();

    // Seed Sample Trip for Amelia
    const trip = await Trip.create({
      userId,
      name: 'Spain Adventure 2026',
      description: '10 days exploring Barcelona and Madrid',
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-10'),
      status: 'PLANNED',
      budget: {
        totalBudget: 2500,
        currency: 'EUR'
      },
      stops: [
        {
          cityId: city._id,
          cityName: 'Barcelona',
          country: 'Spain',
          startDate: new Date('2026-11-01'),
          endDate: new Date('2026-11-05'),
          sequenceOrder: 1
        }
      ],
      itineraryDays: [
        {
          dayNumber: 1,
          date: new Date('2026-11-01'),
          title: 'Day 1 - Gaudi Highlights',
          activities: [
            {
              activityId: activity._id,
              title: 'Sagrada Familia Guided Tour',
              startTime: '10:00 AM',
              endTime: '12:00 PM',
              estimatedCost: 45,
              category: 'CULTURE',
              sequenceOrder: 1
            }
          ]
        }
      ]
    });
    tripId = trip._id.toString();
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: [standardUser.email, adminUserData.email, otherUser.email] } });
    await Trip.deleteMany({ userId });
    await City.deleteMany({ name: { $in: ['Barcelona Test', 'Kyoto Discovery', 'Admin New City'] } });
    await Activity.deleteMany({ name: { $in: ['Sagrada Familia Guided Tour', 'Park Guell Hike', 'Admin New Activity'] } });
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  // ====================================================
  // 1. CITY DISCOVERY TESTS
  // ====================================================
  describe('1. City Discovery APIs', () => {
    test('GET /api/v1/cities/featured/top — Should return top featured cities', async () => {
      const res = await request(app).get('/api/v1/cities/featured/top');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    test('GET /api/v1/cities — Should search and filter cities by query, tag, and cost', async () => {
      const res = await request(app).get('/api/v1/cities?search=Barcelona&costIndex=3');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].name).toBe('Barcelona Test');
      expect(res.body.meta).toHaveProperty('totalPages');
    });

    test('GET /api/v1/cities/:cityId — Should retrieve city details and associated activities', async () => {
      const res = await request(app).get(`/api/v1/cities/${cityId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(cityId);
      expect(res.body.data).toHaveProperty('activities');
      expect(res.body.data.activities.length).toBeGreaterThanOrEqual(1);
    });

    test('POST /api/v1/cities — Admin should be able to create new city', async () => {
      const newCity = {
        name: 'Admin New City',
        country: 'Germany',
        region: 'Europe',
        costIndex: 3,
        popularityScore: 80,
        tags: ['castles', 'beer']
      };

      const res = await request(app)
        .post('/api/v1/cities')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCity);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.name).toBe('Admin New City');
    });

    test('POST /api/v1/cities — Regular user should be FORBIDDEN from creating city', async () => {
      const res = await request(app)
        .post('/api/v1/cities')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Unauthorized City', country: 'Nowhere' });

      expect(res.statusCode).toBe(403);
    });
  });

  // ====================================================
  // 2. ACTIVITY DISCOVERY TESTS
  // ====================================================
  describe('2. Activity Discovery APIs', () => {
    test('GET /api/v1/activities — Should search and filter activities by category and rating', async () => {
      const res = await request(app).get('/api/v1/activities?category=CULTURE&minRating=4.0');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].category).toBe('CULTURE');
    });

    test('GET /api/v1/cities/:cityId/activities — Should get activities specifically for a city', async () => {
      const res = await request(app).get(`/api/v1/cities/${cityId}/activities`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].name).toBe('Sagrada Familia Guided Tour');
    });

    test('GET /api/v1/activities/:activityId — Should get single activity details with populated city', async () => {
      const res = await request(app).get(`/api/v1/activities/${activityId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data._id).toBe(activityId);
      expect(res.body.data.cityId).toHaveProperty('name', 'Barcelona Test');
    });

    test('POST /api/v1/activities — Admin should be able to create new activity', async () => {
      const newActivity = {
        cityId,
        name: 'Park Guell Hike',
        description: 'Spectacular views over Barcelona',
        category: 'NATURE',
        estimatedCost: 15,
        rating: 4.7
      };

      const res = await request(app)
        .post('/api/v1/activities')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newActivity);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.name).toBe('Park Guell Hike');
    });
  });

  // ====================================================
  // 3. BUDGET & EXPENSES TRACKING TESTS
  // ====================================================
  describe('3. Budget & Expense Tracker APIs', () => {
    test('POST /api/v1/trips/:tripId/expenses — Should log a new trip expense', async () => {
      const expenseData = {
        title: 'Tapas Dinner in Gothic Quarter',
        amount: 85.50,
        category: 'FOOD',
        currency: 'EUR',
        date: '2026-11-02',
        notes: 'Delicious paella and sangria'
      };

      const res = await request(app)
        .post(`/api/v1/trips/${tripId}/expenses`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(expenseData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.amount).toBe(85.5);
      expect(res.body.data.category).toBe('FOOD');

      expenseId = res.body.data._id;
    });

    test('POST /api/v1/trips/:tripId/expenses — Should add second expense for category breakdown', async () => {
      const expense2 = {
        title: 'Boutique Hotel Barcelona',
        amount: 450,
        category: 'ACCOMMODATION',
        currency: 'EUR',
        date: '2026-11-01'
      };

      const res = await request(app)
        .post(`/api/v1/trips/${tripId}/expenses`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(expense2);

      expect(res.statusCode).toBe(201);
    });

    test('GET /api/v1/trips/:tripId/budget — Should compute comprehensive budget stats and category breakdown for charts', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${tripId}/budget`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalBudget).toBe(2500);
      expect(res.body.data.totalExpenses).toBe(535.5);
      expect(res.body.data.remainingBudget).toBe(1964.5);
      expect(res.body.data.isOverBudget).toBe(false);
      expect(res.body.data).toHaveProperty('categoryBreakdown');
      expect(Array.isArray(res.body.data.categoryBreakdown)).toBe(true);
      expect(res.body.data.recentExpenses.length).toBe(2);
    });

    test('GET /api/v1/trips/:tripId/expenses — Should list and filter expenses by category', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${tripId}/expenses?category=FOOD`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].category).toBe('FOOD');
    });

    test('PUT /api/v1/trips/:tripId/expenses/:expenseId — Should update expense details', async () => {
      const res = await request(app)
        .put(`/api/v1/trips/${tripId}/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ amount: 95.00, notes: 'Updated bill including tip' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.amount).toBe(95.00);
      expect(res.body.data.notes).toBe('Updated bill including tip');
    });

    test('PUT /api/v1/trips/:tripId/budget — Should update total trip budget', async () => {
      const res = await request(app)
        .put(`/api/v1/trips/${tripId}/budget`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ totalBudget: 3000, currency: 'EUR' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.totalBudget).toBe(3000);
    });

    test('DELETE /api/v1/trips/:tripId/expenses/:expenseId — Should delete expense', async () => {
      const res = await request(app)
        .delete(`/api/v1/trips/${tripId}/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====================================================
  // 4. CALENDAR & TIMELINE TESTS
  // ====================================================
  describe('4. Calendar and Timeline APIs', () => {
    test('GET /api/v1/trips/:tripId/calendar — Should return formatted events for trip calendar/timeline', async () => {
      const res = await request(app)
        .get(`/api/v1/trips/${tripId}/calendar`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('events');
      expect(Array.isArray(res.body.data.events)).toBe(true);
      expect(res.body.data.events.some(e => e.type === 'TRIP')).toBe(true);
      expect(res.body.data.events.some(e => e.type === 'STOP')).toBe(true);
      expect(res.body.data.events.some(e => e.type === 'ACTIVITY')).toBe(true);
    });

    test('GET /api/v1/calendar — Should return all aggregated calendar events for current user', async () => {
      const res = await request(app)
        .get('/api/v1/calendar')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ====================================================
  // 5. SECURITY & ACCESS CONTROL TESTS
  // ====================================================
  describe('5. Stage 4 Security & Access Control', () => {
    test('User 2 cannot view or log expenses on User 1 trip', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${tripId}/expenses`)
        .set('Authorization', `Bearer ${unauthorizedUserToken}`)
        .send({ title: 'Unauthorized Expense', amount: 100 });

      expect(res.statusCode).toBe(403);
    });

    test('User 2 cannot update User 1 trip budget', async () => {
      const res = await request(app)
        .put(`/api/v1/trips/${tripId}/budget`)
        .set('Authorization', `Bearer ${unauthorizedUserToken}`)
        .send({ totalBudget: 10000 });

      expect(res.statusCode).toBe(403);
    });
  });
});
