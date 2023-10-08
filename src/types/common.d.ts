export interface HdStore {
  keystores: string[]
  password: string
  mnemonic: string
  usernameMap: Record<string, string>
}

export interface VWallet {
  address: string
  privateKey: string
  username: string
}

export type toVWallet = Pick<VWallet, 'address' | 'username'>
