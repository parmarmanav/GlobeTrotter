const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Trip = require('../src/models/Trip');
const City = require('../src/models/City');
const Activity = require('../src/models/Activity');
const CommunityPost = require('../src/models/CommunityPost');
const PublicTrip = require('../src/models/PublicTrip');
const config = require('../src/config/env');

describe('STAGE 5 — COMMUNITY + PUBLIC TRIP SHARING + SAVED DESTINATIONS + ADMIN TEST SUITE', () => {
  jest.setTimeout(30000);

  let user1Token = '';
  let user2Token = '';
  let adminToken = '';
  let user1Id = '';
  let user2Id = '';
  let tripId = '';
  let cityId = '';
  let activityId = '';
  let publicSlug = '';
  let postId = '';
  let commentId = '';
  let mongoServer;

  const user1Data = {
    firstName: 'Marco',
    lastName: 'Polo',
    username: 'marcopolo_s5',
    email: 'marcopolo.s5@example.com',
    password: 'TravelPassword123!',
    phoneNumber: '+1999888777',
    city: 'Venice',
    country: 'Italy'
  };

  const user2Data = {
    firstName: 'Ibn',
    lastName: 'Battuta',
    username: 'ibnbattuta_s5',
    email: 'ibnbattuta.s5@example.com',
    password: 'TravelPassword123!',
    phoneNumber: '+1888777666',
    city: 'Tangier',
    country: 'Morocco'
  };

  const adminData = {
    firstName: 'Admin',
    lastName: 'Commander',
    username: 'admin_s5',
    email: 'admin.s5@example.com',
    password: 'AdminPassword123!',
    role: 'ADMIN'
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
    await User.deleteMany({ email: { $in: [user1Data.email, user2Data.email, adminData.email] } });
    await City.deleteMany({ name: 'Florence Discovery' });
    await Activity.deleteMany({ name: 'Uffizi Gallery Tour' });
    await CommunityPost.deleteMany({});
    await PublicTrip.deleteMany({});

    // Register User 1
    const res1 = await request(app).post('/api/v1/auth/register').send(user1Data);
    user1Token = res1.body.data.token;
    user1Id = res1.body.data.user._id;

    // Register User 2
    const res2 = await request(app).post('/api/v1/auth/register').send(user2Data);
    user2Token = res2.body.data.token;
    user2Id = res2.body.data.user._id;

    // Register Admin
    const resAdmin = await request(app).post('/api/v1/auth/register').send(adminData);
    await User.findByIdAndUpdate(resAdmin.body.data.user._id, { role: 'ADMIN' });
    const loginAdmin = await request(app).post('/api/v1/auth/login').send({
      identifier: adminData.email,
      password: adminData.password
    });
    adminToken = loginAdmin.body.data.token;

    // Seed City & Activity
    const city = await City.create({
      name: 'Florence Discovery',
      country: 'Italy',
      region: 'Europe',
      description: 'Cradle of Renaissance',
      costIndex: 3,
      popularityScore: 94,
      tags: ['renaissance', 'art', 'wine']
    });
    cityId = city._id.toString();

    const activity = await Activity.create({
      cityId: city._id,
      name: 'Uffizi Gallery Tour',
      description: 'Botticelli and Da Vinci masterpieces',
      category: 'CULTURE',
      estimatedCost: 30,
      rating: 4.9,
      popularityScore: 98,
      durationMinutes: 150
    });
    activityId = activity._id.toString();

    // Create Trip for User 1
    const trip = await Trip.create({
      userId: user1Id,
      name: 'Tuscany Roadtrip 2026',
      description: 'Exploring Florence and Chianti vineyards',
      startDate: new Date('2026-10-10'),
      endDate: new Date('2026-10-18'),
      status: 'PLANNED',
      isPublic: false,
      budget: {
        totalBudget: 2200,
        currency: 'EUR'
      },
      stops: [
        {
          cityId: city._id,
          cityName: 'Florence',
          country: 'Italy',
          startDate: new Date('2026-10-10'),
          endDate: new Date('2026-10-14'),
          sequenceOrder: 1
        }
      ],
      itineraryDays: [
        {
          dayNumber: 1,
          date: new Date('2026-10-10'),
          title: 'Day 1 - Renaissance Art',
          activities: [
            {
              activityId: activity._id,
              title: 'Uffizi Gallery Tour',
              startTime: '10:00 AM',
              endTime: '12:30 PM',
              estimatedCost: 30,
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
    await User.deleteMany({ email: { $in: [user1Data.email, user2Data.email, adminData.email] } });
    await Trip.deleteMany({ userId: { $in: [user1Id, user2Id] } });
    await City.deleteMany({ name: 'Florence Discovery' });
    await Activity.deleteMany({ name: 'Uffizi Gallery Tour' });
    await CommunityPost.deleteMany({});
    await PublicTrip.deleteMany({});
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  // ====================================================
  // 1. PUBLIC TRIP SHARING & COPYING
  // ====================================================
  describe('1. Public Trip Sharing & Copying', () => {
    test('POST /api/v1/trips/:tripId/publish — Should publish trip and generate public slug', async () => {
      const res = await request(app)
        .post(`/api/v1/trips/${tripId}/publish`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('slug');
      expect(res.body.data.isPublic).toBe(true);

      publicSlug = res.body.data.slug;
    });

    test('GET /api/v1/public/trips/:slug — Should retrieve public read-only trip with owner info', async () => {
      const res = await request(app).get(`/api/v1/public/trips/${publicSlug}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Tuscany Roadtrip 2026');
      expect(res.body.data.owner).toHaveProperty('username', 'marcopolo_s5');
      // Ensure private fields like password or email are NOT exposed in public view
      expect(res.body.data.owner).not.toHaveProperty('passwordHash');
      expect(res.body.data.owner).not.toHaveProperty('email');
    });

    test('POST /api/v1/public/trips/:slug/copy — User 2 should copy User 1 public trip', async () => {
      const res = await request(app)
        .post(`/api/v1/public/trips/${publicSlug}/copy`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Copy of Tuscany Roadtrip 2026');
      expect(res.body.data.userId.toString()).toBe(user2Id.toString());
      expect(res.body.data.isPublic).toBe(false);
    });

    test('DELETE /api/v1/trips/:tripId/publish — Should unpublish trip', async () => {
      const res = await request(app)
        .delete(`/api/v1/trips/${tripId}/publish`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.isPublic).toBe(false);

      // Subsequent public GET should return 404
      const getRes = await request(app).get(`/api/v1/public/trips/${publicSlug}`);
      expect(getRes.statusCode).toBe(404);
    });
  });

  // ====================================================
  // 2. COMMUNITY POSTS
  // ====================================================
  describe('2. Community Posts APIs', () => {
    test('POST /api/v1/community/posts — Should create a community post', async () => {
      const postData = {
        title: 'Hidden Wine Cellars in Florence',
        content: 'Discovered an incredible underground cellar right next to Ponte Vecchio...',
        cityId,
        tripId,
        images: ['https://example.com/wine.jpg']
      };

      const res = await request(app)
        .post('/api/v1/community/posts')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(postData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(postData.title);
      expect(res.body.data.userId).toHaveProperty('username', 'marcopolo_s5');

      postId = res.body.data._id;
    });

    test('GET /api/v1/community/posts — Should list community posts with search and pagination', async () => {
      const res = await request(app).get('/api/v1/community/posts?search=Florence');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0]).toHaveProperty('likesCount');
      expect(res.body.data[0]).toHaveProperty('commentsCount');
    });

    test('GET /api/v1/community/posts/:postId — Should get single community post details', async () => {
      const res = await request(app).get(`/api/v1/community/posts/${postId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(postId);
      expect(res.body.data.title).toBe('Hidden Wine Cellars in Florence');
    });

    test('PUT /api/v1/community/posts/:postId — Should update post content (Owner only)', async () => {
      const res = await request(app)
        .put(`/api/v1/community/posts/${postId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ title: 'Updated: Hidden Wine Cellars in Florence' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe('Updated: Hidden Wine Cellars in Florence');
    });

    test('PUT /api/v1/community/posts/:postId — Other user should be FORBIDDEN from updating post', async () => {
      const res = await request(app)
        .put(`/api/v1/community/posts/${postId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ title: 'Hacked Title' });

      expect(res.statusCode).toBe(403);
    });
  });

  // ====================================================
  // 3. LIKES & COMMENTS
  // ====================================================
  describe('3. Likes & Comments APIs', () => {
    test('POST /api/v1/community/posts/:postId/like — Should like post', async () => {
      const res = await request(app)
        .post(`/api/v1/community/posts/${postId}/like`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.liked).toBe(true);
      expect(res.body.data.likesCount).toBe(1);
    });

    test('POST /api/v1/community/posts/:postId/like — Duplicate like should not increment count', async () => {
      const res = await request(app)
        .post(`/api/v1/community/posts/${postId}/like`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.likesCount).toBe(1);
    });

    test('DELETE /api/v1/community/posts/:postId/like — Should unlike post', async () => {
      const res = await request(app)
        .delete(`/api/v1/community/posts/${postId}/like`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.liked).toBe(false);
      expect(res.body.data.likesCount).toBe(0);
    });

    test('POST /api/v1/community/posts/:postId/comments — Should add comment to post', async () => {
      const res = await request(app)
        .post(`/api/v1/community/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ text: 'Must visit next summer! Thanks for the tip.' });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.text).toBe('Must visit next summer! Thanks for the tip.');

      commentId = res.body.data._id;
    });

    test('GET /api/v1/community/posts/:postId/comments — Should list comments for post', async () => {
      const res = await request(app).get(`/api/v1/community/posts/${postId}/comments`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

    test('DELETE /api/v1/community/posts/:postId/comments/:commentId — Should delete comment', async () => {
      const res = await request(app)
        .delete(`/api/v1/community/posts/${postId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====================================================
  // 4. SAVED DESTINATIONS
  // ====================================================
  describe('4. Saved Destinations APIs', () => {
    test('POST /api/v1/users/me/saved-destinations/:cityId — Should save destination to user profile', async () => {
      const res = await request(app)
        .post(`/api/v1/users/me/saved-destinations/${cityId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some(c => c._id.toString() === cityId)).toBe(true);
    });

    test('GET /api/v1/users/me/saved-destinations — Should retrieve saved destinations list', async () => {
      const res = await request(app)
        .get('/api/v1/users/me/saved-destinations')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].name).toBe('Florence Discovery');
    });

    test('DELETE /api/v1/users/me/saved-destinations/:cityId — Should remove saved destination', async () => {
      const res = await request(app)
        .delete(`/api/v1/users/me/saved-destinations/${cityId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.some(c => c._id.toString() === cityId)).toBe(false);
    });
  });

  // ====================================================
  // 5. ADMIN ANALYTICS & USER MANAGEMENT
  // ====================================================
  describe('5. Admin Analytics & User Management APIs', () => {
    test('GET /api/v1/admin/analytics — Admin should retrieve platform metrics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('overview');
      expect(res.body.data.overview).toHaveProperty('totalUsers');
      expect(res.body.data.overview).toHaveProperty('totalTrips');
    });

    test('GET /api/v1/admin/users — Admin should list all platform users', async () => {
      const res = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('GET /api/v1/admin/analytics — Non-admin user should be FORBIDDEN', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toBe(403);
    });
  });
});
