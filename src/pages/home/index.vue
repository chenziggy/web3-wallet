<template>
  <div class="flex flex-col items-center">
    <p 
    class="mx-auto mt-5 bg-[#4596f5]/[.15] rounded-[16px] py-2 px-3 color-[#4596f5] text-xs text-center"
    >
      <span class="align-middle">{{ displayAddress }}</span> 
      <div class="i-tabler-copy text-lg ml-1"></div>
    </p>
    <p class="mt-1 text-4xl">{{displayTotal}} GoerliETH</p>
    <p>
      private key: {{ privateKey }}

    </p>
    <p>
      total: {{ total }}
    </p>
    <p>status: {{ status }}</p>
    <p>error: {{ error }}</p>
    <p>isFetching: {{ isFetching }}</p>
    <van-button type="primary" @click="transaction">转账</van-button>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from 'vue-query'
import Web3 from 'web3'

const address = ref(import.meta.env.VITE_ADDRESS)
const displayAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 5)}...${address.value.slice(-3)}`
})
const privateKey  = ref(import.meta.env.VITE_PRIVATE_KEY)
const web3 = new Web3(import.meta.env.VITE_PROVIDER)


async function fetechTotal() {
  console.log('fetechTotal')
  const balance = await web3.eth.getBalance(address.value)
  return web3.utils.fromWei(balance, 'ether')
}

function useTotalQuery() {
  return useQuery('total', fetechTotal)
}

const { status, data: total, error, isFetching} = useTotalQuery()

const displayTotal = computed(() => {
  if (!total.value) return 0
  return Number.parseFloat(total.value).toFixed(3)
})





async function transaction() {
  const nonce = await web3.eth.getTransactionCount(address.value)
  const gasPrice = await web3.eth.getGasPrice()
  const value = web3.utils.toWei('0.000001', 'ether')

  const rawTx = {
    from: address.value,
    to: '0xCBb083ED65B5bBe8F8Db2Ce65195B7775dC328b5',
    nonce,
    gasPrice,
    value,
    data: '0x0000',
    gas: BigInt(0)
  }

  const gas = await web3.eth.estimateGas(rawTx)
  rawTx.gas = gas

  const signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey.value)

  const trans = web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  trans.on('transactionHash', (txid) => {
    console.log(`https://goerli.etherscan.io/tx/${txid}`)
  })
}
</script>
