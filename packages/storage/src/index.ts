import StorageCls, { type StorageConfig, type StorageOption } from './Storage';

export { StorageCls };

const globalStorage = new StorageCls({ driver: window.localStorage });
// 设置全局缓存配置
export const setStorageConfig = (config: StorageOption) => {
  globalStorage.config(config);
};
// 设置缓存
export const setStorage = (key: string, data: any, config?: StorageConfig) => {
  globalStorage.set(key, data, config);
};
// 获取缓存
export const getStorage = <T = any>(key: string) => globalStorage.get<T>(key);
// 移除缓存
export const removeStorage = (...keys: string[]) => globalStorage.remove(...keys);
// 清楚缓存
export const clearStorage = () => globalStorage.clear();
// 清除缓存，但排除特定 key
export const clearStorageExclude = (...keys: string[]) => {
  const valuesToKeep: Record<string, any> = {};

  keys.forEach((key) => {
    const value = getStorage(key);
    if (value !== null) {
      valuesToKeep[key] = value;
    }
  });

  clearStorage();
  Object.keys(valuesToKeep).forEach((key) => {
    setStorage(key, valuesToKeep[key]);
  });
};
