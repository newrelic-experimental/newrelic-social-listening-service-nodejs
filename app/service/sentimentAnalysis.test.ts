import { SentimentAnalysisService } from './sentimentAnalysis';

describe('SentimentAnalysisSercice', () => {
  let service: SentimentAnalysisService;

  beforeEach(() => {
    service = new SentimentAnalysisService();
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
