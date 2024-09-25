# @nex-toolbox/storage

也是一个封装 localStorage 和 sessionStorage 的轻量级工具。

## 特性

- 支持 localStorage 和 sessionStorage
- 支持设置统一的前缀
- 序列化、反序列化
- 对数据进行自定义的加解密
- 支持设置过期时间（只有使用 @nex-toolbox/storage 的 getStorage 方法才有效）

## 安装
```bash
npm install @nex-toolbox/storage
# 或
pnpm add @nex-toolbox/storage
```

## 使用
```typescript
import { getStorage, setStorage } from '@nex-toolbox/storage';

setStorage('biz', { key: 'value' }); // 向浏览器 LocalStorage 写入数据

const key = getStorage('biz');  // 从浏览器 LocalStorage 读取数据
```
