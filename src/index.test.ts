import main from './index';

describe('test setup test main', () => {
  it('should return a string', () => {
    const result = main();
    expect(result).toBe('abc');
  });

  it('jest should be able to return dotenv variables', () => {
    expect(process.env.REGION).toBe('local');
  });
});
