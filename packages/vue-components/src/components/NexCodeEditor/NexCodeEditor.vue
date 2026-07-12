<template>
  <div
    ref="codeViewerRef"
    class="nex-code-editor"
  />
</template>
<script setup lang="ts">
import {
  onMounted, computed, shallowRef, watch,
  useTemplateRef,
} from 'vue';
import { basicSetup } from 'codemirror';
import {
  Compartment, EditorState, Extension, Transaction,
} from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { LanguageSupport, StreamLanguage, StreamParser } from '@codemirror/language';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { xml } from '@codemirror/lang-xml';
import { yaml } from '@codemirror/lang-yaml';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { linterMap } from './lint';

interface P {
  language?: string;
  value?: string;
  readonly?: boolean;
  lineWrapping?: boolean;
}

interface E {
  (e: 'update:value', code: string): void;
  (e: 'on-change', code: string): void;
}

const {
  language = 'json', value = '', readonly = false, lineWrapping = false,
} = defineProps<P>();

const emits = defineEmits<E>();

const languageMap: Record<string, () => LanguageSupport> = {
  cpp,
  html,
  javascript,
  json,
  python,
  xml,
  yaml,
};

const legacyLanguageMap: Record<string, StreamParser<unknown>> = {
  shell,
};

const codeViewerRef = useTemplateRef('codeViewerRef');

const extensions = computed(() => {
  const languageConf = new Compartment();
  const innerLanguage = languageMap[language] ? languageConf.of(languageMap[language]()) : undefined;
  const legacyLanguage = legacyLanguageMap[language] ? StreamLanguage.define(legacyLanguageMap[language]) : undefined;

  const lintExtensions = linterMap[language]?.() ?? [];

  return [
    basicSetup,
    lineWrapping ? EditorView.lineWrapping : undefined,
    readonly ? EditorState.readOnly.of(true) : EditorState.readOnly.of(false),
    innerLanguage || (legacyLanguage || undefined),
    ...lintExtensions,
  ].filter((extension): extension is Extension => !!extension);
});

const editorState = EditorState.create({
  doc: value,
  extensions: extensions.value,
});

const editorView = shallowRef<EditorView | null>(null);

onMounted(() => {
  editorView.value = new EditorView({
    state: editorState,
    parent: codeViewerRef.value as HTMLElement,
    dispatch: (tr: Transaction) => {
      editorView.value?.update([tr]);
      if (tr.changes.empty || !tr.docChanged) {
        return;
      }
      emits('update:value', tr.state.doc.toString() ?? '');
      emits('on-change', tr.state.doc.toString() ?? '');
    },
  });
});

watch(() => value, (newVal) => {
  if (newVal === editorView.value?.state.doc.toString()) return;
  editorView.value?.dispatch({
    changes: { from: 0, to: editorView.value.state.doc.length, insert: newVal },
  });
});

// watch(() => language, (newVal) => {
//   editorView.value?.dispatch({
//     effects: languageConf.reconfigure(languageMap[newVal]()),
//   });
// });

</script>

<style lang="scss">
.nex-code-editor {
  overflow-x: auto;
  background: var(--nex-bg-color);

  .cm-gutters {
    background: var(--nex-bg-color);
    border-color: var(--nex-bg-color-light);
  }
}
</style>
