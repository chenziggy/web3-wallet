<template>
  <header class="bg-v-black h-12 shadow-lg shadow-zinc-900 flex items-center justify-between index-10">
    <div class="bg-v-black h-6 w-12 mx-3 rounded-3"></div>
    <div>{{ userName }}
      <div class="i-tabler-chevron-down"></div>
    </div>
    <div class="i-tabler-dots-vertical mx-3 my-1" @click="() => { console.log('click')}"></div>
  </header>
</template>

<script setup lang="ts">
const userName = ref('账号')
</script>

<style scoped>

</style>