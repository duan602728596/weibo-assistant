/**
 * 本地化存储
 */

import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';
import { USER_LIST, USER } from './key';

export const storage: Storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 5000,
  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,
  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,
  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,
  sync: {
    [USER_LIST]: (params: Object): void => params.resolve(null),
    [USER]: (params: Object): void => params.resolve(null)
  }
});

global['storage'] = storage;