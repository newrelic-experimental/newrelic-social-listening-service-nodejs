import { MetricClient } from '@newrelic/telemetry-sdk/dist/src/telemetry/metrics';
import needle from 'needle';
import { AttributeMap } from '@newrelic/telemetry-sdk/dist/src/telemetry/attributeMap';
// import { IncomingMessage } from 'http';
import { injectable } from 'inversify';

export type SentimentMetricArgs = {
  name: string;
  value: number;
  attrs?: AttributeMap;
  timestamp?: number;
};

@injectable()
export class NewRelicMetricClient {
  public client: MetricClient;

  constructor() {
    this.client = new MetricClient({
      apiKey: process.env.NR_API_KEY as string,
      host: process.env.NR_METRIC_HOST as string,
    });
  }

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
    needle.post(path, data, options, (err, resp) => {
      if (err) {
        console.log('Metric API err:', err);
      }
    });
  };
}
