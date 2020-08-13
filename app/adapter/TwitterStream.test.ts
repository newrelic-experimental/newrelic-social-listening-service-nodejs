import { TwitterStreamAdapter } from './TwitterStream';
import { PassThrough } from 'stream';
import nock from 'nock';

describe('TwitterAdapter', () => {
  let twitterStreamAdapter: TwitterStreamAdapter;

  beforeEach(() => (twitterStreamAdapter = new TwitterStreamAdapter()));

  it('returns 200 when a rule is set successfully');

  it('throws an error when a rule set failed');

  it('returns all the rules');

  it('deletes a rule');

  it('deletes all the rules');

  it('connects to filtered stream and returns stream', () => {
    const host = 'https://api.twitter.com';
    const path = '/2/tweets/search/stream';
    const mockedStream = new PassThrough();
    nock(host, {
      reqheaders: {
        authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
      .get(path)
      .delay(2000)
      .reply(200, () => {
        return JSON.stringify({ message: 'OK' });
      });

    twitterStreamAdapter.startStream();

    mockedStream.emit('data', 'hello world');

    expect(twitterStreamAdapter.stream).toEqual(mockedStream);

    mockedStream.end();
    mockedStream.destroy();
  });

  it('throws an error when connecting to a stream without defined rules');

  it('handles stream data event');

  it('handles stream timeout event');

  it('handles stream error event');

  it('disconnects from filtered stream');
});
