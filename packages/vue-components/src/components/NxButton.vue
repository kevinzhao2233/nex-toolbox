<template>
  <button
    class="nx-button"
    :class="`nx-button--${type}`"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'primary' | 'default';
    disabled?: boolean;
  }>(),
  {
    type: 'default',
    disabled: false,
  },
);
</script>

<style scoped>
.nx-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.nx-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.nx-button--primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

.nx-button--primary:hover:not(:disabled) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.nx-button--default {
  color: #606266;
  background-color: #fff;
  border-color: #dcdfe6;
}

.nx-button--default:hover:not(:disabled) {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
</style>
