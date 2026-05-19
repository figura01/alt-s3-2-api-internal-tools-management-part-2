import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    service = new AnalyticsService({} as never);
  });

  describe('roundCurrency', () => {
    it('should round to 2 decimals by default', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
      const result = (service as any).roundCurrency(12.3456);

      expect(result).toBe(12.35);
    });

    it('should round with custom decimals', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
      const result = (service as any).roundCurrency(12.3456, 1);

      expect(result).toBe(12.3);
    });
  });

  describe('calculateCostPerUser', () => {
    it('should calculate cost per user correctly', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
      const result = (service as any).calculateCostPerUser(100, 4);

      expect(result).toBe(25);
    });

    it('should handle division by zero', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
      const result = (service as any).calculateCostPerUser(100, 0);

      expect(result).toBe(100);
    });
  });
});
