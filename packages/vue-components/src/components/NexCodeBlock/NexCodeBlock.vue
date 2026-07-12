<template>
  <div
    class="nex-code-block"
    :class="wrap ? 'wrap' : ''"
  >
    <pre><code>{{ code }}</code></pre>
    <div
      class="icon"
      @click="copy(code)"
    >
      <a-button
        v-show="!copied"
        :icon="h(Copy)"
        @click="copy(code)"
      />
      <span v-show="copied">已复制</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { h } from 'vue';
import { Button as AButton } from 'ant-design-vue';
import { Copy } from '@icon-park/vue-next';
import { useClipboard } from '@vueuse/core';

interface IProps {
  code: string;
  language?: string;
  wrap?: boolean;
}
const { code, language = 'bash' } = defineProps<IProps>();

const { copied, copy } = useClipboard({ legacy: true });

</script>

<style lang="scss" scoped>
.nex-code-block {
  position: relative;
  padding: 14px 12px;
  background: var(--nex-bg-color-light);
  border-radius: var(--nex-border-radius-large);

  .icon {
    position: absolute;
    top: 16px;
    right: 20px;
    display: none;
    min-height: 32px;
    background: var(--nex-bg-color);
    border-radius: var(--nex-border-radius-large);
  }

  &:hover {
    .icon {
      display: block;
    }
  }

  :deep(pre) {
    min-height: 36px;
    padding: 4px 12px;
    margin: 0;
    overflow-x: auto;
    background: var(--nex-bg-color);
    border-radius: 6px;
  }

  &.wrap {
    :deep(pre) {
      white-space: pre-wrap;
    }
  }
}
</style>
