const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Trip = require('../src/models/Trip');
const City = require('../src/models/City');
const Activity = require('../src/models/Activity');
const config = require('../src/config/env');

describe('STAGE 6 — ADMIN + ANALYTICS + FINAL INTEGRATION TEST SUITE', () => {
  jest.setTimeout(30000);

  let adminToken = '';
  let normalUserToken = '';
  let normalUserId = '';
  let adminUserId = '';

  let sampleCityId = '';
  let sampleActivityId = '';
  let createdTripId = '';
  let publicSlug = '';

  const adminUser = {
    firstName: 'Admin6',
    lastName: 'User',
    username: 'admin6_test',
    email: 'admin6.test@example.com',
    password: 'AdminPassword123!',
    role: 'ADMIN'
  };

  const normalUser = {
    firstName: 'Normal6',
    lastName: 'User',
    username: 'normal6_test',
    email: 'normal6.test@example.com',
    password: 'NormalPassword123!',
    role: 'USER'
  };

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongodbUri);
    }

    // Clean up existing test users
    await User.deleteMany({ email: { $in: [adminUser.email, normalUser.email, 'userb6.test@example.com'] } });

    // Create Admin User
    const adminRes = await request(app).post('/api/v1/auth/register').send(adminUser);
    adminToken = adminRes.body.data.token;
    adminUserId = adminRes.body.data.user._id;
    // Explicitly update role to ADMIN
    await User.findByIdAndUpdate(adminUserId, { role: 'ADMIN' });

    // Re-login Admin to get token with ADMIN role
    const adminLoginRes = await request(app).post('/api/v1/auth/login').send({
      identifier: adminUser.email,
      password: adminUser.password
    });
    adminToken = adminLoginRes.body.data.token;

    // Create Normal User
    const userRes = await request(app).post('/api/v1/auth/register').send(normalUser);
    normalUserToken = userRes.body.data.token;
    normalUserId = userRes.body.data.user._id;

    // Seed a sample city & activity for E2E integration test
    const city = await City.create({
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      description: 'Capital of Japan',
      costIndex: 4,
      popularityScore: 95
    });
    sampleCityId = city._id.toString();

    const activity = await Activity.create({
      cityId: sampleCityId,
      name: 'Senso-ji Temple Visit',
      description: 'Historical Buddhist temple in Asakusa',
      category: 'CULTURE',
      estimatedCost: 15,
      popularityScore: 90
    });
    sampleActivityId = activity._id.toString();
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: [adminUser.email, normalUser.email, 'userb6.test@example.com'] } });
    if (sampleCityId) await City.findByIdAndDelete(sampleCityId);
    if (sampleActivityId) await Activity.findByIdAndDelete(sampleActivityId);
    if (createdTripId) await Trip.findByIdAndDelete(createdTripId);
    await mongoose.connection.close();
  });

  // ----------------------------------------------------
  // 1. ADMIN ROLE & AUTHORIZATION SECURITY TESTS
  // ----------------------------------------------------
  describe('1. Admin Security & Role Checks', () => {
    test('GET /api/v1/admin/analytics — Should deny access to non-admin user (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${normalUserToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/forbidden/i);
    });

    test('GET /api/v1/admin/users — Should deny access without token (401 Unauthorized)', async () => {
      const res = await request(app).get('/api/v1/admin/users');
      expect(res.statusCode).toBe(401);
    });

    test('GET /api/v1/admin/analytics — Should allow access to authenticated ADMIN', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('overview');
    });
  });

  // ----------------------------------------------------
  // 2. ADMIN USER MANAGEMENT APIs
  // ----------------------------------------------------
  describe('2. Admin User Management APIs', () => {
    test('GET /api/v1/admin/users — Should list all platform users with pagination', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users?page=1&limit=10')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty('meta');
    });

    test('GET /api/v1/admin/users/:userId — Should fetch user profile by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/admin/users/${normalUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('username', normalUser.username.toLowerCase());
    });

    test('PATCH /api/v1/admin/users/:userId/status — Should update user active status', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/users/${normalUserId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isActive).toBe(false);

      // Re-enable user status
      await request(app)
        .patch(`/api/v1/admin/users/${normalUserId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: true });
    });

    test('PATCH /api/v1/admin/users/:userId/role — Should update user role', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/users/${normalUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'ADMIN' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('ADMIN');

      // Revert role back to USER
      await request(app)
        .patch(`/api/v1/admin/users/${normalUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'USER' });
    });
  });

  // ----------------------------------------------------
  // 3. ANALYTICS AGGREGATION APIs
  // ----------------------------------------------------
  describe('3. Platform Analytics Endpoints', () => {
    test('GET /api/v1/admin/analytics/overview — Should return platform metrics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics/overview')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalUsers');
      expect(res.body.data).toHaveProperty('totalTrips');
      expect(res.body.data).toHaveProperty('tripsByStatus');
    });

    test('GET /api/v1/admin/analytics/users — Should return user analytics breakdown', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('roleBreakdown');
    });

    test('GET /api/v1/admin/analytics/trips — Should return trip analytics & financial metrics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics/trips')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('statusBreakdown');
      expect(res.body.data).toHaveProperty('financials');
    });

    test('GET /api/v1/admin/analytics/cities — Should return popular cities aggregations', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics/cities')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('topRatedCities');
    });

    test('GET /api/v1/admin/analytics/activities — Should return activity usage aggregations', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics/activities')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('categoryDistribution');
    });
  });

  // ----------------------------------------------------
  // 4. FINAL END-TO-END INTEGRATION TEST FLOW
  // ----------------------------------------------------
  describe('4. Complete End-to-End User & System Flow', () => {
    let userBToken = '';

    test('Full End-to-End Workflow: User A creates trip -> publishes -> User B copies trip -> Admin verifies analytics', async () => {
      // Step A: Register User B
      const userBRes = await request(app).post('/api/v1/auth/register').send({
        firstName: 'UserB',
        lastName: 'Flow',
        username: 'userb6_flow',
        email: 'userb6.test@example.com',
        password: 'Password123!'
      });
      userBToken = userBRes.body.data.token;
      expect(userBRes.statusCode).toBe(201);

      // Step B: User A Creates a Trip
      const createTripRes = await request(app)
        .post('/api/v1/trips')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({
          name: 'Tokyo Grand Adventure 2026',
          description: 'Exploring traditional and modern Tokyo',
          startDate: '2026-11-01',
          endDate: '2026-11-10',
          budget: { totalBudget: 4000, currency: 'USD' }
        });

      expect(createTripRes.statusCode).toBe(201);
      createdTripId = createTripRes.body.data._id;

      // Step C: User A Adds a Stop to Trip
      const stopRes = await request(app)
        .post(`/api/v1/trips/${createdTripId}/stops`)
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({
          cityId: sampleCityId,
          cityName: 'Tokyo',
          country: 'Japan',
          startDate: '2026-11-01',
          endDate: '2026-11-05'
        });
      expect(stopRes.statusCode).toBe(201);

      // Step D: User A Adds Expense
      const expenseRes = await request(app)
        .post(`/api/v1/trips/${createdTripId}/expenses`)
        .set('Authorization', `Bearer ${normalUserToken}`)
        .send({
          title: 'Flight to Tokyo',
          amount: 1200,
          category: 'TRANSPORT',
          currency: 'USD'
        });
      expect(expenseRes.statusCode).toBe(201);

      // Step E: User A Publishes Trip
      const publishRes = await request(app)
        .post(`/api/v1/trips/${createdTripId}/publish`)
        .set('Authorization', `Bearer ${normalUserToken}`);
      expect(publishRes.statusCode).toBe(200);
      publicSlug = publishRes.body.data.slug;

      // Step F: User B fetches Public Trip via slug
      const publicGetRes = await request(app).get(`/api/v1/public/trips/${publicSlug}`);
      expect(publicGetRes.statusCode).toBe(200);

      // Step G: User B Copies Public Trip
      const copyRes = await request(app)
        .post(`/api/v1/public/trips/${publicSlug}/copy`)
        .set('Authorization', `Bearer ${userBToken}`);
      expect(copyRes.statusCode).toBe(201);
      expect(copyRes.body.data.name).toMatch(/Tokyo Grand Adventure/i);

      // Step H: Admin checks overall system overview analytics reflecting new trip
      const overviewRes = await request(app)
        .get('/api/v1/admin/analytics/overview')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(overviewRes.statusCode).toBe(200);
      expect(overviewRes.body.data.totalTrips).toBeGreaterThanOrEqual(2);
    });
  });
});
