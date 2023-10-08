<script setup lang="ts">
import type Web3 from 'web3'
import { useQuery, useQueryClient } from 'vue-query'
import useHdStore from '@/stores/hdStore'
import { useExecute } from '@/shared/hooks'
import type { toVWallet } from '@/types/common'

const router = useRouter()

const store = useHdStore()
const { currentAccount, wallets } = storeToRefs(store)

const toAccount = ref<toVWallet>({ address: '', username: '' })

const filterWallets = computed(() => {
  return wallets.value.filter(wallet => wallet.address !== currentAccount.value.address)
})

const showTransaction = ref(false)

function handleAccount(wallet: toVWallet) {
  Object.assign(toAccount.value, wallet)
  showTransaction.value = true
}

const web3 = inject('web3') as Web3

const toAddress = ref('')

function useTotalQuery() {
  return useQuery('total', fetchTotal)
}

const queryClient = useQueryClient()

const { data: total } = useTotalQuery()

const displayTotal = computed(() => {
  const to = total.value
  return to ? Number.parseFloat(to).toFixed(6) : 0
})

watch(() => currentAccount.value.address, () => {
  queryClient.invalidateQueries({ queryKey: ['total'] })
})

async function fetchTotal() {
  const address = currentAccount.value?.address
  if (!address)
    return 0

  const balance = await web3.eth.getBalance(address)
  web3.eth.getPastLogs({
    fromBlock: '0x0',
    toBlock: 'latest',
    address: currentAccount.value.address,
  })
  // .then(console.log)
    .catch(console.error)
  return web3.utils.fromWei(balance, 'ether')
}

const transferAmount = ref()

const gasPrice = ref()
const disPlayGasPrice = ref()
async function getGasPrice() {
  const gas = await web3.eth.getGasPrice()
  gasPrice.value = gas
  disPlayGasPrice.value = web3.utils.fromWei(gas, 'ether')
}
getGasPrice()

const [loadingTx, submitTransaction] = useExecute(transaction)
async function transaction(toAddress: string) {
  const fromAddress = currentAccount.value?.address
  if (!fromAddress)
    return

  const nonce = await web3.eth.getTransactionCount(fromAddress)
  const value = web3.utils.toWei(transferAmount.value, 'ether')

  const rawTx = {
    from: fromAddress,
    to: toAddress,
    nonce,
    gasPrice: gasPrice.value,
    value,
    data: '0x0000',
    gas: BigInt(0),
  }

  const gas = await web3.eth.estimateGas(rawTx)
  rawTx.gas = gas

  const signedTx = await web3.eth.accounts.signTransaction(rawTx, currentAccount.value.privateKey)

  const trans = web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  trans.on('transactionHash', (txid) => {
    /* eslint-disable no-console */
    console.log(`https://goerli.etherscan.io/tx/${txid}`)
    router.go(-1)
  })
}
</script>

<script lang="ts">
export default {
  name: 'VTransaction',
}
</script>

<template>
  <div class="relative bg-v-black w-full h-full p-4 box-border">
    <template v-if="!showTransaction">
      <p class="relative text-center text-lg">
        发送到
      </p>
      <div class="relative">
        <van-field v-model="toAddress" placeholder="搜索、公共地址 (0x) 或 ENS" />
        <div class="i-tabler-scan text-2xl absolute top-1/2 -translate-y-1/2 right-6 bg-blue" />
      </div>
      <ul class="mt-4 h-[300px] overflow-auto">
        <AccountItem
          v-for="wallet of filterWallets" :key="wallet.address" :address="wallet.address"
          :username="wallet.username" @click="handleAccount(wallet)"
        />
      </ul>
    </template>
    <template v-else>
      <p class="relative text-center text-lg">
        发送
      </p>
      <van-field v-model="toAccount.address" class="!mx-auto" label-align="top" right-icon="cross" :label="toAccount.username" disabled clearable @click-right-icon="() => showTransaction = false" />
      <div class="mt-10 mb-6 flex justify-between">
        <span>资产：{{ currentAccount.username }}</span>
        <span>余额： {{ displayTotal }} GoerliETH </span>
      </div>
      <div class="flex justify-between items-center">
        <span>数额：</span>
        <div class="flex items-center">
          <van-field v-model.number="transferAmount" input-align="right" type="number" /> GoerliETH
        </div>
      </div>
      <div class="my-6 flex justify-between">
        <span>燃料 <span class="opacity-50">（估算）</span></span>
        <span class="">{{ disPlayGasPrice }} GoerliETH</span>
      </div>
      <div class="absolute w-full bottom-4 px-4 left-0 box-border">
        <van-button class="btn w-full" :loading="loadingTx" @click="submitTransaction(toAccount.address)">
          确定
        </van-button>
        <van-button class="btn-transparent w-full !mt-4" @click="() => router.back()">
          取消
        </van-button>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
:deep(.van-field) {
  background-color: transparent;

  .van-field__control {
    color: white;
  }

  .van-field__label {
    color: #1098fc;
    font-size: 18px;
  }
}
</style>
