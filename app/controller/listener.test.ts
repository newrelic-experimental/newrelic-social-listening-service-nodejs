import { ListenerController } from './listener';
import { Request } from 'express';
import { SentimentAnalyserMock } from '../test/mock/SentimentAnalyserMock';
import { SentimentAnalysisServiceMock } from '../test/mock/sentimentAnalysisServiceMock';

describe('ListenerController', () => {
  let controller: ListenerController;

  beforeEach(() => {
    const sentimentAnalyser = new SentimentAnalyserMock();
    const sentimentAnalysisService = new SentimentAnalysisServiceMock(
      sentimentAnalyser,
    );
    // @ts-ignore
    controller = new ListenerController(sentimentAnalysisService);
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
