<script setup lang="ts">
import useHdStore from '@/stores/hdStore'

const store = useHdStore()

const { currentAccount } = storeToRefs(store)

const username = computed(() => {
  return currentAccount.value?.username
})

const show = ref(false)
</script>

<template>
  <header class="bg-v-black h-12 shadow-lg shadow-zinc-900 flex items-center justify-between index-10">
    <div class="bg-v-black h-6 w-12 mx-3 rounded-3" />
    <div v-if="username" class="hover:bg-black/[.1] rounded-3 py-2 px-4" @click="show = true">
      {{ username }}
      <div class="i-tabler-chevron-down" />
    </div>
    <div class="i-tabler-dots-vertical mx-3 my-1" @click="() => { console.log('click') }" />
    <AcountList v-model="show" />
  </header>
</template>

<style scoped>
:deep(.van-field__left-icon) {
    color: white;
}
:deep(.van-field__control) {
  color: white;
}
</style>
