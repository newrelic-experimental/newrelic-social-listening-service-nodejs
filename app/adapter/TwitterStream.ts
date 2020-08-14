import { injectable } from 'inversify';
import { ReadableStream } from 'needle';
import needle from 'needle';

@injectable()
export class TwitterStreamAdapter {
  public stream: ReadableStream | undefined;
  private timeout = 0;

  public startStream = (): ReadableStream => {
    const streamUrl = process.env.TWITTER_STREAM_URL as string;
    this.stream = needle.get(streamUrl, {
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
}
