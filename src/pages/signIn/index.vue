<script setup lang="ts">
import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import { showFailToast, showToast } from 'vant'
import { hdkey } from '@ethereumjs/wallet'
import { useExecute } from '@/shared/hooks'
import useHdStore from '@/stores/hdStore'

const store = useHdStore()

const { hdStore } = storeToRefs(store)

const password = ref('')
const passwordFlag = ref(false)

const [loadingPassword, submitPassword] = useExecute(handlePassword)

async function handlePassword() {
  if (password.value.length < 6) {
    showFailToast('请输入6位以上的密码')
    return
  }

  await store.setHdStore({
    password: password.value,
  })
  mnemonic.value = generateMnemonic()
  passwordFlag.value = true
}

const mnemonic = ref('')
const mnemonicInput = ref()

const { copy } = useClipboard({ source: mnemonic, legacy: true })
const copyFlag = ref(false)

function copyMnemonic() {
  return copy(mnemonic.value).then(() => {
    copyFlag.value = true
    showToast({
      message: '已复制',
      position: 'top',
    })
  })
}

const [loadingHandleMnemonic, submitMnemonic] = useExecute(handleMnemonic)

async function handleMnemonic() {
  if (mnemonic.value !== mnemonicInput.value) {
    showFailToast({
      message: '助记词填写错误，请检查输入内容',
      position: 'top',
    })
    return
  }
  await store.setHdStore({
    mnemonic: mnemonic.value,
  })
  await createWallet(mnemonic.value)
}

async function createWallet(mnemonic: string) {
  // 生成秘钥对 keyPair
  const seed = mnemonicToSeedSync(mnemonic)
  const hdWallet = hdkey.EthereumHDKey.fromMasterSeed(seed)
  const index_address = hdStore.value.keystores.length ?? 0
  const keyPair = hdWallet.derivePath(`m/44'/60'/0'/0'/${index_address}`)

  // 获取钱包
  const wallet = keyPair.getWallet()
  const address = wallet.getAddressString()
  // 获取地址
  const keystore = await wallet.toV3String(password.value)
  await store.addUsernameMap(address, 'Account1')
  await store.addKeyStore(keystore)
  await store.initCurrentAccount()
  router.push({
    path: '/home',
  })
}

const router = useRouter()
function cancel() {
  router.go(-1)
}
</script>

<script lang="ts">
export default {
  name: 'SignIn',
}
</script>

<template>
  <div class="flex flex-col items-center px-4 relative h-full">
    <template v-if="!passwordFlag">
      <p>请输入密码</p>
      <van-field v-model="password" class="!w-full top-1/3 -translate-y-1/2 relative" />
      <div class="w-full absolute bottom-5 px-4 box-border">
        <van-button size="large" class="!mt-4" type="primary" :loading="loadingPassword" @click="submitPassword">
          确认
        </van-button>
        <van-button class="!mt-4" size="large" @click="cancel">
          取消
        </van-button>
      </div>
    </template>
    <template v-else>
      <p>助记词</p>

      <p class="text-red text-sm text-center mt-10">
        <span class="i-tabler-alert-triangle" />请妥善保存助记词，不要将助记词分享给他人，我们不会以任何理由要求您提供助记词
      </p>
      <p class="text-xl text-center mb-1">
        {{ mnemonic }}
      </p>
      <p class="align-middle mb-4" @click="copyMnemonic">
        <span class="text-sm align-middle">点击复制</span> <span class="i-tabler-copy text-lg align-middle" />
      </p>

      <template v-if="copyFlag">
        <van-field v-model="mnemonicInput" type="textarea" rows="2" class="!w-full" />
        <div class="w-full absolute bottom-5 px-4 box-border">
          <van-button size="large" class="!mt-4" type="primary" :loading="loadingHandleMnemonic" @click="submitMnemonic">
            确认
          </van-button>
          <van-button class="!mt-4" size="large" @click="cancel">
            取消
          </van-button>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped></style>
