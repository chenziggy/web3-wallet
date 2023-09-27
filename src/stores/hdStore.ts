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
    console.log("🚀 ~ file: hdStore.ts:26 ~ setHdStore ~ res:", res)
    hdStore.value = await setItem(hdStoreLetter, res)
  }

  async function getHdStore() {
    Object.assign(hdStore.value, await getItem(hdStoreLetter))
  }

  return {
    hdStore,
    setHdStore,
    getHdStore
  }
})

export default useHdStore