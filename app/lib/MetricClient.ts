import { MetricClient, MetricBatch } from '@newrelic/telemetry-sdk/dist/src/telemetry/metrics';

export class NRMetricClient {
  public client: MetricClient;

  constructor() {
    this.client = new MetricClient({
      apiKey: process.env.NR_API_KEY as string,
      host: process.env.NR_METRIC_HOST as string,
      // path: process.env.NR_METRIC_PATH as string
    });
  }

  sendBatch = () => {
    const batch = new MetricBatch();
    this.client.send(batch, (err) => {
      if(err) {
        console.log(err);
      }
    })
  };
}
