# 在现有仓库新增 `@nex-toolbox/vue-components`（Vite lib mode）

## Context

用户希望在当前 `nex-toolbox` monorepo 中新增一个 `vue-components` 子包，并明确要求使用 **Vite 的库模式（build.lib）** 构建。核心关注点是：现有仓库能否支撑这种构建方式，还是必须新建仓库。

当前仓库是 pnpm workspace 结构的 monorepo，已包含 3 个待发布库包（functions、storage、composables）、1 个 Vue 3 示例工程、1 个 VitePress 文档站。现有库包全部使用 Rollup + esbuild + rollup-plugin-dts 构建，没有 Vite lib mode 先例，但 Vite 生态已在 `examples/example-vue3` 和文档站中间接存在。

## 结论

**现有仓库可以支撑，不需要新建仓库。**

新增 `packages/vue-components` 在 monorepo 架构上是自然扩展，`pnpm-workspace.yaml` 已包含 `packages/*`，根目录 `pnpm -r --filter=./packages/* run build` 会自动覆盖新包。新包使用 Vite lib mode 不会破坏其他包的 Rollup 构建。

只有在组件库体积极大、需要独立 CI/CD 节奏、或希望完全隔离 Vue 版本与工具链时，才建议新建仓库。

## 推荐方案

### 1. 新包构建方案：Vite lib mode + vite-plugin-dts

在 `packages/vue-components` 下使用 Vite lib mode 构建，生成与现有包一致的产物：

- `dist/index.js`（CJS）
- `dist/index.es.js`（ESM）
- `dist/index.d.ts`（类型声明）
- `dist/index.css`（组件样式，提取后由消费者手动引入）

关键配置：
- `build.lib.formats: ['es', 'cjs']`
- `build.rollupOptions.external: ['vue']`（Vue 必须作为 external，避免打包进库）
- `build.cssCodeSplit: false`（合并组件样式到 `index.css`）
- 使用 `vite-plugin-dts` 自动生成 `.d.ts`，替代现有的 `rollup-plugin-dts`（后者不原生支持 `.vue` 文件）

### 2. 包元信息设计

`packages/vue-components/package.json`：
- `name`: `@nex-toolbox/vue-components`
- `peerDependencies`: `vue: ^3.3.0`
- `devDependencies`: `vue`、`vite`、`@vitejs/plugin-vue`、`vite-plugin-dts`、`@vue/test-utils`
- `scripts.build`: `vite build`
- `scripts.release`: `release-it`
- `exports` 保持与现有包一致的结构，且 `types` 条件放在第一位

### 3. 需要新增的文件

| 文件 | 作用 |
|------|------|
| `packages/vue-components/package.json` | 包元信息、scripts、exports、peerDependencies |
| `packages/vue-components/vite.config.ts` | Vite lib mode 构建配置 |
| `packages/vue-components/tsconfig.json` | 包级 TS 配置，继承根配置并加入 Vue 类型检查 |
| `packages/vue-components/.release-it.json` | 与现有包一致的 release-it 配置 |
| `packages/vue-components/src/index.ts` | 组件统一导出入口 |
| `packages/vue-components/src/components/**/*.vue` | 组件实现 |
| `packages/vue-components/.eslintrc.cjs` | 包级 Vue lint 配置，继承根配置 |
| `packages/vue-components/README.md` | 使用说明与 CSS 引入方式 |

### 4. 需要修改的现有文件

| 文件 | 修改内容 |
|------|----------|
| `vitest.config.ts` | 修正现有 alias（`@vueuse/*` → `@nex-toolbox/*`），并新增 `@nex-toolbox/vue-components` 别名；加入 `@vitejs/plugin-vue` 插件以支持 `.vue` 单测 |
| `package.json`（根） | 新增 `@vue/test-utils`、`@vitejs/plugin-vue` 等公共 devDependencies；修复 `nano-staged` 中 `tsx.vue` 缺少逗号的 typo（改为 `tsx,vue`） |

### 5. 复用项

