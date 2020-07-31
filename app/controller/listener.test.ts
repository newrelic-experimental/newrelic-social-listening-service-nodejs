import { ListenerController } from './listener';
import {
  ISentimentRequest,
  ISentimentResponse,
} from '../service/sentimentAnalysis';
import { Request } from 'express';

class SentimentAnalysisServiceMock {
  public getSentiment(body: ISentimentRequest): ISentimentResponse {
    return { text: body.text, sentiment: 4 };
  }
}

describe('ListenerController', () => {
  let controller: ListenerController;

  beforeEach(
    () =>
      (controller = new ListenerController(new SentimentAnalysisServiceMock())),
  );

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
