<script setup lang="ts">
import { useQueryProvider} from 'vue-query'
import useHdStore from './stores/hdStore';

useQueryProvider()
const store = useHdStore()
const { hdStore, wallets } = storeToRefs(store)
const router = useRouter()

onMounted(() => {
  store.getHdStore().then(async () => {
  if (!hdStore.value.password || !hdStore.value.keystores.length) {
    router.push({
      path: '/signin'
    })
  } else {
    await store.getWallets()
    console.log('wallets', wallets.value)
  }
})
})

</script>

<template>
  <VHeader></VHeader>
  <router-view class="flex-1 overflow-y-auto"></router-view>
</template>


<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>