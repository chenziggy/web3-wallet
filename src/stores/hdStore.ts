import { defineStore } from 'pinia'
import { getItem, setItem } from 'localforage'
import { Wallet } from '@ethereumjs/wallet'
import type { HdStore, VWallet } from '@/types/common'

const hdStoreLetter = 'hdStore'

const useHdStore = defineStore(hdStoreLetter, () => {
  const hdStore: Ref<HdStore> = ref(
    { keystores: [], password: '', mnemonic: '', usernameMap: {} },
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
    await setHdStore({ keystores: hdStore.value.keystores })
  }

  async function addUsernameMap(address: string, username: string) {
    hdStore.value.usernameMap[address] = username
    await setHdStore({ usernameMap: hdStore.value.usernameMap })
  }

  const wallets = ref<VWallet[]>([])
  async function getWallets() {
    if (hdStore.value.keystores.length && hdStore.value.password) {
      const list = []
      let index = 0
      for (const keystore of hdStore.value.keystores) {
        const wallet = await Wallet.fromV3(keystore, hdStore.value.password)
        const address = wallet.getAddressString()
        const privateKey = wallet.getPrivateKeyString()
        const username = hdStore.value.usernameMap[address] ?? `Account${index + 1}`
        list.push({
          address,
          privateKey,
          username,
        })
        index++
      }
      wallets.value = list
    }
  }

  const currentAccount = ref<VWallet>({
    address: '',
    privateKey: '',
    username: '',
  })

  async function init() {
    // perf first add one account
    if (hdStore.value.keystores.length) {
      const wallet = await Wallet.fromV3(hdStore.value.keystores[0], hdStore.value.password)
      const address = wallet.getAddressString()
      const privateKey = wallet.getPrivateKeyString()
      const username = hdStore.value.usernameMap[address] ?? `Account1`
      currentAccount.value = {
        address,
        privateKey,
        username,
      }
    }
    await initCurrentAccount()
  }

  async function initCurrentAccount() {
    await getWallets()
    currentAccount.value = wallets.value[0]
  }

  async function changeCurrentAccount(address: string) {
    const account = wallets.value.find(wallet => address === wallet.address)
    if (account)
      currentAccount.value = account
  }

  return {
    hdStore,
    wallets,
    setHdStore,
    getHdStore,
    addKeyStore,
    getWallets,
    currentAccount,
    init,
    initCurrentAccount,
    changeCurrentAccount,
    addUsernameMap,
  }
})

export default useHdStore
