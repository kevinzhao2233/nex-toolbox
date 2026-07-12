<template>
  <div class="app">
    <h1>nex-toolbox 功能测试</h1>

    <section>
      <h2>Storage 测试</h2>

      <div class="card">
        <h3>全局便捷函数</h3>
        <div class="row">
          <input
            v-model="storage.key"
            placeholder="key"
          >
          <input
            v-model="storage.value"
            placeholder="value"
          >
          <input
            v-model.number="storage.expire"
            type="number"
            placeholder="过期秒数(可选)"
          >
          <button @click="handleSetStorage">
            setStorage
          </button>
          <button @click="handleGetStorage">
            getStorage
          </button>
          <button @click="handleRemoveStorage">
            removeStorage
          </button>
        </div>
        <div class="row">
          <button @click="handleClearStorage">
            clearStorage
          </button>
          <button @click="handleClearStorageExclude">
            clearStorageExclude(保留 test_key)
          </button>
          <button @click="handleSetStorageConfig">
            setStorageConfig(prefix='nx_')
          </button>
        </div>
        <div
          v-if="storage.getResult !== undefined"
          class="result"
        >
          getStorage 结果: <code>{{ storage.getResult }}</code>
        </div>
      </div>

      <div class="card">
        <h3>StorageCls 实例</h3>
        <div class="row">
          <label><input
            v-model="clsInstance.driver"
            type="radio"
            value="local"
          > localStorage</label>
          <label><input
            v-model="clsInstance.driver"
            type="radio"
            value="session"
          > sessionStorage</label>
          <input
            v-model="clsInstance.prefix"
            placeholder="prefix"
          >
          <button @click="createInstance">
            创建实例
          </button>
        </div>
        <div class="row">
          <input
            v-model="clsInstance.key"
            placeholder="key"
          >
          <input
            v-model="clsInstance.value"
            placeholder="value"
          >
          <input
            v-model.number="clsInstance.expire"
            type="number"
            placeholder="过期秒数(可选)"
          >
          <button @click="handleClsSet">
            set
          </button>
          <button @click="handleClsGet">
            get
          </button>
          <button @click="handleClsRemove">
            remove
          </button>
          <button @click="handleClsClear">
            clear
          </button>
          <button @click="handleClsConfig">
            config(链式调用)
          </button>
        </div>
        <div
          v-if="clsInstance.getResult !== undefined"
          class="result"
        >
          get 结果: <code>{{ clsInstance.getResult }}</code>
        </div>
      </div>

      <div class="card">
        <h3>加解密测试</h3>
        <div class="row">
          <input
            v-model="crypt.key"
            placeholder="key"
          >
          <input
            v-model="crypt.value"
            placeholder="value"
          >
          <button @click="handleCryptSet">
            加密存储
          </button>
          <button @click="handleCryptGet">
            解密读取
          </button>
        </div>
        <div
          v-if="crypt.rawValue"
          class="result"
        >
          原始存储值: <code>{{ crypt.rawValue }}</code>
        </div>
        <div
          v-if="crypt.getResult !== undefined"
          class="result"
        >
          解密后结果: <code>{{ crypt.getResult }}</code>
        </div>
      </div>

      <div class="card">
        <h3>过期机制测试</h3>
        <div class="row">
          <input
            v-model="expireTest.key"
            placeholder="key"
          >
          <input
            v-model="expireTest.value"
            placeholder="value"
          >
          <input
            v-model.number="expireTest.seconds"
            type="number"
            placeholder="过期秒数"
          >
          <button @click="handleExpireSet">
            设置(2秒过期)
          </button>
          <button @click="handleExpireGet">
            读取
          </button>
        </div>
        <div
          v-if="expireTest.message"
          class="result"
        >
          {{ expireTest.message }}
        </div>
      </div>

      <div class="card">
        <h3>当前 Storage 内容</h3>
        <button @click="refreshStorageView">
          刷新
        </button>
        <div class="storage-dump">
          <div
            v-for="item in storageView"
            :key="item.key"
            class="storage-item"
          >
            <strong>{{ item.key }}</strong>: <code>{{ item.value }}</code>
          </div>
          <div v-if="storageView.length === 0">
            （空）
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2>Functions 测试</h2>

      <div class="card">
        <h3>formatBytes</h3>
        <div class="row">
          <input
            v-model="fb.input"
            placeholder="输入值 (数字或带单位字符串)"
          >
          <input
            v-model.number="fb.decimal"
            type="number"
            placeholder="小数位数(可选)"
          >
          <button @click="handleFormatBytes">
            执行
          </button>
        </div>
        <div
          v-if="fb.result"
          class="result"
        >
          text: <code>{{ fb.result.text }}</code> | value: <code>{{ fb.result.value }}</code> | unit: <code>{{ fb.result.unit }}</code>
        </div>
      </div>

      <div class="card">
        <h3>random</h3>
        <div class="row">
          <input
            v-model.number="rnd.min"
            type="number"
            placeholder="min"
          >
          <input
            v-model.number="rnd.max"
            type="number"
            placeholder="max"
          >
          <label><input
            v-model="rnd.decimal"
            type="checkbox"
          > 返回小数</label>
          <button @click="handleRandom">
            生成
          </button>
        </div>
        <div
          v-if="rnd.result !== undefined"
          class="result"
        >
          结果: <code>{{ rnd.result }}</code>
        </div>
      </div>

      <div class="card">
        <h3>delay</h3>
        <div class="row">
          <input
            v-model.number="dl.ms"
            type="number"
            placeholder="毫秒数"
          >
          <button
            :disabled="dl.running"
            @click="handleDelay"
          >
            {{ dl.running ? '等待中...' : '执行 delay' }}
          </button>
        </div>
        <div
          v-if="dl.message"
          class="result"
        >
          {{ dl.message }}
        </div>
      </div>

      <div class="card">
        <h3>list2Tree</h3>
        <button @click="handleList2Tree">
          转换
        </button>
        <div
          v-if="l2t.input"
          class="result"
        >
          <div>输入 (扁平列表):</div>
          <pre>{{ JSON.stringify(l2t.input, null, 2) }}</pre>
        </div>
        <div
          v-if="l2t.result"
          class="result"
        >
          <div>输出 (树形结构):</div>
          <pre>{{ JSON.stringify(l2t.result, null, 2) }}</pre>
        </div>
      </div>

      <div class="card">
        <h3>tree2List</h3>
        <button @click="handleTree2List">
          转换
        </button>
        <div
          v-if="t2l.input"
          class="result"
        >
          <div>输入 (树形结构):</div>
          <pre>{{ JSON.stringify(t2l.input, null, 2) }}</pre>
        </div>
        <div
          v-if="t2l.result"
          class="result"
        >
          <div>输出 (扁平列表):</div>
          <pre>{{ JSON.stringify(t2l.result, null, 2) }}</pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  clearStorageExclude,
  setStorageConfig,
  StorageCls,
} from '@nex-toolbox/storage'
import { formatBytes, random, delay, list2Tree, tree2List } from '@nex-toolbox/functions'

