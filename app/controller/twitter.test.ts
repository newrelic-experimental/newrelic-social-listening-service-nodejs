import { TwitterController } from './twitter';
import { Readable } from 'stream';
import { TwitterStreamAdapter } from '../adapter/TwitterStream';
import { Request } from 'express';

class TwitterStreamAdapterMock {
  stream = new Readable();
  private timeout = 0;
  private streamUrl: string | undefined;
  private rulesUrl: string | undefined;

  constructor() {
    this.streamUrl = 'test';
    this.rulesUrl = 'test';
  }
  startStream = jest.fn();
  reconnect = jest.fn();
  stopStream = jest.fn();
  addRules = jest.fn();
  getRules = jest.fn();
  deleteRulesByIds = jest.fn();
}

describe('TwitterController', () => {
  let twitterController: TwitterController;
  const twitterStreamAdapter = (new TwitterStreamAdapterMock() as unknown) as TwitterStreamAdapter;
  beforeEach(() => {
    twitterController = new TwitterController(twitterStreamAdapter);
  });

  it('fetches twitter stream rules', () => {
    twitterController.fetchAllRules();

    expect(twitterStreamAdapter.getRules).toHaveBeenCalled();
  });

  it('adds twitter stream rules', () => {
    const rules = [{ value: 'test', tag: 'test' }];
    const request = { body: rules } as Request;
    twitterController.addRules(request);

    expect(twitterStreamAdapter.addRules).toHaveBeenCalledWith(rules);
  });

  it('removes twitter stream rules', () => {
    const ids = ['234olikhj243oi4', 'fd09sd90872323'];
    const request = { body: ids } as Request;
    twitterController.deleteRules(request);

    expect(twitterStreamAdapter.deleteRulesByIds).toHaveBeenCalledWith(ids);
  });
});
