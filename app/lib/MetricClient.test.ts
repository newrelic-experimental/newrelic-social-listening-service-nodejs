import { NewRelicMetricClient, SentimentMetricArgs } from './MetricClient';
import needle from 'needle';

describe('New Relic Metric Client', () => {
  let metricClient: NewRelicMetricClient;
  let needlePostSpy;

  beforeEach(() => {
    needlePostSpy = needle.post = jest.fn();
    metricClient = new NewRelicMetricClient();
  });

  it('creates and sends metrics object to newrelic', () => {
    const args: SentimentMetricArgs = {
      name: 'sentiment',
      value: 1.5,
      attrs: { platform: 'twitter' },
      timestamp: Date.now(),
    };
    metricClient.sendMetric(args);

    const expectedPath = `https://${process.env.NR_METRIC_HOST}${process.env.NR_METRIC_PATH}`;
    const expectedData = [
      {
        metrics: [
          {
            attributes: { platform: 'twitter' },
            name: 'sentiment',
            timestamp: expect.any(Number),
            value: 1.5,
          },
        ],
      },
    ];
    const expectedOptions = {
      headers: {
        'Api-Key': process.env.NR_API_KEY,
        'Content-Type': 'application/json',
      },
    };

    expect(needlePostSpy).toHaveBeenCalledWith(
      expectedPath,
      expectedData,
      expectedOptions,
      expect.any(Function),
    );
  });
});
