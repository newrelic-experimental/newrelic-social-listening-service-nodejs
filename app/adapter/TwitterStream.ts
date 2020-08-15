import { injectable } from 'inversify';
import { ReadableStream } from 'needle';
import needle from 'needle';

type Rule = {
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
      });

    return this.stream;
  };

  private reconnect = () =>
    setTimeout(() => {
      this.timeout++;
      this.startStream();
    }, 2 ** this.timeout);

  public stopStream = (): void => {
    this.stream?.emit('close');
  };

  public addRules = async (rules: Rule[]) => {
    const data = { add: rules };
    return await needle('post', this.rulesUrl as string, data, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
  };
}
