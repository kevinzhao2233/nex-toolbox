<template>
  <button @click="setStorage('key', { a: 1 })">设置</button>
  <button @click="get">获取</button>
  <p>lastSearchTimeStamp：{{ new Date(lastSearchTimeStamp).toLocaleString() }}</p>
  <p>loading：{{ searching }}</p>
  <p>结果：{{ searchResult }}</p>
</template>

<script lang="ts" setup>
import { getStorage, setStorage } from '@nex-toolbox/storage';
import { delay } from '@nex-toolbox/functions';
import { useSearch } from '@nex-toolbox/composables';

const getData = async () => {
  await delay(1000)
  return { a: Date.now() }
}

const params = {
  a: 1
}

const { searchResult, searching, lastSearchTimeStamp } = useSearch(getData, params, {  })

const get = async () => {
  await delay(2000)
  const val = getStorage('key')
  console.log(val)
}
</script>
