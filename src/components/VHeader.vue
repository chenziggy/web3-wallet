<template>
  <header class="bg-v-black h-12 shadow-lg shadow-zinc-900 flex items-center justify-between index-10">
    <div class="bg-v-black h-6 w-12 mx-3 rounded-3"></div>
    <div class="hover:bg-black/[.1] rounded-3 py-2 px-4" v-if="username" @click="show = true">
      {{ username }}
      <div class="i-tabler-chevron-down"></div>
    </div>
    <div class="i-tabler-dots-vertical mx-3 my-1" @click="() => { console.log('click')}"></div>
   <AcountList v-model="show"></AcountList>
  </header>
</template>

<script setup lang="ts">
import useHdStore from '@/stores/hdStore';

const store = useHdStore()

const { currentAccount} = storeToRefs(store)

const username = computed(() => {
  return currentAccount.value?.username
})

const show = ref(false)

</script>

<style scoped>
:deep(.van-field__left-icon) {
    color: white;
}
:deep(.van-field__control) {
  color: white;
}
</style>