const storage = reactive({
  key: '',
  value: '',
  expire: undefined as number | undefined,
  getResult: undefined as any,
})

function handleSetStorage() {
  const config = storage.expire ? { expire: storage.expire } : undefined
  setStorage(storage.key, storage.value, config)
  refreshStorageView()
}

function handleGetStorage() {
  storage.getResult = getStorage(storage.key)
}

function handleRemoveStorage() {
  removeStorage(storage.key)
  storage.getResult = undefined
  refreshStorageView()
}

function handleClearStorage() {
  clearStorage()
  storage.getResult = undefined
  refreshStorageView()
}

function handleClearStorageExclude() {
  clearStorageExclude('test_key')
  refreshStorageView()
}

function handleSetStorageConfig() {
  setStorageConfig({ prefix: 'nx_' })
}

const clsInstance = reactive({
  driver: 'local' as 'local' | 'session',
  prefix: '',
  key: '',
  value: '',
  expire: undefined as number | undefined,
  getResult: undefined as any,
})

let storageCls: StorageCls | null = null

function createInstance() {
  const driver = clsInstance.driver === 'local' ? localStorage : sessionStorage
  storageCls = new StorageCls({ driver, prefix: clsInstance.prefix })
}

function handleClsSet() {
  if (!storageCls) { alert('请先创建实例'); return }
  const config = clsInstance.expire ? { expire: clsInstance.expire } : undefined
  storageCls.set(clsInstance.key, clsInstance.value, config)
  refreshStorageView()
}

function handleClsGet() {
  if (!storageCls) { alert('请先创建实例'); return }
  clsInstance.getResult = storageCls.get(clsInstance.key)
}

function handleClsRemove() {
  if (!storageCls) { alert('请先创建实例'); return }
  storageCls.remove(clsInstance.key)
  clsInstance.getResult = undefined
  refreshStorageView()
}

function handleClsClear() {
  if (!storageCls) { alert('请先创建实例'); return }
  storageCls.clear()
  clsInstance.getResult = undefined
  refreshStorageView()
}

function handleClsConfig() {
  if (!storageCls) { alert('请先创建实例'); return }
  storageCls.config({ prefix: 'cfg_' }).set('chain_test', '链式调用成功')
  clsInstance.getResult = storageCls.get('chain_test')
  refreshStorageView()
}

