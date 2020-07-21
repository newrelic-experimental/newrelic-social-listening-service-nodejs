import app from './app';
import supertest from 'supertest';

const request = supertest(app);

describe('App Integration', () => {
  describe('GET /listener', () => {
    it('returns OK', async () => {
      const response = await request.get('/listener');

      expect(response.status).toBe(200);
      expect(response.text).toBe('OK');
    });
  });
});
