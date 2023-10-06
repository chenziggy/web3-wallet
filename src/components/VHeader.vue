<template>
  <header class="bg-v-black h-12 shadow-lg shadow-zinc-900 flex items-center justify-between index-10">
    <div class="bg-v-black h-6 w-12 mx-3 rounded-3"></div>
    <div v-if="username" @click="show = true">
      {{ username }}
      <div class="i-tabler-chevron-down"></div>
    </div>
    <div class="i-tabler-dots-vertical mx-3 my-1" @click="() => { console.log('click')}"></div>
    <van-overlay :show="show" @click="show = false">
      <div class="relative bg-VBlack w-5/6 mx-auto mt-1/8 rounded overflow-auto px-4 box-border" @click.stop>
        <div class="absolute right-3 top-3 i-tabler-x text-xl" @click="show = false"></div>
        <p class="text-center my-4">选择一个账号</p>
        <van-field class="!w-full !box-border !mx-0 !bg-transparent !rounded !p-1.5" left-icon="search" placeholder="搜索账户">
          <div class="i-tabler-search"></div>
        </van-field>
        <ul v-for="wallet of wallets" :key="wallet.address">
          <li>
            <p class="mb-1">{{ wallet.username }}</p>
            <p class="mt-1 overflow-hidden text-ellipsis text-sm text-[#bbb]">
              <span>{{ wallet.address }}</span>
            </p>
          </li>
        </ul>
      </div>
    </van-overlay>
  </header>
</template>

<script setup lang="ts">
import useHdStore from '@/stores/hdStore';

const store = useHdStore()

const { currentAccount, wallets} = storeToRefs(store)

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