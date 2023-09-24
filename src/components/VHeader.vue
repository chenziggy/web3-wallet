<template>
  <header class="h-12 shadow-lg shadow-zinc-900 flex items-center justify-between">
    <left class="bg-black h-6 w-12 mx-3 rounded-3"></left>
    <middle class="">{{ userName }}
      <div class="i-tabler-chevron-down"></div>
    </middle>
    <right class="i-tabler-dots-vertical mx-3 my-1" @click="() => { console.log('click')}"></right>
  </header>
</template>

<script setup lang="ts">
const userName = ref('账号')
</script>

<style scoped>

</style>