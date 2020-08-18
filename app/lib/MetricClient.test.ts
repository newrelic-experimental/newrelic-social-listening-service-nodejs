import { NRMetricClient } from './MetricClient';
import { MetricClient } from '@newrelic/telemetry-sdk/dist/src/telemetry/metrics';

describe('New Relic Metric Client', () => {
  let metricClient: NRMetricClient;

  beforeEach(() => {
    metricClient = new NRMetricClient();
  });

  it('initialises NR MetricClient', () => {
    expect(metricClient.client).toBeInstanceOf(MetricClient);
  });

  it('creates and sends MetricBatch', () => {
    const sendSpy = jest.spyOn(MetricClient.prototype, 'send');

    metricClient.sendBatch();

    expect(sendSpy).toHaveBeenCalled();
  });
});
