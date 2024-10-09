<template>
  <p>formatBytes('32123123m', 2)：{{ formatBytes('32123123m', 2) }}</p>
  <p>formatBytes('32123123MB', 2)：{{ formatBytes('32123123MB', 2) }}</p>
  <p>formatBytes('32123123MB')：{{ formatBytes('32123123MB') }}</p>
  <p>formatBytes(32123123)：{{ formatBytes('32123123') }}</p>
  <p>formatBytes(-1024, 2)：{{ formatBytes(-1024, 2) }}</p>
</template>

<script lang="ts" setup>
import { formatBytes } from '@nex-toolbox/functions';
</script>
