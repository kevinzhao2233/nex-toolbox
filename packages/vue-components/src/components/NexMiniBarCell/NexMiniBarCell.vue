<template>
  <slot
    v-if="loading"
    name="loading"
  >
    <div class="nex-mini-bar-cell__loading" />
  </slot>
  <div
    v-else
    class="nex-mini-bar-cell"
  >
    <div class="info">
      <div class="value">
        <span class="thin">{{ name }}<span v-if="unit">({{ unit }})</span>:</span> {{ value }} / {{ total }}
      </div>
      <div class="percent">
        {{ percent }}<span class="unit">%</span>
      </div>
    </div>
    <div class="bar-box">
      <div
        class="bar"
        :style="{ width: `${Math.min(Math.max(percent, 0), 100)}%` }"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';

interface IProps {
  percent?: number;
  name: string;
  total?: number;
  value?: number;
  unit?: string;
  loading?: boolean;
}
const { percent = 0, name, value = 0, total = 0, unit = '', loading = false } = defineProps<IProps>();
</script>

<style lang="scss" scoped>
.nex-mini-bar-cell {
  width: 100%;

  &__loading {
    width: 100%;
    height: 36px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 37%, #ffffff 63%);
    background-size: 400% 100%;
    animation: nex-skeleton-loading 1.4s ease infinite;
    border-radius: var(--nex-border-radius-base);
  }

  .info {
    display: flex;
    align-items: end;
    justify-content: space-between;
    margin-bottom: 1px;
    font-size: 13px;
    font-weight: 500;

    .value {
      .thin {
        font-size: var(--nex-font-size-small);
        font-weight: 400;
        color: var(--nex-secondary-color);
      }
    }

    .percent {
      font-weight: bold;

      .unit {
        font-size: var(--nex-font-size-small);
        font-weight: 400;
        color: var(--nex-secondary-color);
      }
    }
  }

  .bar-box {
    width: 100%;
    height: 4px;
    background: #e6e8ef;
    border-radius: var(--nex-border-radius-base);

    .bar {
      height: 100%;
      background: var(--nex-primary-color);
      border-radius: var(--nex-border-radius-base);
    }
  }
}
</style>

<style>
@keyframes nex-skeleton-loading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
