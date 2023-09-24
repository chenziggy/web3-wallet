<script setup lang="ts">
import Web3, {utils} from 'web3'

const address = ref(import.meta.env.VITE_ADDRESS)
const privateKey  = ref(import.meta.env.VITE_PRIVATE_KEY)
const web3 = new Web3(import.meta.env.VITE_PROVIDER)

const total = ref<String>()
onMounted(async () => {
  const balance = await web3.eth.getBalance(address.value)
  total.value= utils.fromWei(balance, 'ether')
})


const send = async () => {
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

  trans.on('receipt', (res) => {
    console.log('第一个节点确认', res)
  })

  trans.on('confirmation', (res) => {
    console.log('第n个节点确认', res)

  })

}
</script>


<template>
  <div @click="send">
    <p>
      address: {{ address }}

    </p>
    <p>
      private key: {{ privateKey }}

    </p>
    <p>
      total: {{ total }}
    </p>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
