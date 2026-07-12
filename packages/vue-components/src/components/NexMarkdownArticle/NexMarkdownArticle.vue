<template>
  <div class="nex-md-container">
    <div
      v-if="!hideOutline && toc.length"
      id="outline"
      class="nex-md-container__outline"
    >
      <div
        v-for="item in toc"
        :key="item.id"
        class="nex-md-container__toc-item"
        :class="{ active: item.id === activeTocItem }"
        :title="item.text"
        :style="{ 'text-indent': `${item.level - 1}em` }"
        @click="onClickToc(item.id)"
      >
        {{ item.text }}
      </div>
    </div>
    <div
      id="article"
      ref="articleRef"
      class="nex-md-container__article nex-md-theme"
      @scroll="onScrollArticle"
      v-html="parsedHtml"
    />
  </div>
</template>
<script setup lang="ts">
import {
  nextTick, onMounted, onUnmounted, onUpdated, ref, useTemplateRef, watchEffect,
} from 'vue';
import { useDebounceFn, useScroll, useMounted, useClipboard } from '@vueuse/core';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import anchorPlugin from 'markdown-it-anchor';
import katexPlugin from '@traptitech/markdown-it-katex';
import footnotePlugin from 'markdown-it-footnote';
import supPlugin from 'markdown-it-sup';
import subPlugin from 'markdown-it-sub';
import { slugify } from '@mdit-vue/shared';
import xss from 'xss';
import type { IToc } from './types';

function highlightBlock(str: string, lang?: string) {
  const safeLang = lang || 'plaintext';
  return [
    '<div class="code-block-wrapper">',
    '<div class="code-block-header">',
    `<span class="code-block-header__lang">${safeLang}</span>`,
    '<span class="code-block-header__copy">复制</span>',
    '</div>',
    '<div class="code-block-content">',
    `<code class="hljs code-block-body ${safeLang}">${str}</code>`,
    '</div>',
    '</div>',
  ].join('');
}

const createMarkdown = (doc: string) => {
  const md: MarkdownIt = MarkdownIt({
    html: true,
    breaks: false,
    linkify: true,
    typographer: true,
    highlight(code, language) {
      const validLang = !!(language && hljs.getLanguage(language));
      if (validLang) {
        const lang = language ?? '';
        return highlightBlock(hljs.highlight(code, { language: lang }).value, lang);
      }
      return highlightBlock(hljs.highlightAuto(code).value, '');
    },
  });

  md.use(anchorPlugin, { level: [1, 2, 3, 4, 5, 6], slugify, permalink: false });
  md.use(katexPlugin);
  md.use(supPlugin);
  md.use(subPlugin);
  md.use(footnotePlugin);

  const frontMatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = doc.match(frontMatterRegex);
  if (match) {
    const content = doc.substring(match[0].length);
    return md.render(content);
  }
  return md.render(doc);
};

const createOutline = (container: HTMLElement | null): IToc[] => {
  if (!container) return [];
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5');
  const toc: IToc[] = [];
  headings.forEach((heading) => {
    toc.push({
      id: heading.id,
      level: Number(heading.tagName.substring(1)),
      text: heading.textContent || '',
    });
  });
  return toc;
};

