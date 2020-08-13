import { injectable } from 'inversify';
import { ReadableStream } from 'needle';
import needle from 'needle';

@injectable()
export class TwitterStreamAdapter {
  public stream: ReadableStream | undefined;

  public startStream = (): void => {
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
      .on('error', (error) => {
        if (error.code === 'ETIMEDOUT') {
          this.stream?.emit('timeout');
        }
      });
  };

  public stopStream = (): void => {
    this.stream?.emit('close');
  };
}
