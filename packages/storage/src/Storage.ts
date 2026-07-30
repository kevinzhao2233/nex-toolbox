export type StorageCryptFn = (val: string) => string;
export type StorageKey = string | { prefix: string };
export interface StorageOption {
  /** 驱动：localStorage、sessionStorage，默认使用 localStorage */
  driver?: Storage;
  /** 名称前缀，方便区分 */
  prefix?: string;
  /** set 时对数据进行加密，配合解密 decryptFn 使用，需要保证使用统一算法加解密 */
  encryptFn?: StorageCryptFn;
  /** get 时对数据进行解密，配合加密 encryptFn 使用，需要保证使用统一算法加解密 */
  decryptFn?: StorageCryptFn;
}
export interface StorageConfig {
  // 过期时间，单位为秒，0 表示永不过期
  expire?: number;
}
export interface StorageData<T = unknown> {
  data: T;
  expire?: number;
}
/**
 * 封装Store，支持存储对象和过期时间
 */
export default class StorageCls {
  private driver: Storage;

  private prefix: string;

  private encryptFn: StorageCryptFn = (val) => val;

  private decryptFn: StorageCryptFn = (val) => val;

  constructor(option: StorageOption) {
    this.driver = option.driver ?? window.localStorage;
    this.prefix = option.prefix ?? '';
    this.encryptFn = option.encryptFn ?? this.encryptFn;
    this.decryptFn = option.decryptFn ?? this.decryptFn;
  }

  /**
   * 配置
   * @param option
   * @returns
   */
  config(option: StorageOption) {
    this.driver = option.driver ?? this.driver;
    this.prefix = option.prefix ?? this.prefix;
    this.encryptFn = option.encryptFn ?? this.encryptFn;
    this.decryptFn = option.decryptFn ?? this.decryptFn;
    return this;
  }

  /**
   * 设置缓存
   * @param key
   * @param data
   * @param config
   */
  set(key: string, data: any, config?: StorageConfig) {
    key = this.getKey(key);
    const time = new Date().getTime();
    const value = {
      expire: config?.expire ? time + config.expire * 1000 : undefined,
      data,
    } as StorageData;
    let setValue = JSON.stringify(value);
    setValue = this.encryptFn(setValue);
    this.driver.setItem(key, setValue);
  }

  /**
   * 获取缓存
   * @param key
   * @returns
   */
  get<T = any>(key: string) {
    key = this.getKey(key);
    let value = this.driver.getItem(key) || '';
    if (value) {
      try {
        value = this.decryptFn(value);
        const storageData = JSON.parse(value) as StorageData<T>;
        const time = new Date().getTime();
        if (storageData.expire && time > storageData.expire) {
          this.driver.removeItem(key);
          return null;
        }
        return storageData.data;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * 移除缓存，支持精确匹配和前缀匹配，支持展开传参和数组传参
   *
   * @param args - 要移除的 key 模式：
   *   - `string` — 精确匹配 key
   *   - `{ prefix: string }` — 前缀匹配，移除所有以该前缀开头的 key
   *   - 也支持传入数组
   *
   * @example
   * // 精确移除
   * remove('token', 'userInfo')
   *
   * @example
   * // 前缀移除
   * remove({ prefix: 'temp_' })
   *
   * @example
   * // 混合使用
   * remove('token', { prefix: 'cache_' })
   *
   * @example
   * // 数组传参
   * remove(['token', { prefix: 'temp_' }])
   */
  remove(...args: StorageKey[] | [StorageKey[]]) {
    const patterns: StorageKey[] = Array.isArray(args[0]) ? args[0] : (args as StorageKey[]);
    const allKeys = this.keys();
    const keysToRemove = allKeys.filter((key) =>
      patterns.some((pattern) => {
        if (typeof pattern === 'string') return key === pattern;
        return key.startsWith(pattern.prefix);
      }),
    );
    keysToRemove.forEach((key) => this.driver.removeItem(this.getKey(key)));
  }

  /**
   * 清除缓存
   * @param scope - 清除范围：
   *   - `'managed'`（默认）：仅删除当前库管理的（匹配 prefix 的）key
   *   - `'all'`：清空整个 driver，包括非本库写入的数据
   */
  clear(scope: 'managed' | 'all' = 'managed') {
    if (scope === 'all') {
      this.driver.clear();
      return;
    }
    const keysToRemove: string[] = [];
    for (let i = 0; i < this.driver.length; i++) {
      const fullKey = this.driver.key(i);
      if (fullKey && fullKey.startsWith(this.prefix)) {
        keysToRemove.push(fullKey);
      }
    }
    keysToRemove.forEach((key) => this.driver.removeItem(key));
  }

  /**
   * 获取所有缓存 key（不含前缀）
   */
  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < this.driver.length; i++) {
      const fullKey = this.driver.key(i);
      if (fullKey && fullKey.startsWith(this.prefix)) {
        result.push(fullKey.slice(this.prefix.length));
      }
    }
    return result;
  }

  private getKey(key: string) {
    return this.prefix + key;
  }
}
