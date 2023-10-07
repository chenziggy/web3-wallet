<script lang="ts">
export default {
  name: 'VTransaction',
}
</script>

<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div class="max-w-[408px] mx-auto bg-v-black ">
    <p class="relative text-center text-lg">
      发送到
      <span
        class="text-xs text-blue absolute right-6 vertical-middle top-1/2 -translate-y-1/2"
        @click="() => router.back()"
      >取消</span>
    </p>
    <div class="relative">
      <van-field placeholder="搜索、公共地址 (0x) 或 ENS" />
      <div class="i-tabler-scan text-2xl absolute top-1/2 -translate-y-1/2 right-6 bg-blue" />
    </div>
    <ul>
      <p />
      <li />
    </ul>
  </div>
</template>

<style scoped lang="scss">
:deep(.van-field) {
  background-color: transparent;

  .van-field__control {
    color: white;
  }
}
</style>
