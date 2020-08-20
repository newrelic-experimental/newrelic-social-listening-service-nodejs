import { NewRelicMetricClient, SentimentMetricArgs } from './MetricClient';
import { MetricClient } from '@newrelic/telemetry-sdk/dist/src/telemetry/metrics';

describe('New Relic Metric Client', () => {
  let metricClient: NewRelicMetricClient;

  beforeEach(() => {
    metricClient = new NewRelicMetricClient();
  });

  it('initialises NR MetricClient', () => {
    expect(metricClient.client).toBeInstanceOf(MetricClient);
  });

  it('creates and sends MetricBatch', () => {
    const sendMock = (MetricClient.prototype.send = jest.fn());

    const args: SentimentMetricArgs = {
      name: 'sentiment',
      value: 1.5,
      attrs: {},
      timestamp: Date.now(),
    };
    metricClient.sendMetric(args);

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        common: {
          attributes: {},
          'interval.ms': undefined,
          timestamp: expect.any(Number),
        },
        metrics: [
          {
            'interval.ms': undefined,
            name: 'sentiment',
            timestamp: expect.any(Number),
            type: 'gauge',
            value: 1.5,
          },
        ],
      }),
      expect.any(Function),
    );
  });
});
