<script setup lang="ts">
import { useQuery, useQueryClient } from 'vue-query'
import { showToast } from 'vant'
import Web3 from 'web3'
import useHdStore from '@/stores/hdStore'
import 'vant/es/toast/style'

const store = useHdStore()
const { currentAccount } = storeToRefs(store)

const displayAddress = computed(() => {
  const val = currentAccount.value?.address
  return val ? `${val.slice(0, 5)}...${val.slice(-3)}` : ''
})

const { copy } = useClipboard({ source: currentAccount.value?.address, legacy: true })

function copyAddress() {
  return copy(currentAccount.value?.address).then(() => {
    showToast({
      message: '已复制',
      position: 'top',
    })
  })
}

const privateKey = ref()
const web3 = new Web3(import.meta.env.VITE_PROVIDER)

async function fetchTotal() {
  const address = currentAccount.value?.address
  if (!address)
    return 0

  const balance = await web3.eth.getBalance(address)
  return web3.utils.fromWei(balance, 'ether')
}

const queryClient = useQueryClient()
watch(currentAccount, (val, oldVal) => {
  if (val.address !== oldVal.address)
    queryClient.invalidateQueries({ queryKey: ['total'] })
})

function useTotalQuery() {
  return useQuery('total', fetchTotal)
}

const { status, data: total, error, isFetching } = useTotalQuery()

const displayTotal = computed(() => {
  const to = total.value
  return to ? Number.parseFloat(to).toFixed(3) : 0
})

const btnList = ref([
  {
    label: '购买',
    iconClass: 'i-tabler-plus',
    disabled: true,
    strategy: 'navTransaction',
  },
  {
    label: '发送',
    iconClass: 'i-tabler-arrow-up-right',
    disabled: false,
    strategy: 'navTransaction',
  },
  {
    label: '交换',
    iconClass: 'i-tabler-arrows-right-left',
    disabled: false,
    strategy: 'navTransaction',
  },
  {
    label: 'Bridge',
    iconClass: 'i-tabler-building-bridge',
    disabled: false,
    strategy: 'navTransaction',
  },
  {
    label: '投资组合',
    iconClass: 'i-tabler-chart-histogram',
    disabled: false,
    strategy: 'navTransaction',
  },
])

const router = useRouter()

function navTransaction() {
  router.push({
    path: '/transaction',
  })
}

const strategies: Record<string, () => void> = {
  navTransaction,
}

function execute(strategy: string) {
  return strategies[strategy]()
}

async function transaction() {
  const address = currentAccount.value?.address
  if (!address)
    return

  const nonce = await web3.eth.getTransactionCount(address)
  const gasPrice = await web3.eth.getGasPrice()
  const value = web3.utils.toWei('0.000001', 'ether')

  const rawTx = {
    from: address,
    to: '0xCBb083ED65B5bBe8F8Db2Ce65195B7775dC328b5',
    nonce,
    gasPrice,
    value,
    data: '0x0000',
    gas: BigInt(0),
  }

  const gas = await web3.eth.estimateGas(rawTx)
  rawTx.gas = gas

  const signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey.value)

  const trans = web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  trans.on('transactionHash', (txid) => {
    /* eslint-disable no-console */
    console.log(`https://goerli.etherscan.io/tx/${txid}`)
  })
}
</script>

<script lang="ts">
export default {
  name: 'VHome',
}
</script>

<template>
  <div class="flex flex-col items-center bg-v-black">
    <div
      class="mx-auto mt-5 bg-blue/[.15] rounded-[16px] py-2 px-3 color-blue text-xs text-center"
      @click="copyAddress"
    >
      <span class="align-middle">{{ displayAddress }}</span>
      <div class="i-tabler-copy text-lg ml-1" />
    </div>
    <p class="mt-4 text-4xl">
      {{ displayTotal }} GoerliETH
    </p>
    <div class="flex justify-evenly w-full">
      <div
        v-for="btn in btnList"
        :key="btn.label"
        class="flex flex-col items-center"
        :class="{ 'cursor-no-drop': btn.disabled, 'opacity-50': btn.disabled }"
      >
        <div
          class="w-12 h-12 rounded-1/2 bg-blue flex justify-center items-center text-2xl"
          @click="() => execute(btn.strategy)"
        >
          <div :class="[btn.iconClass]" />
        </div>
        <div class="mt-2 text-sm">
          {{ btn.label }}
        </div>
      </div>
    </div>
    <p>
      private key: {{ privateKey }}
    </p>
    <p>
      total: {{ total }}
    </p>
    <p>status: {{ status }}</p>
    <p>error: {{ error }}</p>
    <p>isFetching: {{ isFetching }}</p>
    <van-button type="primary" @click="transaction">
      转账
    </van-button>
  </div>
</template>
