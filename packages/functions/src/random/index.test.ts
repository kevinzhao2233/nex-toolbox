import { describe, expect, it } from 'vitest';
import { random } from '.';

describe('random', () => {
  it('should return a random number between min and max', () => {
    const min = 0;
    const max = 10;
    const result = random(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  it('should return min if max is equal to min', () => {
    const min = 5;
    const max = 5;
    const result = random(min, max);
    expect(result).toBe(min);
  });

  it('should return max if min is equal to max', () => {
    const min = 10;
    const max = 10;
    const result = random(min, max);
    expect(result).toBe(max);
  });
});
