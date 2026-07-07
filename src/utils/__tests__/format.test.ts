import { describe, it, expect } from 'vitest';
import { formatNumber, formatCurrency, formatLargeNumber, formatPercent, formatChange } from '../format';

describe('formatNumber', () => {
  it('整数格式化', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('带小数格式化', () => {
    expect(formatNumber(1234.56, 2)).toBe('1,234.56');
  });

  it('小数字', () => {
    expect(formatNumber(42)).toBe('42');
  });
});

describe('formatCurrency', () => {
  it('默认单位万', () => {
    expect(formatCurrency(852)).toBe('852万');
  });

  it('自定义单位', () => {
    expect(formatCurrency(1280, '亿')).toBe('1,280亿');
  });
});

describe('formatLargeNumber', () => {
  it('亿级别', () => {
    expect(formatLargeNumber(150000000)).toBe('1.5亿');
  });

  it('万级别', () => {
    expect(formatLargeNumber(28500)).toBe('2.9万');
  });

  it('小数字', () => {
    expect(formatLargeNumber(500)).toBe('500');
  });
});

describe('formatPercent', () => {
  it('正数带加号', () => {
    expect(formatPercent(9.2)).toBe('+9.2%');
  });

  it('负数', () => {
    expect(formatPercent(-3.5)).toBe('-3.5%');
  });
});

describe('formatChange', () => {
  it('上涨', () => {
    const result = formatChange(11.4);
    expect(result.trend).toBe('up');
    expect(result.text).toContain('↑');
  });

  it('下跌', () => {
    const result = formatChange(-5.2);
    expect(result.trend).toBe('down');
    expect(result.text).toContain('↓');
  });

  it('持平', () => {
    const result = formatChange(0);
    expect(result.trend).toBe('flat');
  });
});
