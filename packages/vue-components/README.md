# @nex-toolbox/vue-components

Vue 3 组件库，基于 Vite lib mode 构建。

## 安装

```bash
pnpm add @nex-toolbox/vue-components
```

## 使用

```ts
import { NxButton } from '@nex-toolbox/vue-components';
import '@nex-toolbox/vue-components/dist/index.css';
```

## 组件

### NxButton

按钮组件。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | `'primary' \| 'default'` | `'default'` | 按钮类型 |
| disabled | `boolean` | `false` | 是否禁用 |
