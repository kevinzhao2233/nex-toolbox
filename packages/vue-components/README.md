# @nex-toolbox/vue-components

Vue 3 组件库，基于 Vite lib mode 构建，输出 ESM + CJS + 类型声明。

## 安装

```bash
pnpm add @nex-toolbox/vue-components
```

### 对等依赖

| 包名 | 版本 | 是否必须 | 使用组件 |
|------|------|----------|----------|
| `vue` | `^3.5.0` | 是 | Vue 3 核心 |
| `ant-design-vue` | `4.2.6` | 否 | NexCodeBlock、NexBlockRadio、NexPagination、NexSliderTab、NexTextEllipsis |
| `@icon-park/vue-next` | `^1.4.2` | 否 | NexCodeBlock、NexPagination、NexSliderTab |
| `@vueuse/core` | `^14.0.0` | 否 | NexCodeBlock、NexTextEllipsis、NexMarkdownArticle |

## 使用

### 全局引入样式

```ts
// main.ts
import '@nex-toolbox/vue-components/dist/index.css';
```

### 按需引入组件

```ts
import { NexCodeBlock, NexCodeEditor, NexMarkdownArticle } from '@nex-toolbox/vue-components';
```

### 引入类型

```ts
import type { SliderTabOption, IToc, StepItem, StepOptions } from '@nex-toolbox/vue-components';
```

### 自定义主题变量

组件样式基于 CSS 变量，可通过覆盖变量自定义主题：

```ts
import '@nex-toolbox/vue-components/styles/variables.css';
```