const crypt = reactive({
  key: '',
  value: '',
  rawValue: '',
  getResult: undefined as any,
})

let cryptStorage: StorageCls | null = null

function simpleEncrypt(s: string) {
  return btoa(encodeURIComponent(s))
}

function simpleDecrypt(s: string) {
  return decodeURIComponent(atob(s))
}

function handleCryptSet() {
  cryptStorage = new StorageCls({
    driver: localStorage,
    prefix: 'crypt_',
    encryptFn: simpleEncrypt,
    decryptFn: simpleDecrypt,
  })
  cryptStorage.set(crypt.key, crypt.value)
  const raw = localStorage.getItem('crypt_' + crypt.key)
  crypt.rawValue = raw || ''
  refreshStorageView()
}

function handleCryptGet() {
  if (!cryptStorage) { alert('请先加密存储'); return }
  crypt.getResult = cryptStorage.get(crypt.key)
}

const expireTest = reactive({
  key: 'expire_test',
  value: '我会过期的数据',
  seconds: 2,
  message: '',
})

function handleExpireSet() {
  setStorage(expireTest.key, expireTest.value, { expire: expireTest.seconds })
  expireTest.message = `已设置 ${expireTest.seconds} 秒后过期，请等待后点击读取`
  refreshStorageView()
}

function handleExpireGet() {
  const result = getStorage(expireTest.key)
  if (result === null) {
    expireTest.message = '数据已过期，返回 null'
  } else {
    expireTest.message = `数据未过期: ${JSON.stringify(result)}`
  }
}

const storageView = ref<{ key: string; value: string }[]>([])

function refreshStorageView() {
  const items: { key: string; value: string }[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) items.push({ key, value: localStorage.getItem(key) || '' })
  }
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key) items.push({ key: `[session] ${key}`, value: sessionStorage.getItem(key) || '' })
  }
  storageView.value = items
}

refreshStorageView()

const fb = reactive({
  input: '1024',
  decimal: undefined as number | undefined,
  result: null as { text: string; value: number | string; unit: string } | null,
})

function handleFormatBytes() {
  const input = isNaN(Number(fb.input)) ? fb.input : Number(fb.input)
  fb.result = formatBytes(input as any, fb.decimal)
}

const rnd = reactive({
  min: 1,
  max: 100,
  decimal: false,
  result: undefined as number | undefined,
})

function handleRandom() {
  rnd.result = random(rnd.min, rnd.max, rnd.decimal)
}

const dl = reactive({
  ms: 1000,
  running: false,
  message: '',
})

async function handleDelay() {
  dl.running = true
  dl.message = `开始等待 ${dl.ms}ms...`
  const start = Date.now()
  await delay(dl.ms)
  dl.running = false
  dl.message = `等待完成，实际耗时 ${Date.now() - start}ms`
}

const sampleList = [
  { id: 1, pid: 0, name: '根节点1' },
  { id: 2, pid: 0, name: '根节点2' },
  { id: 3, pid: 1, name: '子节点1-1' },
  { id: 4, pid: 1, name: '子节点1-2' },
  { id: 5, pid: 3, name: '孙节点1-1-1' },
]

const l2t = reactive({
  input: null as any[] | null,
  result: null as any[] | null,
})

function handleList2Tree() {
  l2t.input = JSON.parse(JSON.stringify(sampleList))
  l2t.result = list2Tree(JSON.parse(JSON.stringify(sampleList)))
}

const sampleTree = [
  {
    id: 1, name: '根节点1', children: [
      {
        id: 3, name: '子节点1-1', children: [
          { id: 5, name: '孙节点1-1-1', children: [] },
        ],
      },
      { id: 4, name: '子节点1-2', children: [] },
    ],
  },
  { id: 2, name: '根节点2', children: [] },
]

const t2l = reactive({
  input: null as any[] | null,
  result: null as any[] | null,
})

function handleTree2List() {
  t2l.input = JSON.parse(JSON.stringify(sampleTree))
  t2l.result = tree2List(JSON.parse(JSON.stringify(sampleTree)))
}
</script>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, sans-serif;
}

h1 { margin-bottom: 24px; }
h2 { margin-top: 32px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
h3 { margin: 0 0 8px; font-size: 16px; }

.card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;
}

.row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

input[type="text"],
input[type="number"],
input:not([type]) {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 80px;
}

button {
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
}

button:hover { background: #e8e8e8; }
button:disabled { opacity: 0.5; cursor: not-allowed; }

.result {
  margin-top: 8px;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 4px;
}

code {
  background: #eee;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

pre {
  background: #f4f4f4;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 13px;
  margin: 4px 0;
}

.storage-dump {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 8px;
}

.storage-item {
  padding: 2px 0;
  font-size: 13px;
  word-break: break-all;
}

label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
</style>
