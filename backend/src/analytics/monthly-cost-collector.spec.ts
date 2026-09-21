import { Logger } from '@nestjs/common';
import { MonthlyCostCollector } from './monthly-cost-collector.service';

describe('Monthly cost collector scheduling', () => {
  const execute = jest.fn();
  let collector: MonthlyCostCollector;
  beforeEach(() => {
    jest.useFakeTimers();
    execute.mockReset().mockResolvedValue(0);
    collector = new MonthlyCostCollector({ $executeRaw: execute } as never);
  });
  afterEach(() => { collector.onApplicationShutdown(); jest.useRealTimers(); jest.restoreAllMocks(); });
  it('collects at startup and hourly, then stops on shutdown', async () => {
    await collector.onApplicationBootstrap();
    expect(execute).toHaveBeenCalledTimes(1);
    await jest.advanceTimersByTimeAsync(3600000);
    expect(execute).toHaveBeenCalledTimes(2);
    collector.onApplicationShutdown();
    await jest.advanceTimersByTimeAsync(3600000);
    expect(execute).toHaveBeenCalledTimes(2);
  });
  it('does not overlap an in-progress collection', async () => {
    let finish!: (value: number) => void;
    execute.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    const pending = collector.collect();
    await collector.collect();
    expect(execute).toHaveBeenCalledTimes(1);
    finish(0);
    await pending;
    await collector.collect();
    expect(execute).toHaveBeenCalledTimes(2);
  });
  it('logs a database failure without preventing startup or future retries', async () => {
    const log = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    execute.mockRejectedValueOnce(new Error('database unavailable'));
    await collector.onApplicationBootstrap();
    expect(log).toHaveBeenCalled();
    await jest.advanceTimersByTimeAsync(3600000);
    expect(execute).toHaveBeenCalledTimes(2);
  });
});
