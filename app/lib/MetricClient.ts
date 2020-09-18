import needle from 'needle';
import { injectable } from 'inversify';

export type SentimentMetricArgs = {
  name: string;
  value: number;
  attrs?: { [key: string]: string };
  timestamp?: number;
};

@injectable()
export class NewRelicMetricClient {
  sendMetric = (args: SentimentMetricArgs): void => {
    const { name, value, attrs, timestamp } = args;

    const path = `https://${process.env.NR_METRIC_HOST}${process.env.NR_METRIC_PATH}`;
    const data = [
      {
        metrics: [
          {
            name,
            value,
            timestamp,
            attributes: attrs,
          },
        ],
      },
    ];
    const options = {
      headers: {
        'Api-Key': `${process.env.NR_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };
    needle.post(path, data, options, (err: Error | null) => {
      if (err) {
        console.log('Metric API err:', err);
      }
    });
  };
}
