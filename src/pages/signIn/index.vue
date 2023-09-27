<template>
  <div class="flex flex-col items-center px-4 relative h-full">
    <p class="text-red text-sm text-center mt-10">
      <span class="i-tabler-alert-triangle"></span>请妥善保存助记词，不要将助记词分享给他人，我们不会以任何理由要求您提供助记词
    </p>
    <p class="text-xl text-center mb-1">{{ mnemonic }}
    </p>
    <div class="i-tabler-copy text-lg mb-4" @click="copyMnemonic"></div>

    <van-field v-model="mnemonicInput" type="textarea" rows="2" class="!w-full">
    </van-field >
    <div class="w-full absolute bottom-5 px-4 box-border">
      <van-button size="large" class="!mt-4"  type="primary" @click="submit">确认</van-button>
      <van-button class="!mt-4" size="large" @click="cancel">取消</van-button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SignIn'
}
</script>

<script setup lang="ts">
import { generateMnemonic } from 'bip39'
import { showToast } from 'vant'

const mnemonic = ref('')
const mnemonicInput = ref('')
function generate() {
  mnemonic.value = generateMnemonic()
}
generate()

const { copy } = useClipboard({source: mnemonic, legacy: true})

function copyMnemonic() {
  return copy(mnemonic.value).then(() => {
    showToast({
      message: '已复制',
      position: 'top'
    })
  })
}

function submit() {
  if (mnemonic.value === mnemonicInput.value) {
    
  }
}

const router = useRouter()
function cancel () {
  router.go(-1)
}

</script>

<style scoped>

</style>