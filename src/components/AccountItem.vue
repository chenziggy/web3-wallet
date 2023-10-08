<script setup lang="ts">
defineProps({
  address: String,
  username: String,
  select: Boolean,
})
</script>

<script lang="ts">
export default {
  name: 'AccountItem',
}
</script>

<template>
  <li
    class="flex flex-row box-border py-0.5 px-2 relative cursor-default hidden"
    :class="{ 'bg-blue/[.2]': select }"
  >
    <div class="i-tabler-user shrink-0 text-4xl relative top-4" />
    <div class="grow-1 overflow-hidden">
      <p class="mb-1 font-bold">
        {{ username }}
      </p>
      <p class="mt-1 overflow-hidden text-ellipsis text-sm text-[#bbb]">
        <span>{{ address }}</span>
      </p>
    </div>
    <div
      v-if="select"
      class="absolute top-1/2 left-1 -translate-y-1/2 bg-blue rounded h-9/10 w-1"
    />
  </li>
</template>

<style scoped>

</style>
