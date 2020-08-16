import { injectable } from 'inversify';
import { ReadableStream } from 'needle';
import needle from 'needle';

export type TwitterStreamRule = {
  value: string;
  tag: string;
};

@injectable()
export class TwitterStreamAdapter {
  private streamUrl: string | undefined;
  private rulesUrl: string | undefined;
  public stream: ReadableStream | undefined;
  private timeout = 0;

  constructor() {
    this.streamUrl = process.env.TWITTER_STREAM_URL;
    this.rulesUrl = process.env.TWITTER_RULES_URL;
  }

  public startStream = (): ReadableStream => {
    this.stream = needle.get(this.streamUrl as string, {
      headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
    });

    this.stream
      .on('data', (data) => {
        try {
          console.log(JSON.parse(data));
        } catch (e) {
          // Keep alive signal received. Do nothing.
        }
      })
      .on('err', (error) => {
        if (error.code === 'ETIMEDOUT') {
          this.stream?.emit('timeout');
        }
      })
      .on('timeout', () => {
        this.reconnect();
      })
      .on('close', () => {
        console.log('Stream has been destroyed and file has been closed');
      });

    return this.stream;
  };

  private reconnect = () =>
    setTimeout(() => {
      this.timeout++;
      this.startStream();
    }, 2 ** this.timeout);

  public stopStream = (): void => {
    // @ts-ignore
    this.stream.request.abort();
    // @ts-ignore
    this.stream.destroy();
  };

  public addRules = async (
    rules: TwitterStreamRule[],
  ): Promise<needle.BodyData> => {
    const data = { add: rules };
    const response = await needle('post', this.rulesUrl as string, data, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.statusCode !== 201) {
      throw new Error(response.body);
    }

    return response.body;
  };

  public getRules = async (): Promise<needle.BodyData> => {
    const response = await needle('get', this.rulesUrl as string, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.statusCode !== 200) {
      throw new Error(response.body);
    }

    return response.body;
  };

  public deleteRulesByIds = async (ids: string[]): Promise<needle.BodyData> => {
    const data = { delete: { ids } };
    const response = await needle('post', this.rulesUrl as string, data, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.statusCode !== 200) {
      throw new Error(response.body);
    }

    return response.body;
  };
}
