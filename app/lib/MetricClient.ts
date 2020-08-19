import {
  MetricClient,
  GaugeMetric,
  MetricBatch,
} from '@newrelic/telemetry-sdk/dist/src/telemetry/metrics';
import { AttributeMap } from '@newrelic/telemetry-sdk/dist/src/telemetry/attributeMap';

export type SentimentMetricArgs = {
  name: string;
  value: number;
  attrs?: AttributeMap;
  timestamp?: number;
};

export class NRMetricClient {
  public client: MetricClient;

  constructor() {
    this.client = new MetricClient({
      apiKey: process.env.NR_API_KEY as string,
      host: process.env.NR_METRIC_HOST as string,
      // path: process.env.NR_METRIC_PATH as string
    });
  }

  sendMetric = (args: SentimentMetricArgs): void => {
    const { name, value, attrs, timestamp } = args;
    const gMetric = new GaugeMetric(name, value, attrs, timestamp);
    const metricBatch = new MetricBatch(attrs, Date.now(), 1000, [gMetric]);
    this.client.send(metricBatch, (err) => {
      if (err) {
        console.log(err);
      }
    });
  };
}
