import { ApiError } from './ApiError';

describe('Helpers', () => {
  describe('ApiError', () => {
    it('constructs generic error', () => {
      const error = new ApiError();

      expect(error.status).toBe(500);
      expect(error.title).toBe('Internal Server Error');
      expect(error.message).toBe('Unknown server error occurred');
    });

    it('returns json formatted error', () => {
      const error = new ApiError();

      expect(error.toJSON()).toEqual({
        status: 500,
        title: 'Internal Server Error',
        message: 'Unknown server error occurred',
      });
    });
  });
});
