<script setup lang="ts">
import { useQueryProvider} from 'vue-query'
import useHdStore from './stores/hdStore';

useQueryProvider()
const {getHdStore} = useHdStore()
getHdStore()

</script>

<template>
  <VHeader></VHeader>
  <router-view class="flex-1 overflow-y-auto"></router-view>
</template>


<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>