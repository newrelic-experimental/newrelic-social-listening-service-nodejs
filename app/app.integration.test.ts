import { serverInstance } from './container';
import supertest from 'supertest';

const request = supertest(serverInstance);

describe('App Integration', () => {
  describe('GET /listener', () => {
    it('returns OK', async () => {
      const response = await request.get('/listener');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'OK' });
    });

    describe('GET /listener/sentiment', () => {
      it('returns weight of sentiment of given text', async () => {
        const response = await request
          .post('/listener/sentiment')
          .send({ text: 'test' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ text: 'test', sentiment: 0 });
      });
    });
  });

  describe('Handlers', () => {
    describe('Error', () => {
      describe('bodyParserHandler', () => {
        it('returns error when JSON payload is malformed', async () => {
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
          const response = await request.get('/abc');

          expect(response.status).toBe(404);
          expect(response.body.message).toEqual(
            '/abc is not a valid path to SLS resource.',
          );
        });
      });

      describe('405', () => {
        it('returns error if method is not allowed', async () => {
          const response = await request.post('/abc');

          expect(response.status).toBe(405);
          expect(response.body.message).toEqual('POST is not supported at /');
        });
      });
    });
  });
});
