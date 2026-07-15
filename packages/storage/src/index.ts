import StorageCls, { type StorageConfig, type StorageOption } from './Storage';

export { StorageCls };

const globalStorage = new StorageCls({ driver: window.localStorage });

/**
 * 获取所有缓存 key 列表（不含前缀）
 *
 * @returns 缓存 key 数组
 *
 * @example
 * // 假设 localStorage 中存在 token、userInfo、theme 三个 key
 * const keys = getStorageKeys(); // ['token', 'userInfo', 'theme']
 */
export const getStorageKeys = () => globalStorage.keys();

/**
 * 设置全局缓存配置，可在运行时动态修改驱动、前缀、加解密函数等
 *
 * @param config - 配置项
 * @param config.driver - 存储驱动，支持 localStorage / sessionStorage，默认 localStorage
 * @param config.prefix - key 前缀，用于区分不同应用的缓存，默认无前缀
 * @param config.encryptFn - 加密函数，set 时对数据进行加密，需与 decryptFn 配合使用
 * @param config.decryptFn - 解密函数，get 时对数据进行解密，需与 encryptFn 配合使用
 *
 * @example
 * // 切换为 sessionStorage
 * setStorageConfig({ driver: window.sessionStorage });
 *
 * @example
 * // 设置前缀，后续所有 key 都会自动加上 'myapp_' 前缀
 * setStorageConfig({ prefix: 'myapp_' });
 *
 * @example
 * // 配置加解密
 * setStorageConfig({
 *   encryptFn: (val) => btoa(val),
 *   decryptFn: (val) => atob(val),
 * });
 */
export const setStorageConfig = (config: StorageOption) => {
  globalStorage.config(config);
};

/**
 * 设置缓存，支持存储任意类型数据（内部自动序列化），可设置过期时间
 *
 * @param key - 缓存 key
 * @param data - 缓存数据，支持任意可序列化的值
 * @param config - 可选配置
 * @param config.expire - 过期时间，单位为秒
 *
 * @example
 * // 存储字符串
 * setStorage('token', 'abc123');
 *
 * @example
 * // 存储对象
 * setStorage('userInfo', { name: '张三', age: 18 });
 *
 * @example
 * // 存储数据并设置 60 秒后过期
 * setStorage('verifyCode', '123456', { expire: 60 });
 */
export const setStorage = (key: string, data: any, config?: StorageConfig) => {
  globalStorage.set(key, data, config);
};

/**
 * 获取缓存，支持泛型指定返回类型，过期数据自动返回 null 并清除
 *
 * @typeParam T - 返回数据类型，默认 any
 * @param key - 缓存 key
 * @returns 缓存数据，key 不存在或已过期时返回 null
 *
 * @example
 * const token = getStorage<string>('token'); // 'abc123' | null
 *
 * @example
 * interface UserInfo { name: string; age: number }
 * const user = getStorage<UserInfo>('userInfo'); // { name: '张三', age: 18 } | null
 */
export const getStorage = <T = any>(key: string) => globalStorage.get<T>(key);

/**
 * 移除一个或多个缓存
 *
 * @param keys - 要移除的缓存 key，支持传入多个
 *
 * @example
 * // 移除单个
 * removeStorage('token');
 *
 * @example
 * // 移除多个
 * removeStorage('token', 'userInfo');
 */
export const removeStorage = (...keys: string[]) => globalStorage.remove(...keys);

/**
 * 清除所有缓存（注意：会清除当前 driver 下的全部数据，包括非本库写入的）
 *
 * @example
 * clearStorage();
 */
export const clearStorage = () => globalStorage.clear();

/**
 * 清除缓存排除项的类型：
 * - `string` — 精确匹配 key
 * - `{ prefix: string }` — 前缀匹配，保留所有以该前缀开头的 key
 */
export type ClearStorageExcludeKey = string | { prefix: string };

const matchKey = (key: string, patterns: ClearStorageExcludeKey[]): boolean => {
  return patterns.some((pattern) => {
    if (typeof pattern === 'string') return key === pattern;
    return key.startsWith(pattern.prefix);
  });
};

/**
 * 清除所有缓存，但保留指定的 key。支持精确匹配和前缀匹配，支持展开传参和数组传参。
 *
 * @param args - 要保留的 key 模式，支持以下传参方式：
 *   - 展开传入多个字符串（精确匹配）
 *   - 传入字符串数组（精确匹配）
 *   - 传入 `{ prefix: string }` 进行前缀匹配
 *   - 混合使用以上类型
 *
 * @example
 * // 精确匹配：保留 token 和 userInfo，清除其余
 * clearStorageExclude('token', 'userInfo');
 *
 * @example
 * // 数组传参：保留 token 和 userInfo，清除其余
 * clearStorageExclude(['token', 'userInfo']);
 *
 * @example
 * // 前缀匹配：保留所有以 'user_' 开头的 key，清除其余
 * clearStorageExclude({ prefix: 'user_' });
 *
 * @example
 * // 混合使用：精确保留 token，前缀保留所有 session_ 开头的 key，清除其余
 * clearStorageExclude('token', { prefix: 'session_' });
 */
export const clearStorageExclude = (...args: ClearStorageExcludeKey[] | [ClearStorageExcludeKey[]]) => {
  const patterns: ClearStorageExcludeKey[] = Array.isArray(args[0]) ? args[0] : (args as ClearStorageExcludeKey[]);

  const allKeys = globalStorage.keys();
  const valuesToKeep: Record<string, any> = {};

  allKeys.forEach((key) => {
    if (matchKey(key, patterns)) {
      const value = getStorage(key);
      if (value !== null) {
        valuesToKeep[key] = value;
      }
    }
  });

  clearStorage();
  Object.keys(valuesToKeep).forEach((key) => {
    setStorage(key, valuesToKeep[key]);
  });
};
