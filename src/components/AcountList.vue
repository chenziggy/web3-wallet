<template>
   <van-overlay :show="modelValue" @click="handleClose">
      <div class="relative bg-VBlack w-5/6 mx-auto mt-1/8 rounded overflow-auto box-border" @click.stop>
        <div class="flex justify-between items-center h-12">
          <div>
           <span class="i-tabler-chevron-left text-2xl px-2" v-show="title!=TitleType.List" @click="title=TitleType.List"></span>
          </div>
          <p class="text-center my-4 font-bold">{{ title }}</p>
          <div class="i-tabler-x text-2xl px-2" @click="handleClose"></div>
        </div>
        <template v-if="title===TitleType.List">
          <div class="p-2">
            <van-field class="!w-full !box-border !mx-0 !bg-transparent !rounded !p-1.5" left-icon="search" v-model=queryUsername placeholder="搜索账户">
              <div class="i-tabler-search"></div>
            </van-field>
          </div>
          <ul class="mt-4 h-[300px] overflow-auto" >
            <li class="py-0.5 px-5 relative cursor-default"  v-for="wallet of filterWallets" :key="wallet.address" :class="{'bg-blue/[.2]': currentAccount.address === wallet.address}" @click="handleChange(wallet.address)">
              <p class="mb-1 font-bold">{{ wallet.username }}</p>
              <p class="mt-1 overflow-hidden text-ellipsis text-sm text-[#bbb]">
                <span>{{ wallet.address }}</span>
              </p>
              <div class="absolute top-1/2 left-1 -translate-y-1/2 bg-blue rounded h-9/10 w-1" v-if="currentAccount.address === wallet.address"></div>
            </li>
          </ul>
          <div class="text-blue font-bold my-2 px-2">
            <div class="py-3 flex items-center" @click="ChangeView(TitleType.Add)" >
              <span class="i-tabler-plus text-lg"></span>
              <span class="cursor-pointer">Add account</span>
            </div>
          </div>
        </template>
        <template v-if="title===TitleType.Add">
          <div class="px-4 py-2">
            <p>账户名称</p>
            <van-field class="!w-full !box-border !mx-0 !bg-transparent !rounded !p-1.5" v-model="username" placeholder="账户">
            </van-field>
            <p  class="text-xs color-red h-4">必填</p>
          </div>
          <div class="flex justify-between px-4 mb-4">
            <van-button class="basis-[49%] btn-transparent" @click="ChangeView(TitleType.List)">取消</van-button>
            <van-button class="basis-[49%] btn" @click="submitCreate" :loading="loadingCreate">创建</van-button>
          </div>
        </template>
      </div>
    </van-overlay>
</template>

<script setup lang="ts">
import useHdStore from '@/stores/hdStore';
import { mnemonicToSeedSync } from 'bip39'
import { hdkey } from '@ethereumjs/wallet'
import { useExecute } from '@/shared/hooks'

enum TitleType {
  List='选择一个账号',
  Add='Add account'
}

defineProps<{
  modelValue: boolean
}>()


const emit = defineEmits(['update:modelValue'])

const store = useHdStore()


function handleClose() {
  emit('update:modelValue', false)
}

function handleChange(address: string) {
  store.changeCurrentAccount(address)
}

const {  wallets, currentAccount } = storeToRefs(store)

const queryUsername = ref('')

const filterWallets = computed(() => {
  return wallets.value.filter(item => item.username.includes(queryUsername.value))
})

const title = ref(TitleType.List)

function ChangeView(val: TitleType) {
  title.value = val
}

const username = ref('')

const { hdStore } = storeToRefs(store)

const [loadingCreate, submitCreate ] = useExecute(createWallet)

async function createWallet() {
  if (!username.value) {
    return
  }
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
  ChangeView(TitleType.List)
}


</script>

<style scoped>

</style>