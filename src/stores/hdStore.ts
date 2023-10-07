import {defineStore} from 'pinia'
import { getItem, setItem } from 'localforage'
import { Wallet } from '@ethereumjs/wallet'
const hdStoreLetter = 'hdStore'
interface HdStore {
  keystores: string[],
  password: string,
  mnemonic: string,
  usernameList: string[]
}

interface VWallet {
  address: string,
  privateKey: string,
  username: string
}

 const useHdStore = defineStore(hdStoreLetter,  () => {
   
  const hdStore: Ref<HdStore> = ref(
   { keystores: [], password: '', mnemonic: '', usernameList: []}
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

  async function addUsernameList(username: string) {
    hdStore.value.usernameList.push(username)
    await setHdStore({usernameList: hdStore.value.usernameList})
  }

  const wallets = ref<VWallet[]>([])
  async function getWallets() {
    if (hdStore.value.keystores.length && hdStore.value.password) {
        const list = []
        let index = 0
      for (const keystore of hdStore.value.keystores) {
        const wallet = await Wallet.fromV3( keystore ,hdStore.value.password)
        const address = wallet.getAddressString()
        const privateKey = wallet.getPrivateKeyString()
        list.push({
          address,
          privateKey,
          username: `${hdStore.value.usernameList[index]}`
        })
        index++
      }
      wallets.value = list
    }
  }

  const currentAccount = ref<VWallet>()

  async function initCurrentAccount() {
    await getWallets()
    currentAccount.value = wallets.value[0]
  }

  async function changeCurrentAccount(address: string) {
    currentAccount.value = wallets.value.find(wallet => address === wallet.address)
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
    addUsernameList
  }
})

export default useHdStore