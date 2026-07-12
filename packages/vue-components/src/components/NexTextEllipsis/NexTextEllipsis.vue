<template>
  <div>
    <a-tooltip
      v-if="isOverflow"
      :title="text"
      :overlay-style="{ minWidth: `${tooltipWidth}px` }"
      :overlay-inner-style="{ minWidth: `${tooltipWidth}px` }"
    >
      <div
        ref="textRef"
        :style="ellipsisStyle"
        class="ellipsis-text"
        :class="overlayInnerClass"
      >
        {{ text }}
      </div>
    </a-tooltip>
    <div
      v-else
      ref="textRef"
      :style="ellipsisStyle"
      class="ellipsis-text"
      :class="overlayInnerClass"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { Tooltip as ATooltip } from 'ant-design-vue';


interface Props {
  text: string;
  rows?: number;
  tooltipWidth?: number;
  overlayInnerClass?: string;
  overlayInnerStyle?: Record<string, string>;
}

const { text, rows = 2, tooltipWidth = 200, overlayInnerClass = '', overlayInnerStyle = {} } = defineProps<Props>();

const textRef = ref<HTMLElement | null>(null);
const isOverflow = ref(false);

const ellipsisStyle = computed(() => ({
  WebkitLineClamp: rows,
  ...overlayInnerStyle,
}));

const checkOverflow = () => {
  const el = textRef.value;
  if (!el) return;
  isOverflow.value = el.scrollHeight > el.offsetHeight + 1;
};

onMounted(() => {
  nextTick(checkOverflow);
});

watch(() => text, () => {
  nextTick(checkOverflow);
});

watch(() => rows, () => {
  nextTick(checkOverflow);
});

useEventListener('resize', () => {
  nextTick(checkOverflow);
});
</script>

<style scoped>
.ellipsis-text {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
}
</style>
