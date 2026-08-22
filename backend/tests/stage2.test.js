const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const config = require('../src/config/env');

describe('STAGE 2 — AUTHENTICATION + PROFILE API TEST SUITE', () => {
  let userToken = '';
  let adminToken = '';
  let userId = '';

  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe_test',
    email: 'john.doe.test@example.com',
    password: 'Password123!',
    phoneNumber: '+1234567890',
    city: 'San Francisco',
    country: 'USA'
  };

  const adminUser = {
    firstName: 'Super',
    lastName: 'Admin',
    username: 'admin_test',
    email: 'admin.test@example.com',
    password: 'AdminPassword123!',
    phoneNumber: '+1987654321',
    city: 'New York',
    country: 'USA'
  };

  let mongoServer;

  beforeAll(async () => {
    // Connect to MongoDB using MemoryServer or env URI
    if (mongoose.connection.readyState === 0) {
      try {
        await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 1500 });
      } catch (err) {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
      }
    }
    // Clean up test users
    await User.deleteMany({ email: { $in: [testUser.email, adminUser.email, 'duplicate.email@example.com'] } });
  });

  afterAll(async () => {
    // Clean up created test users
    await User.deleteMany({ email: { $in: [testUser.email, adminUser.email, 'duplicate.email@example.com'] } });
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  // ----------------------------------------------------
  // 1. REGISTRATION TESTS
  // ----------------------------------------------------
  describe('1. Registration APIs', () => {
    test('POST /api/v1/auth/register — Should register a new user successfully', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', testUser.email.toLowerCase());
      expect(res.body.data.user).not.toHaveProperty('passwordHash');

      userId = res.body.data.user._id;
      userToken = res.body.data.token;
    });

    test('POST /api/v1/auth/register — Should fail on duplicate email', async () => {
      const duplicateEmailUser = { ...testUser, username: 'different_username' };
      const res = await request(app).post('/api/v1/auth/register').send(duplicateEmailUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/email/i);
    });

    test('POST /api/v1/auth/register — Should fail on duplicate username', async () => {
      const duplicateUsernameUser = { ...testUser, email: 'different.email@example.com' };
      const res = await request(app).post('/api/v1/auth/register').send(duplicateUsernameUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/username/i);
    });
  });

  // ----------------------------------------------------
  // 2. LOGIN TESTS
  // ----------------------------------------------------
  describe('2. Login APIs', () => {
    test('POST /api/v1/auth/login — Should login successfully with valid email & password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        identifier: testUser.email,
        password: testUser.password
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('username', testUser.username.toLowerCase());
    });

    test('POST /api/v1/auth/login — Should login successfully with valid username & password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        identifier: testUser.username,
        password: testUser.password
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    test('POST /api/v1/auth/login — Should fail with wrong password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        identifier: testUser.email,
        password: 'WrongPassword123'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid/i);
    });
  });

  // ----------------------------------------------------
  // 3. JWT & PROTECTED API TESTS
  // ----------------------------------------------------
  describe('3. JWT & Protected API Authorization', () => {
    test('GET /api/v1/auth/me — Should access protected route with valid JWT Bearer token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('email', testUser.email.toLowerCase());
    });

    test('GET /api/v1/auth/me — Should reject request without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('GET /api/v1/auth/me — Should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid_token_12345');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // ----------------------------------------------------
  // 4. PROFILE APIs TESTS
  // ----------------------------------------------------
  describe('4. Profile APIs', () => {
    test('GET /api/v1/users/me — Should fetch user profile', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('firstName', testUser.firstName);
    });

    test('PUT /api/v1/users/me — Should update user profile fields', async () => {
      const updateData = {
        firstName: 'JohnUpdated',
        lastName: 'DoeUpdated',
        bio: 'Avid world traveler & adventurer',
        city: 'Los Angeles'
      };

      const res = await request(app)
        .put('/api/v1/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.firstName).toBe('JohnUpdated');
      expect(res.body.data.user.bio).toBe('Avid world traveler & adventurer');
    });

    test('PATCH /api/v1/users/me/preferences — Should update user travel preferences', async () => {
      const prefs = {
        language: 'Spanish',
        interests: ['Hiking', 'Food', 'Culture'],
        preferredBudgetRange: { min: 500, max: 3000, currency: 'USD' }
      };

      const res = await request(app)
        .patch('/api/v1/users/me/preferences')
        .set('Authorization', `Bearer ${userToken}`)
        .send(prefs);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.preferences.language).toBe('Spanish');
      expect(res.body.data.user.preferences.interests).toEqual(expect.arrayContaining(['Hiking', 'Food']));
    });

    test('POST /api/v1/users/me/profile-image — Should update profile image URL', async () => {
      const res = await request(app)
        .post('/api/v1/users/me/profile-image')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ profileImage: 'https://example.com/avatar.jpg' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.profileImage).toBe('https://example.com/avatar.jpg');
    });
  });

  // ----------------------------------------------------
  // 5. ROLE AUTHORIZATION TESTS
  // ----------------------------------------------------
  describe('5. Role Authorization', () => {
    test('Role restriction middleware — Should restrict USER role from ADMIN routes', async () => {
      const { restrictTo } = require('../src/middlewares/role.middleware');
      const express = require('express');
      const testRouter = express();
      testRouter.use(express.json());

      testRouter.get('/admin-only', (req, res, next) => {
        req.user = { role: 'USER' };
        next();
      }, restrictTo('ADMIN'), (req, res) => {
        res.json({ success: true, message: 'Welcome Admin' });
      });

      const res = await request(testRouter).get('/admin-only');
      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/forbidden/i);
    });
  });

  // ----------------------------------------------------
  // 6. ACCOUNT DELETION TEST
  // ----------------------------------------------------
  describe('6. Account Deletion API', () => {
    test('DELETE /api/v1/users/me — Should soft delete / deactivate user account', async () => {
      const res = await request(app)
        .delete('/api/v1/users/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/deleted|deactivated/i);

      // Verify that deactivated user cannot access protected routes
      const checkRes = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`);

      expect(checkRes.statusCode).toBe(401);
    });
  });
});
