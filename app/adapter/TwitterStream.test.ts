import { TwitterStreamAdapter } from './TwitterStream';
import nock from 'nock';
import { ReadableStream } from 'needle';

describe('TwitterAdapter', () => {
  let twitterStreamAdapter: TwitterStreamAdapter;
  let host: string;
  let path: string;
  let nockScope: nock.Interceptor;

  jest.useFakeTimers();

  beforeEach(() => {
    host = 'https://api.twitter.com';
    path = '/2/tweets/search/stream';

    nockScope = nock(host, {
      reqheaders: {
        authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }).get(path);

    twitterStreamAdapter = new TwitterStreamAdapter();
  });

  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
  });

  it.todo('returns 200 when a rule is set successfully');

  it.todo('throws an error when a rule set failed');

  it.todo('returns all the rules');

  it.todo('deletes a rule');

  it.todo('deletes all the rules');

  it.todo('connects to filtered stream and returns stream');

  it('handles stream data event', async (done) => {
    const mockedResponse = { message: 'hello from nock' };

    nockScope.reply(200, () => mockedResponse);

    twitterStreamAdapter.startStream();
    const stream: ReadableStream | undefined = twitterStreamAdapter.stream;

    jest.spyOn(JSON, 'parse');

    stream?.on('data', () => {
      expect(JSON.parse).toHaveBeenCalledWith({ message: 'hello from nock' });
      done();
    });
  });

  it('emits stream error timeout event', async (done) => {
    nockScope.replyWithError({ code: 'ETIMEDOUT' });

    twitterStreamAdapter.startStream();
    const stream: ReadableStream | undefined = twitterStreamAdapter.stream;
    // @ts-ignore
    const emitSpy = jest.spyOn(stream, 'emit');

    stream?.on('err', () => {
      expect(emitSpy).toHaveBeenCalledWith('timeout');
      done();
    });
  });

  it('handles stream error timeout event by reconnecting exponentially', () => {
    nockScope.replyWithError({ code: 'ETIMEDOUT' });

    const startStreamSpy = jest.spyOn(twitterStreamAdapter, 'startStream');

    twitterStreamAdapter.startStream();

    jest.advanceTimersToNextTimer(); // tick for event
    jest.advanceTimersToNextTimer(); // tick for reconnect timeout

    expect(startStreamSpy).toHaveBeenCalledTimes(1);

    jest.advanceTimersToNextTimer(); // tick for event
    jest.advanceTimersToNextTimer(); // tick for reconnect timeout

    expect(startStreamSpy).toHaveBeenCalledTimes(2);

    jest.advanceTimersToNextTimer(); // tick for event
    jest.advanceTimersToNextTimer(); // tick for reconnect timeout

    expect(startStreamSpy).toHaveBeenCalledTimes(3);
  });

  it('disconnects from filtered stream', () => {
    nockScope.replyWithError({ code: 'ETIMEDOUT' });

    twitterStreamAdapter.startStream();
    const stream: ReadableStream | undefined = twitterStreamAdapter.stream;
    // @ts-ignore
    const emitSpy = jest.spyOn(stream, 'emit');

    twitterStreamAdapter.stopStream();

    expect(emitSpy).toHaveBeenCalledWith('close');
  });
});
