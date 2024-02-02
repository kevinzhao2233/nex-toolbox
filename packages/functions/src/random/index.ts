/**
 * 生成随机数
 * @param min 最小值
 * @param max 最大值
 * @param returnDecimal 是否返回小数
 */
export const random = (min: number, max: number, returnDecimal: boolean = false) => {
  if (!returnDecimal) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return Math.random() * (max - min) + min;
};