可用变量参见 [主题变量](#主题变量) 章节。

## 组件列表

### NexMiniBarCell

迷你进度条单元格，展示指标名称、当前值/总量、百分比及水平进度条。

```vue
<NexMiniBarCell name="CPU" unit="%" :value="72" :total="100" :percent="72" />
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `string` | — | 指标名称（必填） |
| `unit` | `string` | `''` | 单位，显示在名称后的括号中 |
| `value` | `number` | `0` | 当前值 |
| `total` | `number` | `0` | 总量值 |
| `percent` | `number` | `0` | 百分比，控制进度条宽度（自动 clamp 0-100） |
| `loading` | `boolean` | `false` | 是否显示加载骨架屏 |

| 插槽 | 说明 |
|------|------|
| `loading` | 自定义加载状态内容，仅在 `loading=true` 时显示 |

---

### NexCodeBlock

代码块展示组件，支持一键复制。

```vue
<NexCodeBlock code="console.log('hello')" language="javascript" />
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `code` | `string` | — | 要展示的代码文本（必填） |
| `language` | `string` | `'bash'` | 代码语言 |
| `wrap` | `boolean` | `false` | 是否自动换行 |

> 依赖：`ant-design-vue`、`@icon-park/vue-next`、`@vueuse/core`

---

### NexCodeEditor

基于 CodeMirror 6 的代码编辑器，支持多语言语法高亮和校验。

```vue
<NexCodeEditor v-model:value="code" language="json" />
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | `''` | 编辑器内容，支持 v-model |
| `language` | `string` | `'json'` | 语言，可选：`cpp` `html` `javascript` `json` `python` `xml` `yaml` `shell` |
| `readonly` | `boolean` | `false` | 是否只读模式 |
| `lineWrapping` | `boolean` | `false` | 是否启用自动换行 |

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:value` | `(code: string)` | 内容变化，用于 v-model |
| `on-change` | `(code: string)` | 内容变化 |

内置 `json` 和 `yaml` 语言的语法校验（linter + lintGutter）。

---

### NexCodeViewer

基于 CodeMirror 6 的只读代码查看器，支持多语言语法高亮和大文件安全降级。

```vue
<NexCodeViewer :value="code" language="python" />
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | `''` | 要展示的代码内容 |
| `language` | `string` | `'json'` | 语言，可选：`cpp` `html` `javascript` `json` `python` `xml`，不匹配时降级为纯文本 |

**大文件安全降级：**
- 文件超过 **1MB** 时自动降级为纯文本模式（无语法高亮）
- HTML/XML 超过 **10KB** 且包含 `<style` 或 `<script` 标签时同样降级，防止高亮引擎崩溃

> 依赖：`codemirror`、`@codemirror/state`、`@codemirror/view`、`@codemirror/language`、`@codemirror/lang-cpp`、`@codemirror/lang-html`、`@codemirror/lang-javascript`、`@codemirror/lang-json`、`@codemirror/lang-python`、`@codemirror/lang-xml`

---

### NexBlockRadio

块级单选组件，以三列网格卡片布局展示选项。

```vue
<NexBlockRadio v-model:value="selected" :options="options" />

<script setup>
const selected = ref('a');
const options = [
  { label: '选项A', value: 'a', description: '描述A' },
  { label: '选项B', value: 'b', description: '描述B', disabled: true },
];
</script>
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | — | 当前选中值，支持 v-model（必填） |
| `options` | `{ label: string; value: string; disabled?: boolean; description?: string }[]` | — | 选项列表（必填） |

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:value` | `(value: string)` | 选中项变化，用于 v-model |
| `on-change` | `(value: string)` | 选中项变化 |

> 依赖：`ant-design-vue`（Form、Radio）

---

### NexPagination

基于 Ant Design Vue Pagination 的二次封装，自定义分页按钮渲染，隐藏页面大小选择器。

```vue
<NexPagination :current="1" :total="100" :page-size="10" @change="onChange" />
```

所有属性和事件通过 `$attrs` 透传至 `a-pagination`，支持 `current`、`total`、`page-size`、`onChange` 等全部 Ant Design Vue Pagination 属性。

> 依赖：`ant-design-vue`（Pagination、Button）、`@icon-park/vue-next`（ArrowLeft、ArrowRight）

---

### NexSliderTab

滑动标签切换组件，底部滑块以动画平滑滑动到选中位置。

```vue
<NexSliderTab v-model:value="activeKey" :tabs="tabs" />

<script setup>
import type { SliderTabOption } from '@nex-toolbox/vue-components';

const activeKey = ref('tab1');
const tabs: SliderTabOption[] = [
  { name: '标签一', key: 'tab1' },
  { name: '标签二', key: 'tab2', tooltip: '提示信息' },
  { name: '标签三', key: 'tab3' },
];
</script>
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | — | 当前激活标签 key，支持 v-model（必填） |
| `tabs` | `SliderTabOption[]` | — | 标签列表（必填） |

**SliderTabOption 类型：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | `string` | 标签显示名称 |
| `key` | `string` | 标签唯一标识 |
| `id` | `string` | 可选 ID |
| `match` | `string` | 可选匹配字段 |
| `tooltip` | `string` | 可选提示文本，显示帮助图标 |

| 事件 | 参数 | 说明 |
|------|------|------|
| `update:value` | `(key: string)` | 标签切换，用于 v-model |
| `on-change` | `(activeKey: string, tabItem: SliderTabOption)` | 标签切换，返回激活 key 和完整 tab 项 |

> 依赖：`ant-design-vue`（Tooltip）、`@icon-park/vue-next`（Help）

---

### NexTextEllipsis

文本省略组件，溢出时以 Tooltip 显示完整内容。

```vue
<NexTextEllipsis text="很长的文本内容..." :rows="3" />
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | `string` | — | 需要显示的文本内容（必填） |
| `rows` | `number` | `2` | 文本省略显示的行数 |
| `tooltipWidth` | `number` | `200` | 溢出时 Tooltip 最小宽度（px） |
| `overlayInnerClass` | `string` | `''` | Tooltip 内容容器额外 CSS 类名 |
| `overlayInnerStyle` | `Record<string, string>` | `{}` | Tooltip 内容容器额外内联样式 |

> 依赖：`ant-design-vue`（Tooltip）、`@vueuse/core`（useEventListener）

---

### NexMarkdownArticle

Markdown 文章渲染与阅读组件，支持代码高亮、数学公式、目录大纲、XSS 过滤。

```vue
<NexMarkdownArticle :md="markdownText" />
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `md` | `string` | `''` | Markdown 源文本 |
| `hideOutline` | `boolean` | `false` | 是否隐藏右侧目录大纲 |

**功能特性：**

- **Markdown 解析**：`markdown-it` + 锚点、KaTeX 数学公式、上标/下标、脚注插件，自动剥离 YAML front matter
- **代码高亮**：`highlight.js` 语法高亮，代码块头部显示语言标签和复制按钮
- **XSS 过滤**：`xss` 库安全过滤，白名单控制允许的标签和属性
- **目录大纲**：自动提取 h1-h5 标题生成目录，支持点击跳转和滚动高亮
- **代码复制**：`useClipboard` 一键复制，复制后显示"已复制"反馈

**IToc 类型：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 标题锚点 ID |
| `level` | `number` | 标题层级 (1-6) |
| `text` | `string` | 标题文本 |

> 依赖：`markdown-it`、`highlight.js`、`markdown-it-anchor`、`@traptitech/markdown-it-katex`、`markdown-it-footnote`、`markdown-it-sup`、`markdown-it-sub`、`@mdit-vue/shared`、`xss`、`@vueuse/core`

---

### NexFormStep

表单分步导航组件，横向展示步骤进度。

```vue
<NexFormStep :steps="steps" :current="1" @on-change="onStepChange" />

<script setup>
import type { StepItem, StepOptions } from '@nex-toolbox/vue-components';

const steps: StepItem[] = [
  { title: '基本信息', description: '填写基本资料' },
  { title: '详细配置', description: '配置详细参数' },
  { title: '确认提交', description: '确认并提交' },
];
</script>
```

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `steps` | `StepItem[]` | — | 步骤列表（必填） |
| `current` | `number` | `0` | 当前激活步骤索引（从 0 开始） |
| `options` | `StepOptions` | 见下方 | 各状态自定义文本 |

**StepItem 类型：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 步骤标题 |
| `description` | `string` | 步骤描述 |

**StepOptions 类型及默认值：**

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `finishedText` | `string` | `'已填写'` | 已完成步骤的状态文本 |
| `inProgressText` | `string` | `'填写中'` | 进行中步骤的状态文本 |
| `waitingText` | `string` | `'未填写'` | 等待中步骤的状态文本 |

| 事件 | 参数 | 说明 |
|------|------|------|
| `on-change` | `(current: number)` | 点击步骤项时触发 |

## 主题变量

```css
:root {
  /* 主色 */
  --nex-primary-color: #7b5bec;
  --nex-primary-color-bg: rgba(123, 92, 206, 0.06);

  /* 辅助色 */
  --nex-secondary-color: #8c97ac;

  /* 语义色 */
  --nex-success-color: #0fbc49;
  --nex-warning-color: #ffab25;
  --nex-error-color: #fb5228;

  /* 链接 */
  --nex-link-color: var(--nex-primary-color);
  --nex-link-color-hover: #cab5ff;
  --nex-link-color-active: #5c44c7;

  /* 边框 */
  --nex-border-color: #dcdfe6;
  --nex-border-color-light: #e2e2e2;

  /* 文字 */
  --nex-text-color-primary: #303133;
  --nex-text-color-regular: #606266;
  --nex-text-color-secondary: #8c97ac;
  --nex-text-color-placeholder: #c0c4cc;

  /* 背景 */
  --nex-bg-color: #ffffff;
  --nex-bg-color-page: #f5f5f5;
  --nex-bg-color-light: #eef1f8;
  --nex-subtle-bg-color: #f8f9fc;

  /* 禁用态 */
  --nex-disabled-bg-color: #f5f5f5;
  --nex-disabled-text-color: #c0c4cc;

  /* 圆角 */
  --nex-border-radius-base: 4px;
  --nex-border-radius-large: 8px;
  --nex-border-radius-round: 10px;

  /* 字号 */
  --nex-font-size-base: 14px;
  --nex-font-size-small: 12px;
  --nex-font-size-large: 16px;
}
```

## 构建

```bash
pnpm build
```

输出：
- `dist/index.es.js` — ESM
- `dist/index.js` — CJS
- `dist/index.d.ts` — 类型声明
- `dist/index.css` — 样式

## License

MIT
