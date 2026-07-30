import StorageCls, { type StorageConfig, type StorageOption, type StorageKey } from './Storage';

export { StorageCls, type StorageKey, type StorageConfig, type StorageOption };

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
 * 移除缓存，支持精确匹配和前缀匹配，支持展开传参和数组传参
 *
 * @param args - 要移除的 key 模式：
 *   - `string` — 精确匹配 key
 *   - `{ prefix: string }` — 前缀匹配，移除所有以该前缀开头的 key
 *   - 也支持传入数组
 *
 * @example
 * // 精确移除单个
 * removeStorage('token');
 *
 * @example
 * // 精确移除多个
 * removeStorage('token', 'userInfo');
 *
 * @example
 * // 前缀移除：移除所有以 'temp_' 开头的 key
 * removeStorage({ prefix: 'temp_' });
 *
 * @example
 * // 混合使用：精确移除 token，前缀移除所有 cache_ 开头的 key
 * removeStorage('token', { prefix: 'cache_' });
 *
 * @example
 * // 数组传参
 * removeStorage(['token', { prefix: 'temp_' }]);
 */
export const removeStorage = (...args: StorageKey[] | [StorageKey[]]) => globalStorage.remove(...args);

/**
 * 清除缓存
 *
 * @param scope - 清除范围：
 *   - `'managed'`（默认）：仅删除当前库管理的（匹配 prefix 的）key
 *   - `'all'`：清空整个 driver，包括非本库写入的数据
 *
 * @example
 * // 仅清除当前库管理的缓存
 * clearStorage();
 * clearStorage('managed');
 *
 * @example
 * // 清空整个 localStorage / sessionStorage
 * clearStorage('all');
 */
export const clearStorage = (scope: 'managed' | 'all' = 'managed') => globalStorage.clear(scope);

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
export const clearStorageExclude = (...args: StorageKey[] | [StorageKey[]]) => {
  const patterns: StorageKey[] = Array.isArray(args[0]) ? args[0] : (args as StorageKey[]);

  const allKeys = globalStorage.keys();
  const keysToRemove = allKeys.filter((key) =>
    !patterns.some((pattern) => {
      if (typeof pattern === 'string') return key === pattern;
      return key.startsWith(pattern.prefix);
    }),
  );

  removeStorage(keysToRemove);
};
