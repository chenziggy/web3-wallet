<script setup lang="ts">
import { useQueryProvider } from 'vue-query'
import useHdStore from './stores/hdStore'

useQueryProvider()
const store = useHdStore()
const { hdStore } = storeToRefs(store)
const router = useRouter()

onBeforeMount(() => {
  store.getHdStore().then(async () => {
    if (!hdStore.value.password || !hdStore.value.keystores.length) {
      router.push({
        path: '/signin',
      })
    }
    else {
      await store.init()
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
