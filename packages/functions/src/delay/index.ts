/**
 * 延迟执行，返回 promise，在 await 需要等待一段时间时很有用
 * @param ms 毫秒数
 */
export const delay = (ms: number): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });
