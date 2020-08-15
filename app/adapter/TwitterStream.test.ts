import { TwitterStreamAdapter } from './TwitterStream';
import nock from 'nock';
import { ReadableStream } from 'needle';

describe('TwitterStreamAdapter', () => {
  let twitterStreamAdapter: TwitterStreamAdapter;
  let host: string;
  let streamPath: string;
  let rulesPath: string;
  let nockStreamScope: nock.Interceptor;
  let options: nock.Options;
  let bearer: string;

  jest.useFakeTimers();

  beforeEach(() => {
    host = 'https://api.twitter.com';
    streamPath = '/2/tweets/search/stream';
    rulesPath = '/2/tweets/search/stream/rules';
    bearer = `Bearer ${process.env.TWITTER_BEARER_TOKEN}`;
    options = { reqheaders: { authorization: bearer } };

    nockStreamScope = nock(host, options).get(streamPath);

    twitterStreamAdapter = new TwitterStreamAdapter();
  });

  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
  });

  describe('add filter rules', () => {
    it('adds stream rules', async () => {
      const requestJson: nock.RequestBodyMatcher = {
        add: [
          {
            value: 'kittens',
            tag: 'cats with images',
          },
        ],
      };
      const responseJson: nock.ReplyBody = {
        data: [
          {
            value: 'kittens',
            tag: 'cats with images',
            id: '1294596265720926208',
          },
        ],
        meta: {
          sent: '2020-08-15T11:26:17.865Z',
          summary: {
            created: 1,
            not_created: 0,
            valid: 1,
            invalid: 0,
          },
        },
      };

      nock(host, options).post(rulesPath, requestJson).reply(201, responseJson);

      const response = await twitterStreamAdapter.addRules([
        { value: 'kittens', tag: 'cats with images' },
      ]);

      expect(response).toEqual(responseJson);
    });

    it('throws an error when rules addition fails', async () => {
      const requestJson: nock.RequestBodyMatcher = {
        add: [
          {
            value: 'kittens',
            tag: 'cats with images',
          },
        ],
      };

      nock(host, options)
        .post(rulesPath, requestJson)
        .reply(500, 'an error occurred while adding rules');

      await expect(
        twitterStreamAdapter.addRules([
          { value: 'kittens', tag: 'cats with images' },
        ]),
      ).rejects.toThrow('an error occurred while adding rules');
    });

    it('fetches all the rules', async () => {
      const responseJson = {
        data: [
          {
            id: '1293637398979584001',
            value: 'cat has:images',
            tag: 'cats with images',
          },
          {
            id: '1294596265720926208',
            value: 'kittens',
            tag: 'cats with images',
          },
        ],
        meta: {
          sent: '2020-08-15T12:58:10.575Z',
        },
      };
      nock(host, options).get(rulesPath).reply(200, responseJson);

      const response = await twitterStreamAdapter.getRules();

      expect(response).toEqual(responseJson);
    });

    it('throws an error when fetch rules fails', async () => {
      nock(host, options)
        .get(rulesPath)
        .reply(500, 'an error occurred when fetching rules');

      await expect(twitterStreamAdapter.getRules()).rejects.toThrow(
        'an error occurred when fetching rules',
      );
    });

    it('deletes rules by ids', async () => {
      const requestJson = {
        delete: {
          ids: ['1294596265720926208'],
        },
      };

      const responseJson = {
        meta: {
          sent: '2020-08-15T13:16:13.847Z',
          summary: {
            deleted: 1,
            not_deleted: 0,
          },
        },
      };
      nock(host, options).post(rulesPath, requestJson).reply(200, responseJson);

      const response = await twitterStreamAdapter.deleteRulesByIds([
        '1294596265720926208',
      ]);

      expect(response).toEqual(responseJson);
    });

    it('throws an error when delete rules fails', async () => {
      const requestJson: nock.RequestBodyMatcher = {
        delete: {
          ids: ['1294596265720926208'],
        },
      };

      nock(host, options)
        .post(rulesPath, requestJson)
        .reply(500, 'an error occurred while deleting rules');

      await expect(
        twitterStreamAdapter.deleteRulesByIds(['1294596265720926208']),
      ).rejects.toThrow('an error occurred while deleting rules');
    });
  });

  describe('handle stream', () => {
    it('handles stream data event', async (done) => {
      const mockedResponse = { message: 'hello from nock' };

      nockStreamScope.reply(200, () => mockedResponse);

      twitterStreamAdapter.startStream();
      const stream: ReadableStream | undefined = twitterStreamAdapter.stream;

      jest.spyOn(JSON, 'parse');

      stream?.on('data', () => {
        expect(JSON.parse).toHaveBeenCalledWith({ message: 'hello from nock' });
        done();
      });
    });

    it('emits stream error timeout event', async (done) => {
      nockStreamScope.replyWithError({ code: 'ETIMEDOUT' });

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
      nockStreamScope.replyWithError({ code: 'ETIMEDOUT' });

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
      nockStreamScope.replyWithError({ code: 'ETIMEDOUT' });

      twitterStreamAdapter.startStream();
      const stream: ReadableStream | undefined = twitterStreamAdapter.stream;
      // @ts-ignore
      const emitSpy = jest.spyOn(stream, 'emit');

      twitterStreamAdapter.stopStream();

      expect(emitSpy).toHaveBeenCalledWith('close');
    });
  });
});
