<template>
  <div class="nex-block-radio">
    <div
      v-for="item in options"
      :key="item.value"
      class="nex-block-radio__item"
      :class="{ 'nex-block-radio__item--active': item.value === value, 'nex-block-radio__item--disabled': item.disabled }"
      @click="!item.disabled && onChange(item.value)"
    >
      <div class="nex-block-radio__top">
        <span class="nex-block-radio__title">{{ item.label }}</span>
        <a-radio
          :checked="item.value === value"
          :disabled="item.disabled"
        />
      </div>
      <div class="nex-block-radio__desc">
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Form, Radio as ARadio } from 'ant-design-vue';

const { value } = defineProps<{
  value: string;
  options: {
    label: string;
    disabled?: boolean;
    description?: string;
    value: string;
  }[];
}>();

const emits = defineEmits<{
  (e: 'update:value', value: string): void;
  (e: 'on-change', value: string): void;
}>();

const formItemContext = Form.useInjectFormItemContext();

const onChange = (val: string) => {
  emits('update:value', val);
  emits('on-change', val);
  formItemContext.onFieldChange();
};
</script>

<style lang="scss" scoped>
.nex-block-radio {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;

  &__item {
    padding: 16px 20px;
    cursor: pointer;
    border: 1px solid var(--nex-border-color-light);
    border-radius: var(--nex-border-radius-round);

    &--active {
      background: var(--nex-primary-color-bg);
      border: 1px solid var(--nex-primary-color);
    }

    &--disabled {
      color: #636a77bb;
      cursor: not-allowed;
      background: var(--nex-disabled-bg-color);
      border: 1px solid var(--nex-border-color-light);

      .nex-block-radio__top {
        cursor: not-allowed;
      }
    }
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: var(--nex-font-size-base);
    font-weight: 500;
  }

  &__desc {
    margin-top: 4px;
    font-size: var(--nex-font-size-small);
    color: #636a77bb;
  }
}
</style>
