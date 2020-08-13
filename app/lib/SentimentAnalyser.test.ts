import { SentimentAnalyser } from './SentimentAnalyser';
import { Natural } from './Natural';
import { SpellCorrectorFactory } from './SpellCorrector';

describe('SentimentAnalyser', () => {
  let analyser: SentimentAnalyser;

  beforeEach(() => {
    const spellCorrector = new SpellCorrectorFactory();
    analyser = new SentimentAnalyser(new Natural(), spellCorrector);
  });

  it('returns positive sentiment', () => {
    const text = 'I am very happy, so so happy!';
    const result = analyser.analyse(text);

    expect(result).toBeGreaterThan(1);
  });

  it('returns negative sentiment', () => {
    const text = 'I am extremely sad!';
    const result = analyser.analyse(text);

    expect(result).toBeLessThanOrEqual(-1);
  });
});
