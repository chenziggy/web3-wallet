import {defineStore} from 'pinia'
import { getItem, setItem } from 'localforage'
import { Wallet } from '@ethereumjs/wallet'

const hdStoreLetter = 'hdStore'
interface HdStore {
  keystores: string[],
  password: string,
}

 const useHdStore = defineStore(hdStoreLetter,  () => {
   
  const hdStore: Ref<HdStore> = ref(
   { keystores: [], password: ''}
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

  const wallets = ref<Wallet[]>([])
   async function getWallets() {
    if (hdStore.value.keystores.length && hdStore.value.password) {
      for (const keystore of hdStore.value.keystores) {
        const wallet = await Wallet.fromV3( keystore , hdStore.value.password)
        wallets.value.push(wallet)
        console.log(wallets.value)
      }
      
    }
  }

  return {
    hdStore,
    wallets,
    setHdStore,
    getHdStore,
    addKeyStore,
    getWallets
  }
})

export default useHdStore