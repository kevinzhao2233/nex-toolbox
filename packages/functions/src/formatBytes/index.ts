type ByteUnits = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

const unitMultipliers: { [key in ByteUnits]: number } = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
  PB: 1024 ** 5,
};

const isNegative = (input: string | number): boolean => {
  if (typeof input === 'number') {
    return input < 0;
  }
  return input.startsWith('-');
};

/**
 * 将字节转换为友好的带单位的字符串。
 * @param input 可以是纯数字或带有单位的字符串（例如 "12223MB"）
 * @param decimalPlaces 输出结果中小数点后的位数
 * @returns 转换后的友好字符串
 */
export const formatBytes = (input: string | number, decimalPlaces?: number): { text: string; value: number | string; unit: ByteUnits } => {
  // 解析输入值和单位
  let value: number;
  let inputUnit: ByteUnits = 'B'; // 默认单位为字节

  const negative = isNegative(input);
  let innerInput = input;
  if (negative) {
    innerInput = typeof input === 'number' ? -input : input.slice(1);
  }

  if (typeof innerInput === 'string') {
    const match = innerInput.match(/^(\d+(\.\d+)?)([kKmMgGtTpP][bB]?)?$/);
    if (!match) throw new Error('Invalid input format. Expected a number with an optional unit (e.g., 12345 or 12345MB).');

    value = parseFloat(match[1]);
    const tmpUnit = (match[3] || '').toUpperCase();
    inputUnit = tmpUnit.endsWith('B') ? tmpUnit as ByteUnits : `${tmpUnit}B` as ByteUnits;
  } else {
    value = innerInput;
  }

  // 将输入值转换为字节
  value *= unitMultipliers[inputUnit];

  // 查找合适的单位来表示这个值
  for (const unit of ['PB', 'TB', 'GB', 'MB', 'KB', 'B'] as ByteUnits[]) {
    if (value >= unitMultipliers[unit]) {
      const result = decimalPlaces === undefined ? value / unitMultipliers[unit] : (value / unitMultipliers[unit]).toFixed(decimalPlaces);
      return {
        text: `${negative ? '-' : ''}${result}${unit}`,
        value: negative ? (typeof result === 'number' ? -result : `-${result}`) : result,
        unit,
      };
    }
  }

  // 如果没有找到合适的单位，返回原始值
  const text = decimalPlaces === undefined ? `${value}B` : `${value.toFixed(decimalPlaces)}B`;
  return {
    text: `${negative ? '-' : ''}${text}`,
    value: negative ? (typeof text === 'number' ? -text : `-${text}`) : text,
    unit: 'B',
  };
};
