import { inject, injectable } from 'inversify';
import { ReadableStream } from 'needle';
import needle from 'needle';
import TYPES from '../constant/types';
import {
  ISentimentResponse,
  SentimentAnalysisService,
} from '../service/sentimentAnalysis';
import { NewRelicMetricClient } from '../lib/MetricClient';
import { SentimentMetricArgs } from '../lib/MetricClient';

export type TwitterStreamRule = {
  value: string;
  tag: string;
};

export type MatchingRules = {
  value: string;
  tag: string;
};

export type StreamData = {
  data: { text: string };
  matching_rules: MatchingRules[];
};

@injectable()
export class TwitterStreamAdapter {
  private streamUrl: string | undefined;
  private rulesUrl: string | undefined;
  public stream: ReadableStream | undefined;
  private timeout = 0;

  constructor(
    @inject(TYPES.SentimentAnalysisService)
    private sentimentAnalysisService: SentimentAnalysisService,
    @inject(TYPES.NewRelicMetricClient)
    private nrMetricClient: NewRelicMetricClient,
  ) {
    this.streamUrl = process.env.TWITTER_STREAM_URL;
    this.rulesUrl = process.env.TWITTER_RULES_URL;
  }

  public startStream = (): ReadableStream => {
    this.stream = needle.get(this.streamUrl as string, {
      headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
    });

    this.stream
      .on('data', async (data: string) => {
        try {
          const streamData: StreamData = JSON.parse(data);
          const sentiment: ISentimentResponse = await this.getSentiment(
            streamData,
          );
          this.sendMetric(streamData, sentiment);
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
        console.log('Stream has been destroyed');
      });

    return this.stream;
  };

  private getSentiment = async (
    streamData: StreamData,
  ): Promise<ISentimentResponse> => {
    const { data } = streamData;
    return await this.sentimentAnalysisService.getSentiment({
      text: data.text,
    });
  };

  private sendMetric = async (
    streamData: StreamData,
    sentiment: ISentimentResponse,
  ): Promise<void> => {
    const { matching_rules } = streamData;
    const matchingRules = this.stringifyRules(matching_rules);

    const args: SentimentMetricArgs = {
      name: 'sentiment',
      value: sentiment.sentiment,
      attrs: { platform: 'twitter', rules: matchingRules },
      timestamp: Date.now(),
    };
    this.nrMetricClient.sendMetric(args);
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

  private stringifyRules = (rules: MatchingRules[]): string =>
    rules.reduce((acc: string, rule: { tag: string }) => {
      acc += acc === '' ? rule.tag : `,${rule.tag}`;
      return acc;
    }, '');
}
