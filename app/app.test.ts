import app from './app';
import supertest from 'supertest';

describe('App Integration', () => {
  describe('GET /listener', () => {
    it('returns OK', async () => {
      const request = supertest(app);
      const response = await request.get('/listener');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'OK' });
    });
  });

  describe('Handlers', () => {
    describe('Error', () => {
      describe('bodyParserHandler', () => {
        it('returns error when JSON payload is malformed', async () => {
          const request = supertest(app);
          const response = await request
            .post('/listener')
            .type('json')
            .set('Content-Type', 'application/json')
            .send('\'{ "test": "malformed json"}\'');

          expect(response.status).toBe(400);
          expect(response.body.message).toEqual('Malformed JSON');
        });
      });

      describe('404', () => {
        it('returns error if no resource if found', async () => {
          const request = supertest(app);
          const response = await request.get('/abc');

          expect(response.status).toBe(404);
          expect(response.body.message).toEqual(
            '/abc is not a valid path to SLS resource.',
          );
        });
      });

      describe('405', () => {
        it('returns error if method is not allowed', async () => {
          const request = supertest(app);
          const response = await request.post('/abc');

          expect(response.status).toBe(405);
          expect(response.body.message).toEqual('POST is not supported at /');
        });
      });
    });
  });
});
