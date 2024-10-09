import { describe, expect, it } from 'vitest';
import { formatBytes } from '.';

describe('formatBytes', () => {
  it('纯数字', () => {
    const result = formatBytes(1024);
    expect(result).toEqual({ text: '1KB', value: 1, unit: 'KB' });
  });

  it('带有单位的 MB', () => {
    const result = formatBytes('1024MB');
    expect(result).toEqual({ text: '1GB', value: 1, unit: 'GB' });
  });

  it('带有单位的 m', () => {
    const result = formatBytes('1024m');
    expect(result).toEqual({ text: '1GB', value: 1, unit: 'GB' });
  });

  it('负数', () => {
    const result = formatBytes(-1024);
    expect(result).toEqual({ text: '-1KB', value: -1, unit: 'KB' });
  });

  it('负数带单位', () => {
    const result = formatBytes('-1024MB', 2);
    expect(result).toEqual({ text: '-1.00GB', value: '-1.00', unit: 'GB' });
  });
});
