<template>
  <div class="nex-form-step">
    <div
      v-for="(step, idx) in steps"
      :key="idx"
      class="nex-form-step__item"
      :class="getStatus(idx).status"
      @click="emits('on-change', idx)"
    >
      <div class="nex-form-step__top">
        <div class="nex-form-step__title">
          <div class="nex-form-step__index">
            {{ idx + 1 }}
          </div>
          <span>{{ step.title }}</span>
        </div>
      </div>
      <div class="nex-form-step__desc">
        {{ step.description }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { StepItem, StepOptions } from './types';

interface IProps {
  steps: StepItem[];
  options?: StepOptions;
  current?: number;
}
const { steps, current = 0, options = {
  finishedText: '已填写',
  inProgressText: '填写中',
  waitingText: '未填写',
} } = defineProps<IProps>();

interface IEmits {
  (e: 'on-change', current: number): void;
}
const emits = defineEmits<IEmits>();

const getStatus = (stepIndex: number) => {
  if (stepIndex < current) {
    return {
      status: 'finished',
      text: options.finishedText,
    };
  } else if (stepIndex === current) {
    return {
      status: 'inProgress',
      text: options.inProgressText,
    };
  } else {
    return {
      status: 'waiting',
      text: options.waitingText,
    };
  }
};
</script>

<style lang="scss" scoped>
.nex-form-step {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;

  &__item {
    flex: 1;
    padding: 12px;
    cursor: pointer;
    background: var(--nex-subtle-bg-color);
    border-radius: 10px;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 4px;
  }

  &__title {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__index {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    font-weight: 600;
    background: var(--nex-success-color);
    border-radius: 8px;
  }

  &__title > span {
    font-size: 16px;
    font-weight: 500;
  }

  &__desc {
    padding-left: 38px;
    font-size: 14px;
    color: #999999;
  }

  &__item.finished {
    background: var(--nex-subtle-bg-color);

    .nex-form-step__index {
      background: #ffffff;
    }

    .nex-form-step__status-text {
      color: var(--nex-success-color);
    }
  }

  &__item.inProgress {
    background: #eeeafc;

    .nex-form-step__index {
      color: #ffffff;
      background: var(--nex-primary-color);
    }

    .nex-form-step__title > span {
      color: var(--nex-primary-color);
    }
  }

  &__item.waiting {
    background: var(--nex-subtle-bg-color);

    .nex-form-step__index {
      background: #d9d9d9;
    }
  }
}
</style>
