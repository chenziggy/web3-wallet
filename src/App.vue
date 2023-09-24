<script setup lang="ts">
import { useQueryProvider} from 'vue-query'

useQueryProvider()

</script>


<template>
  <VHeader></VHeader>
  <router-view></router-view>
</template>
