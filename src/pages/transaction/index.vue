<script setup lang="ts">
import type Web3 from 'web3'
import useHdStore from '@/stores/hdStore'
import { useExecute } from '@/shared/hooks'

const router = useRouter()

const store = useHdStore()
const { currentAccount } = storeToRefs(store)

const web3 = inject('web3') as Web3

const toAddress = ref('')

const [loadingTx, submitTransaction] = useExecute(transaction)
async function transaction(toAddress: string) {
  const fromAddress = currentAccount.value?.address
  if (!fromAddress)
    return

  const nonce = await web3.eth.getTransactionCount(fromAddress)
  const gasPrice = await web3.eth.getGasPrice()
  const value = web3.utils.toWei('0.000001', 'ether')

  const rawTx = {
    from: fromAddress,
    to: toAddress,
    nonce,
    gasPrice,
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
    <p class="relative text-center text-lg">
      发送到
    </p>
    <div class="relative">
      <van-field v-model="toAddress" placeholder="搜索、公共地址 (0x) 或 ENS" />
      <div class="i-tabler-scan text-2xl absolute top-1/2 -translate-y-1/2 right-6 bg-blue" />
    </div>
    <div class="absolute w-full bottom-4 px-4 left-0 box-border">
      <van-button class="btn w-full" :loading="loadingTx" @click="submitTransaction(toAddress)">
        确定
      </van-button>
      <van-button
        class="btn-transparent w-full !mt-4"
        @click="() => router.back()"
      >
        取消
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.van-field) {
  background-color: transparent;

  .van-field__control {
    color: white;
  }
}
</style>
