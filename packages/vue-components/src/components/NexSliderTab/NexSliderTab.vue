<template>
  <div class="nex-slider-tab">
    <div
      v-for="(item, idx) in tabs"
      :key="item.key"
      class="nex-slider-tab__item"
      :class="{ active: value === item.key }"
      :style="{
        width: 'calc(' + (1 / tabs.length) * 100 + '% - ' + 6 / tabs.length + 'px)',
        transform: 'translateX(' + idx + '00%)',
      }"
      @click="onClickTab(item)"
    >
      {{ item.name }}
      <a-tooltip v-if="item.tooltip">
        <template #title>
          {{ item.tooltip }}
        </template>
        <Help
          size="14"
          class="nex-slider-tab__help"
        />
      </a-tooltip>
    </div>
    <div
      v-show="activeIdx !== -1"
      class="nex-slider-tab__bar"
      :style="{
        width: 'calc(' + (1 / tabs.length) * 100 + '% - ' + 6 / tabs.length + 'px)',
        transform: 'translateX(' + activeIdx + '00%)',
      }"
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Help } from '@icon-park/vue-next';
import type { SliderTabOption } from './types';
import { Tooltip as ATooltip } from 'ant-design-vue';

interface IProps {
  tabs: SliderTabOption[];
  value: string;
}
interface IEmits {
  (e: 'update:value', payload: string): void;
  (e: 'on-change', activeKey: string, tabItem: SliderTabOption): void;
}

const { tabs, value } = defineProps<IProps>();
const emits = defineEmits<IEmits>();

const activeIdx = computed(() => tabs.findIndex((item) => item.key === value));

const onClickTab = (item: SliderTabOption) => {
  emits('update:value', item.key);
  emits('on-change', item.key, item);
};
</script>

<style lang="scss" scoped>
.nex-slider-tab {
  position: relative;
  width: 100%;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  user-select: none;
  background: #ffffff;
  border: 1px solid #dbdbdb;
  border-radius: 25px;

  &__item {
    position: absolute;
    top: 3px;
    left: 3px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100% - 6px);
    cursor: pointer;
    transition: color 0.3s;

    &.active {
      color: #ffffff;

      .nex-slider-tab__help {
        color: #ffffff88;
      }
    }
  }

  &__help {
    flex-shrink: 0;
    margin-left: 4px;
    color: var(--nex-secondary-color);
    cursor: pointer;
  }

  &__bar {
    position: absolute;
    top: 3px;
    left: 3px;
    z-index: 1;
    height: calc(100% - 6px);
    background: var(--nex-primary-color);
    border-radius: 20px;
    opacity: 0.9;
    transition: transform 0.4s cubic-bezier(0.66, 0, 0.01, 1);
  }
}
</style>
