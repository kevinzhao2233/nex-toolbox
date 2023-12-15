<template>
  <button @click="setStorage('key', { a: 1 })">设置</button>
  <button @click="get">获取</button>
</template>

<script lang="ts" setup>
import { getStorage, removeStorage, setStorage } from '@nex-toolbox/storage';
import { delay } from '@nex-toolbox/functions';

const get = async () => {
  await delay(2000)
  const val = getStorage('key')
  console.log(val)
}
</script>