- pnpm workspace 结构：无需修改 `pnpm-workspace.yaml`
- 根 build 脚本：`pnpm -r --filter=./packages/* run build` 自动覆盖新包
- 发布流程：复制 `packages/composables/.release-it.json` 到新包，执行 `pnpm release` 即可
- TypeScript 基础：根 `tsconfig.json` 可作为包级配置的继承基础
- ESLint 基础：根 `.eslintrc.cjs` 可作为包级 Vue lint 配置的继承基础

## 关键风险与注意事项

1. **Vue 版本统一**：`example-vue3` 和 `composables` 均使用 `vue ^3.3.11`，新包 devDependency 保持一致，peerDependency 建议 `^3.3.0`，避免多 Vue 实例导致 `provide/inject` 失效。
2. **CSS 处理**：组件 `<style>` 默认会被 Vite 提取到 `dist/index.css`，消费者需手动引入；如需 SSR 友好，不建议把 CSS 注入 JS。
3. **外部依赖**：务必将 `vue` 加入 `build.rollupOptions.external`，否则会把 Vue 打包进组件库。
4. **依赖显式声明**：`vite`、`@vitejs/plugin-vue` 虽在 example 中已存在，新包仍应在自身 `devDependencies` 中显式声明，不要依赖隐式提升。
5. **构建产物**：输出目录统一为 `dist/`，`.gitignore` 已全局忽略，不会污染 git。
6. **dts 工具选择**：组件库必须使用 `vite-plugin-dts` 处理 `.vue` 文件，不能与现有 `rollup-plugin-dts` 混用。

## 参考配置片段

### packages/vue-components/vite.config.ts

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: resolve(__dirname, './tsconfig.json'),
      outDir: 'dist',
      insertTypesEntry: true,
      staticImport: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NexToolboxVueComponents',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'cjs') return 'index.js';
        if (format === 'es') return 'index.es.js';
        return `index.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css';
          return assetInfo.name as string;
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    outDir: 'dist',
  },
});
```

### packages/vue-components/package.json

```json
{
  "name": "@nex-toolbox/vue-components",
  "version": "0.0.1",
  "description": "Vue 3 组件库",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.es.js",
      "require": "./dist/index.js"
    },
    "./dist/*": "./dist/*",
    "./*": "./*"
  },
  "files": [
    "dist",
    "README.md"
  ],
  "sideEffects": [
    "*.css",
    "*.scss"
  ],
  "engines": {
    "node": "^18.0.0 || >= 20.0.0"
  },
  "peerDependencies": {
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "vue": "^3.3.11",
    "vite": "^5.0.9",
    "@vitejs/plugin-vue": "^4.5.2",
    "vite-plugin-dts": "^3.9.1",
    "@vue/test-utils": "^2.4.0"
  },
  "scripts": {
    "build": "vite build",
    "release": "release-it"
  },
  "publishConfig": {
    "access": "public"
  },
  "license": "MIT"
}
```

### packages/vue-components/.release-it.json

```json
{
  "git": false,
  "github": {
    "release": true
  },
  "npm": {
    "publish": true
  },
  "hooks": {
    "before:init": "pnpm build"
  }
}
```

### packages/vue-components/tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "strict": true,
    "noEmit": true
  },
  "include": ["src/**/*", "vite.config.ts"]
}
```

## 验证方式

1. 创建新包文件并安装依赖：`pnpm install`
2. 在新包目录执行 `pnpm build`，确认产物包含 `dist/index.js`、`dist/index.es.js`、`dist/index.d.ts` 和 `dist/index.css`
3. 在根目录执行 `pnpm build`，确认新包被纳入全量构建
4. 在 `examples/example-vue3` 中引入新包组件，确认能正常渲染且 Vue 未被重复打包
5. 运行 `pnpm test`，确认 vitest 能正确解析 `.vue` 文件并执行组件单测
6. 执行 `pnpm lint`，确认 `.vue` 文件能被正确 lint（如已配置 eslint-plugin-vue）
