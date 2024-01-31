# nex-toolbox

一个简单好用的前端工具箱，这里有常用的工具函数、Vue Composition AP（即将发布）、常见浏览器 API 的封装……

## 快速使用

### 安装

```bash
npm install @nex-toolbox/storage  # 对浏览器 LocalStorag、SessionStorage 的封装
npm install @nex-toolbox/functions  # 工具函数
# 或
pnpm add @nex-toolbox/storage
pnpm add @nex-toolbox/functions
```

### 使用

```javascript
import { getStorage, setStorage } from '@nex-toolbox/storage';
import { delay } from '@nex-toolbox/functions';

const foo = async () => {
  setStorage('biz', { key: 'value' }); // 向浏览器 LocalStorage 写入数据
  await delay(1000);  // 等待 1 秒
  const key = getStorage('biz');  // 从浏览器 LocalStorage 读取数据
}
```
