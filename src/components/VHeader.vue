<script setup lang="ts">
import useHdStore from '@/stores/hdStore'

const router = useRouter()
const store = useHdStore()

const { currentAccount } = storeToRefs(store)

const username = computed(() => {
  return currentAccount.value?.username
})

const loadingUsername = ref(false)
watch(username, (val) => {
  loadingUsername.value = !!val
})

const show = ref(false)
</script>

<template>
  <header class="bg-v-black h-12 shadow-lg shadow-zinc-900 flex items-center justify-between index-10">
    <div v-if="router.currentRoute.value.path === '/'" class="bg-v-black h-4 w-4 mx-3 rounded-3" />
    <div v-else class="i-tabler-chevron-left mx-3" @click="router.go(-1)" />
    <div v-if="loadingUsername" class="hover:bg-black/[.1] rounded-3 py-2 px-4" @click="show = true">
      {{ username }}
      <div class="i-tabler-chevron-down" />
    </div>
    <div v-else-if="router.currentRoute.value.path !== '/signin'" class="i-tabler-loader animate-spin text-lg" />
    <div class="i-tabler-dots-vertical mx-3 my-1" @click="() => { console.log('click') }" />
    <AccountList v-model="show" />
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
