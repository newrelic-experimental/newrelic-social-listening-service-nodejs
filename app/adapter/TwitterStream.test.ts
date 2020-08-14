import { TwitterStreamAdapter } from './TwitterStream';
import nock from 'nock';
import { ReadableStream } from 'needle';

describe('TwitterAdapter', () => {
  let twitterStreamAdapter: TwitterStreamAdapter;
  let host: string;
  let path: string;

  beforeEach(() => {
    host = 'https://api.twitter.com';
    path = '/2/tweets/search/stream';
    twitterStreamAdapter = new TwitterStreamAdapter();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it.todo('returns 200 when a rule is set successfully');

  it.todo('throws an error when a rule set failed');

  it.todo('returns all the rules');

  it.todo('deletes a rule');

  it.todo('deletes all the rules');

  it.todo('connects to filtered stream and returns stream');

  it('handles stream data event', async (done) => {
    const mockedResponse = { message: 'hello from nock' };

    nock(host, {
      reqheaders: {
        authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
      .get(path)
      .reply(200, () => mockedResponse);

    twitterStreamAdapter.startStream();
    const stream: ReadableStream | undefined = twitterStreamAdapter.stream;

    jest.spyOn(JSON, 'parse');

    stream!.on('data', () => {
      expect(JSON.parse).toHaveBeenCalledWith({ message: 'hello from nock' });
      done();
    });
  });

  it('handles stream error timeout event', async (done) => {
    nock(host, {
      reqheaders: {
        authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
      .get(path)
      .replyWithError({ code: 'ETIMEDOUT' });

    twitterStreamAdapter.startStream();
    const stream: ReadableStream | undefined = twitterStreamAdapter.stream;
    // @ts-ignore
    const emitSpy = jest.spyOn(stream, 'emit');

    stream!.on('done', () => {
      expect(emitSpy).toHaveBeenCalledWith('timeout');
      done();
    });
  });

  it('disconnects from filtered stream', () => {
    nock(host, {
      reqheaders: {
        authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
      .get(path)
      .replyWithError({ code: 'ETIMEDOUT' });

    twitterStreamAdapter.startStream();
    const stream: ReadableStream | undefined = twitterStreamAdapter.stream;
    // @ts-ignore
    const emitSpy = jest.spyOn(stream, 'emit');

    twitterStreamAdapter.stopStream();

    expect(emitSpy).toHaveBeenCalledWith('close');
  });
});
