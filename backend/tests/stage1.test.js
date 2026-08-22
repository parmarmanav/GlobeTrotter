const request = require('supertest');
const app = require('../src/app');

describe('STAGE 1 — FOUNDATION & HEALTH TEST SUITE', () => {
  test('GET /api/v1/health — Should return 200 OK and health status', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('GlobeTrotter API is running');
  });

  test('GET /api/v1/docs.json — Should return OpenAPI Swagger spec', async () => {
    const res = await request(app).get('/api/v1/docs.json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('openapi');
    expect(res.body.info.title).toBe('GlobeTrotter API');
  });

  test('GET /non-existent-route — Should return 404 with structured error response', async () => {
    const res = await request(app).get('/api/v1/random-route-not-found');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
