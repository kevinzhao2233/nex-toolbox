# CLAUDE.md

## 项目概述

pnpm monorepo，前端工具函数库，发布到 npm。包名前缀 `@nex-toolbox/`。

## 常用命令

```bash
pnpm install              # 必须用 pnpm（preinstall 会拦截 npm/yarn）
pnpm build                # 构建所有 packages
pnpm lint                 # ESLint 检查
pnpm lint:fix             # ESLint 自动修复
pnpm test                 # vitest（watch 模式）
pnpm coverage             # vitest 单次运行 + 覆盖率
```

## Monorepo 结构

| 目录 | 包名 | 说明 |
|---|---|---|
| `packages/storage` | `@nex-toolbox/storage` | localStorage/sessionStorage 封装 |
| `packages/functions` | `@nex-toolbox/functions` | 通用工具函数（delay、random、list2tree、tree2List、formatBytes） |
| `packages/composables` | `@nex-toolbox/composables` | Vue Composition API（开发中，src 为空） |
| `docs` | `@nex-toolbox/docs` | VitePress 文档站 |
| `examples/example-vue3` | `@nex-toolbox/example-vue3` | Vue3 调试示例 |

- `packages/share` 在 workspace 中被排除（`pnpm-workspace.yaml` 和 `vitest.workspace.ts` 均排除）
- 每个包独立 `release-it` 发布，`git: false`，发布前自动 `pnpm build`

## 构建与发布

- 每个包用 Rollup + esbuild 构建，输出 CJS (`dist/index.js`) + ESM (`dist/index.es.js`) + 类型声明 (`dist/index.d.ts`)
- `composables` 包 rollup 配置中 `vue` 为 external
- 根目录 `pnpm release` 管理整体版本；各包 `pnpm release`（在包目录内执行）发布到 npm

## 测试

- Vitest + jsdom 环境，workspace 模式
- 测试文件与源码同目录：`src/<module>/index.test.ts`
- 目前仅 `functions` 包有测试（list2tree、random、formatBytes）
- 运行单个测试：`pnpm vitest run packages/functions/src/list2tree/index.test.ts`

## Commit 规范

必须匹配：`type(scope): subject`，subject 不超过 50 字符。

允许的 type：`feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release`

示例：`feat(functions): 添加 delay 方法`

pre-commit 钩子会通过 `nano-staged` 运行 eslint，commit-msg 钩子校验格式。

## 代码风格

- TypeScript，2 空格缩进（ESLint 强制）
- 类型注解冒号前无空格、后有空格；箭头函数冒号前后均有空格
- 行宽上限 140（忽略注释和字符串）
- `@typescript-eslint/no-explicit-any`: off
- `no-param-reassign`: off

## 其他规范
- `docs/dev/` 目录下的文件为开发用，比如你可以将计划列到这里，或者记录一些临时信息。。
- Vite 的用法可以参考 https://vite.dev/llms-full.txt。

