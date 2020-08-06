import { SentimentAnalyser } from './SentimentAnalyser';

describe('SentimentAnalyser', () => {
  let analyser: SentimentAnalyser;

  beforeEach(() => {
    analyser = new SentimentAnalyser();
  });

  it('should return positive sentiment', () => {
    const text = 'I am very happy, so so happy!';
    const result = analyser.analyse(text);

    expect(result).toBeGreaterThan(1);
  });

  it('should return negative sentiment', () => {
    const text = 'I am extremely sad!';
    const result = analyser.analyse(text);

    expect(result).toBeLessThanOrEqual(-1);
  });
});
