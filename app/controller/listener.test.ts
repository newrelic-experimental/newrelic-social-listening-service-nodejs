import { ListenerController } from './listener';
import {
  ISentimentRequest,
  ISentimentResponse,
  SentimentAnalysisService,
} from '../service/sentimentAnalysis';
import { Request } from 'express';
import { SentimentAnalyser } from '../lib/SentimentAnalyser';

class SentimentAnalysisServiceMock {
  private sentimentAnalyser: SentimentAnalyser;
  constructor(analyser: SentimentAnalyserMock) {
    this.sentimentAnalyser = analyser as SentimentAnalyser;
  }
  public getSentiment(body: ISentimentRequest): ISentimentResponse {
    return { text: body.text, sentiment: 4 };
  }
}

class SentimentAnalyserMock {
  analyse = (text: string) => 4;
}

describe('ListenerController', () => {
  let controller: ListenerController;

  beforeEach(() => {
    const sentimentAnalyser = new SentimentAnalyserMock();
    const sentimentAnalysisService = new SentimentAnalysisServiceMock(
      sentimentAnalyser,
    );
    controller = new ListenerController(
      (sentimentAnalysisService as unknown) as SentimentAnalysisService,
    );
  });

  it('returns OK message from get', () =>
    expect(controller.get()).toEqual({ message: 'OK' }));

  it('returns sentiment weight of text', () => {
    const request = { body: { text: 'test' } } as Request;
    expect(controller.getSentiment(request)).toEqual({
      text: 'test',
      sentiment: 4,
    });
  });
});
