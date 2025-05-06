import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/users', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
  });
});
