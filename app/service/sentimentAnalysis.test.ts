import { SentimentAnalysisService } from './sentimentAnalysis';
import { SentimentAnalyser } from '../lib/SentimentAnalyser';

class SentimentAnalyserMock {
  analyse = (text: string) => 3;
}

describe('SentimentAnalysisService', () => {
  let service: SentimentAnalysisService;

  beforeEach(() => {
    const sentimentAnalyser = new SentimentAnalyserMock();
    service = new SentimentAnalysisService(
      sentimentAnalyser as SentimentAnalyser,
    );
  });

  it('returns sentiment of given text', () => {
    const text = 'kind of positive text';
    const result = service.getSentiment({ text });

    expect(result).toEqual({
      text,
      sentiment: 3,
    });
  });
});
