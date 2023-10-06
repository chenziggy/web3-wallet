import {defineStore} from 'pinia'
import { getItem, setItem } from 'localforage'
import { Wallet } from '@ethereumjs/wallet'
const hdStoreLetter = 'hdStore'
interface HdStore {
  keystores: string[],
  password: string,
  mnemonic: string
}

interface VWallet {
  address: string,
  privateKey: string,
  username: string
}

 const useHdStore = defineStore(hdStoreLetter,  () => {
   
  const hdStore: Ref<HdStore> = ref(
   { keystores: [], password: '', mnemonic: ''}
  )

  async function setHdStore(hd: Partial<HdStore>) {
    const res = Object.assign({}, hdStore.value, hd)
    hdStore.value = await setItem(hdStoreLetter, JSON.parse(JSON.stringify(res)))
  }

  async function getHdStore() {
    Object.assign(hdStore.value, await getItem(hdStoreLetter))
  }

  async function addKeyStore(keystore: string) {
    hdStore.value.keystores.push(keystore)
    await setHdStore({keystores: hdStore.value.keystores})
  }

  const wallets = ref<VWallet[]>([])
   async function getWallets() {
    if (hdStore.value.keystores.length && hdStore.value.password) {
      let index = 1
      for (const keystore of hdStore.value.keystores) {
        const wallet = await Wallet.fromV3( keystore , hdStore.value.password)
        const address = wallet.getAddressString()
        const privateKey = wallet.getPrivateKeyString()
        wallets.value.push({
          address,
          privateKey,
          username: `Account${index}`
        })
        index++
      }
    }
  }

  const currentAccount = ref<VWallet>()

  async function initCurrentAccount() {
    await getWallets()
    currentAccount.value = wallets.value[0]
  }

  async function changeCurrentAccount(username: string) {
    currentAccount.value = wallets.value.find(wallet => username === wallet.username)
  }

  return {
    hdStore,
    wallets,
    setHdStore,
    getHdStore,
    addKeyStore,
    getWallets,
    currentAccount,
    initCurrentAccount,
    changeCurrentAccount,
  }
})

export default useHdStore