import {defineStore} from 'pinia'
import { getItem, setItem } from 'localforage'

interface Wallet {
  address: string,
  privateKey: string,
}

const hdStoreLetter = 'hdStore'


interface HdStore {
  wallets: Wallet[],
  mnemonic: string,
  password: string
}

 const useHdStore = defineStore(hdStoreLetter,  () => {
   
  const hdStore: Ref<HdStore> = ref(
   { wallets: [], mnemonic: '', password: ''}
  )

  async function setHdStore(hd: Partial<HdStore>) {
    const res = Object.assign({}, hdStore.value, hd)
    hdStore.value = await setItem(hdStoreLetter, JSON.parse(JSON.stringify(res)))
  }

  async function getHdStore() {
    Object.assign(hdStore.value, await getItem(hdStoreLetter))
  }

  async function addWallet(wallet: Wallet) {
    hdStore.value.wallets.push(wallet)
    await setHdStore({wallets: hdStore.value.wallets})
  }

  return {
    hdStore,
    setHdStore,
    getHdStore,
    addWallet
  }
})

export default useHdStore