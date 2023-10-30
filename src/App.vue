<script setup lang="ts">
import { useQueryProvider } from 'vue-query'
import Web3 from 'web3'
import useHdStore from './stores/hdStore'

useQueryProvider()
const store = useHdStore()
const { hdStore } = storeToRefs(store)
const router = useRouter()

onBeforeMount(() => {
  const web3 = new Web3(import.meta.env.VITE_PROVIDER)
  provide('web3', web3)
  store.getHdStore().then(async () => {
    if (!hdStore.value.password || !hdStore.value.keystores.length) {
      router.push({
        path: '/signin',
      })
    }
    else {
      await store.init()
      web3.eth.getBlockNumber().then(async (latest) => {
        const res = await web3.eth.getBlock(latest)
        /* eslint-disable no-console */
        console.log('🚀 ~ file: App.vue:25 ~ web3.eth.getBlockNumber ~ res:', res.transactions)
        const transactionHash = res.transactions[0] as string
        const transtion = await web3.eth.getTransaction(transactionHash)
        console.log('🚀 ~ file: App.vue:26 ~ web3.eth.getBlockNumber ~ transtion:', transtion)
      })
    }
  })
})
</script>

<template>
  <VHeader />
  <router-view class="flex-1 overflow-y-auto" />
</template>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
