<template>
  <div
    ref="codeViewerRef"
    class="nex-code-viewer"
  />
</template>
<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch, nextTick } from 'vue';
import { basicSetup } from 'codemirror';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { LanguageSupport } from '@codemirror/language';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { xml } from '@codemirror/lang-xml';

interface P {
  language?: string;
  value?: string;
}

const props = withDefaults(defineProps<P>(), {
  language: 'json',
  value: '',
});

const languageMap: Record<string, () => LanguageSupport> = {
  cpp,
  html,
  javascript,
  json,
  python,
  xml,
};

const languageConf = new Compartment();
const codeViewerRef = useTemplateRef('codeViewerRef');
const editorView = ref<EditorView | null>(null);

const getSafeLanguage = (lang: string, val: string) => {
  const fileLength = val.length;

  if (fileLength > 1024 * 1024) {
    console.warn(`文件体积过大 (${(fileLength / 1024 / 1024).toFixed(2)}MB)，已自动降级为纯文本模式以保证流畅度。`);
    return null;
  }

  if (lang === 'html' || lang === 'xml') {
    if (fileLength > 10240 && (val.includes('<style') || val.includes('<script'))) {
      console.warn('HTML 内容包含复杂的内联样式或脚本，已自动降级为普通文本模式，防止高亮引擎崩溃。');
      return null;
    }
  }

  return languageMap[lang] ? languageMap[lang]() : null;
};

const initEditor = () => {
  if (editorView.value) {
    editorView.value.destroy();
    editorView.value = null;
  }

  const extensions = [
    basicSetup,
    EditorState.readOnly.of(true),
  ];

  const safeLang = getSafeLanguage(props.language, props.value);
  if (safeLang) {
    extensions.push(languageConf.of(safeLang));
  } else {
    extensions.push(languageConf.of([]));
  }

  const state = EditorState.create({
    doc: props.value,
    extensions,
  });

  if (codeViewerRef.value) {
    editorView.value = new EditorView({
      state,
      parent: codeViewerRef.value as HTMLElement,
    });
  }
};

onMounted(() => {
  initEditor();
});

watch(
  [() => props.value, () => props.language],
  async () => {
    await nextTick();
    initEditor();
  },
  { flush: 'post' },
);
</script>

<style lang="scss">
.nex-code-viewer {
  overflow-x: auto;
  background: var(--nex-bg-color);

  .cm-gutters {
    background: var(--nex-bg-color);
    border-color: var(--nex-bg-color-light);
  }
}
</style>
