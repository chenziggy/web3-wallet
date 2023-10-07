<script setup lang="ts">
import { mnemonicToSeedSync } from 'bip39'
import { Wallet, hdkey } from '@ethereumjs/wallet'
import useHdStore from '@/stores/hdStore'
import { useExecute } from '@/shared/hooks'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

enum Title {
  List = '选择一个账号',
  Add = 'Add account',
  Import = '导入账户',
}

const store = useHdStore()

function handleClose() {
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (val) => {
  if (!val) {
    setTimeout(() => {
      changeView(Title.List)
    }, 400)
  }
})

async function handleChange(address: string) {
  await store.changeCurrentAccount(address)
  emit('update:modelValue', false)
}

const { wallets, currentAccount } = storeToRefs(store)

const queryUsername = ref('')

const filterWallets = computed(() => {
  return wallets.value.filter(item => item.username.includes(queryUsername.value))
})

const title = ref(Title.List)

function changeView(val: Title) {
  title.value = val
}

const username = ref('')

const { hdStore } = storeToRefs(store)

const [loadingCreate, submitCreate] = useExecute(createWallet)

async function createWallet() {
  if (!username.value)
    return

  // 生成秘钥对 keyPair
  const seed = mnemonicToSeedSync(hdStore.value.mnemonic)
  const hdWallet = hdkey.EthereumHDKey.fromMasterSeed(seed)
  const index_address = hdStore.value.keystores.length ?? 0
  const keyPair = hdWallet.derivePath(`m/44'/60'/0'/0'/${index_address}`)

  // 获取钱包
  const wallet = keyPair.getWallet()
  // 获取地址
  const keystore = await wallet.toV3String(hdStore.value.password)
  await store.addKeyStore(keystore)
  await store.addUsernameList(username.value)
  await store.getWallets()
  changeView(Title.List)
}

// 导入
const privateKey = ref('')
const privateKeyWarn = ref(false)

watch(privateKey, () => {
  privateKeyWarn.value = !privateKey.value
})

const [loadingImport, submitImport] = useExecute(importAccount)

async function importAccount(privateKey: string) {
  if (!privateKey)
    return

  const buffer = Buffer.from(privateKey, 'hex')
  const wallet = Wallet.fromPrivateKey(buffer)
  const keystore = await wallet.toV3String(hdStore.value.password)
  await store.addKeyStore(keystore)
  await store.getWallets()
  changeView(Title.List)
}
</script>

<template>
  <van-overlay :show="modelValue" @click="handleClose">
    <div class="relative bg-VBlack w-5/6 mx-auto mt-1/8 rounded overflow-auto box-border" @click.stop>
      <div class="flex justify-between items-center h-12">
        <div>
          <span v-show="title !== Title.List" class="i-tabler-chevron-left text-2xl px-2" @click="title = Title.List" />
        </div>
        <p class="text-center my-4 font-bold">
          {{ title }}
        </p>
        <div class="i-tabler-x text-2xl px-2" @click="handleClose" />
      </div>
      <template v-if="title === Title.List">
        <div class="p-2">
          <van-field
            v-model="queryUsername" class="!w-full !box-border !mx-0 !bg-transparent !rounded !p-1.5"
            left-icon="search" placeholder="搜索账户"
          >
            <div class="i-tabler-search" />
          </van-field>
        </div>
        <ul class="mt-4 h-[300px] overflow-auto">
          <li
            v-for="wallet of filterWallets" :key="wallet.address" class="flex flex-row box-border py-0.5 px-2 relative cursor-default hidden"
            :class="{ 'bg-blue/[.2]': currentAccount.address === wallet.address }" @click="handleChange(wallet.address)"
          >
            <div class="i-tabler-user shrink-0 text-4xl relative top-4" />
            <div class="grow-1 overflow-hidden">
              <p class="mb-1 font-bold">
                {{ wallet.username }}
              </p>
              <p class="mt-1 overflow-hidden text-ellipsis text-sm text-[#bbb]">
                <span>{{ wallet.address }}</span>
              </p>
            </div>
            <div
              v-if="currentAccount.address === wallet.address"
              class="absolute top-1/2 left-1 -translate-y-1/2 bg-blue rounded h-9/10 w-1"
            />
          </li>
        </ul>
        <div class="text-blue font-bold my-2 px-2">
          <div class="group/add py-3 flex items-center" @click="changeView(Title.Add)">
            <span class="i-tabler-plus text-lg" />
            <span class="cursor-pointer group-hover/add:underline underline-offset-4">Add account</span>
          </div>
          <div class="group/import py-3 flex items-center" @click="changeView(Title.Import)">
            <span class="i-tabler-download text-lg" />
            <span class="cursor-pointer group-hover/import:underline underline-offset-4">导入账户</span>
          </div>
        </div>
      </template>
      <template v-if="title === Title.Add">
        <div class="px-4 py-2">
          <p>账户名称</p>
          <van-field v-model="username" class="input" placeholder="账户" />
          <p class="text-xs color-red h-4">
            必填
          </p>
        </div>
        <div class="flex justify-between px-4 mb-4">
          <van-button class="basis-[49%] btn-transparent" @click="changeView(Title.List)">
            取消
          </van-button>
          <van-button class="basis-[49%] btn" :loading="loadingCreate" @click="submitCreate">
            创建
          </van-button>
        </div>
      </template>
      <template v-if="title === Title.Import">
        <p class="px-4">
          导入的账户不会与最初创建的账号助记词相关联
        </p>
        <span class="px-4">请粘贴您的私钥：</span>
        <div class="px-4 py-2">
          <van-field v-model="privateKey" class="input" type="textarea" :class="{ '!border-red': privateKeyWarn }" />
        </div>
        <div class="flex justify-between mt-4 mb-6 px-4">
          <van-button class="basis-[49%] btn-transparent" @click="changeView(Title.List)">
            取消
          </van-button>
          <van-button class="basis-[49%] btn" :loading="loadingImport" @click="submitImport(privateKey)">
            导入
          </van-button>
        </div>
      </template>
    </div>
  </van-overlay>
</template>

<style scoped></style>