const classTokenRe = /^([A-Za-z0-9_-]+|hljs|language-[\w-]+)$/;
const safeUrlRe = /^(https?:|mailto:|\/|#)/i;
const allowedTargets = new Set(['_blank', '_self', '_parent', '_top']);

const xssFilter = {
  whiteList: {
    a: ['href', 'title', 'target', 'rel', 'id', 'align', 'class', 'data-*'],
    img: ['src', 'alt', 'title', 'width', 'height', 'id', 'align', 'class', 'data-*'],
    code: ['id', 'align', 'class', 'data-lang'],
    pre: ['id', 'align', 'class', 'data-lang'],
    span: ['id', 'align', 'class', 'data-*'],
    div: ['id', 'align', 'class', 'data-*'],
    p: ['id', 'align', 'class'],
    h1: ['id', 'align', 'class'], h2: ['id', 'align', 'class'], h3: ['id', 'align', 'class'],
    h4: ['id', 'align', 'class'], h5: ['id', 'align', 'class'], h6: ['id', 'align', 'class'],
    ul: ['id', 'align', 'class'], ol: ['id', 'align', 'class'], li: ['id', 'align', 'class'],
    table: ['id', 'align', 'class'], thead: ['id', 'align', 'class'], tbody: ['id', 'align', 'class'],
    tr: ['id', 'align', 'class'], th: ['id', 'align', 'class'], td: ['id', 'align', 'class'],
    blockquote: ['id', 'align', 'class'],
    strong: ['id', 'align', 'class'], em: ['id', 'align', 'class'], br: ['id', 'align', 'class'],
    hr: ['id', 'align', 'class'],
  },
  onTagAttr: (tag: string, name: string, value: string) => {
    if (/^on/i.test(name)) return '';
    if (name === 'style') return '';
    if (name === 'class') {
      if (!value) return '';
      const filtered = value.split(/\s+/).filter((token: string) => classTokenRe.test(token)).join(' ');
      return filtered ? `class="${filtered}"` : '';
    }
    if (/^data-/.test(name)) {
      if (!value || /[<>]/.test(value) || /javascript:/i.test(value)) return '';
      return `${name}="${value}"`;
    }
    if (name === 'href') {
      if (!value || !safeUrlRe.test(value)) return '';
      return `${name}="${value}"`;
    }
    if (name === 'src') {
      if (!value || !/^(https?:|\/)/i.test(value)) return '';
      return `${name}="${value}"`;
    }
    if (name === 'target') {
      const v = (value || '').trim().toLowerCase();
      if (allowedTargets.has(v)) return `target="${v}"`;
      return '';
    }
    if (name === 'rel') {
      if (!value || /javascript:/i.test(value)) return '';
      return `rel="${value}"`;
    }
    return undefined;
  },
  safeAttrValue: (tag: string, name: string, value: string) => {
    if (!value) return value;
    const v = String(value).trim();
    if (name === 'href' || name === 'src') {
      if (!safeUrlRe.test(v)) return '';
      return v;
    }
    if (name === 'class') {
      return v.split(/\s+/).filter((token) => classTokenRe.test(token)).join(' ');
    }
    if (/^data-/.test(name)) {
      if (/[<>]/.test(v) || /javascript:/i.test(v)) return '';
      return v;
    }
    return v;
  },
};

interface IProps {
  md?: string;
  hideOutline?: boolean;
}

const {
  md = '',
  hideOutline = false,
} = defineProps<IProps>();

const articleRef = useTemplateRef('articleRef');

const parsedHtml = ref('');

const toc = ref<IToc[]>([]);

const activeTocItem = ref('');

const init = () => {
  if (articleRef.value && md) {
    const html = createMarkdown(md);
    parsedHtml.value = xss(html, xssFilter);

    nextTick(() => {
      toc.value = createOutline(articleRef.value);
    });
  }
};

const isMounted = useMounted();

watchEffect(() => {
  if (md && isMounted.value) {
    init();
  }
});

const { y } = useScroll(articleRef, { behavior: 'smooth' });

const onScrollArticle = () => {
  if (!articleRef.value) return;
  const scrollPosition = articleRef.value.scrollTop;
  const activeTocItems: string[] = [];
  toc.value.forEach((item) => {
    if (!item.id) return;
    const heading: HTMLElement | null = articleRef.value!.querySelector(`#${item.id}`);
    if (heading && heading.offsetTop <= scrollPosition + 540 && (heading.offsetTop + heading.offsetHeight) > scrollPosition) {
      activeTocItems.push(item.id);
    }
  });
  if (activeTocItems.length) {
    updateActiveToc(activeTocItems[activeTocItems.length - 1]);
  }
};

const updateActiveToc = useDebounceFn((newToc) => {
  activeTocItem.value = newToc;
}, 100);

const onClickToc = (id: string) => {
  if (!articleRef.value) return;
  const heading: HTMLElement | null = articleRef.value.querySelector(`#${id}`);
  if (!heading) return;
  y.value = heading.offsetTop - 540;
  setTimeout(() => {
    activeTocItem.value = id;
  }, 300);
};

const { copy } = useClipboard({ legacy: true });

function addCopyEvents() {
  if (articleRef.value) {
    const copyBtn = articleRef.value.querySelectorAll('.code-block-header__copy');
    copyBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement?.nextElementSibling?.textContent;
        if (code) {
          copy(code).then(() => {
            btn.textContent = '已复制';
            setTimeout(() => {
              btn.textContent = '复制';
            }, 1000);
          });
        }
      });
    });
  }
}

function removeCopyEvents() {
  if (articleRef.value) {
    const copyBtn = articleRef.value.querySelectorAll('.code-block-header__copy');
    copyBtn.forEach((btn) => {
      btn.removeEventListener('click', () => {});
    });
  }
}

onMounted(() => {
  addCopyEvents();
});

onUpdated(() => {
  addCopyEvents();
});

onUnmounted(() => {
  removeCopyEvents();
});
</script>

<style lang="scss" scoped>
.nex-md-container {
  display: flex;
  gap: 24px;
  width: 100%;
  height: 100%;
  padding: 12px 0 12px 38px;
  overflow: hidden;
  background: #ffffff;

  &__outline {
    min-width: 150px;
    max-width: 200px;
    padding-top: 24px;
    overflow: hidden auto;
    line-height: 1.2;
  }

  &__toc-item {
    margin-bottom: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #101c3d;
    white-space: nowrap;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: var(--nex-link-color-hover);
    }

    &:active {
      color: var(--nex-link-color-active);
    }

    &.active {
      color: var(--nex-link-color);
    }
  }

  &__article {
    flex: 1;
    padding-right: 20px;
    overflow-y: auto;
  }
}
</style>
<style lang="scss">
@use "./MarkdownTheme" as *;
</style>
