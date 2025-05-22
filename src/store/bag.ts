import { atom } from 'jotai'
// import { Item } from '../types/item'
// import { items } from '~/data/items'
// import { initialItems } from '../data/items'

// バッグの中身の状態
export const bagItemsAtom = atom<string[]>([])

// アイテムを追加する
export const addBagItemAtom = atom(
  null,
  (get, set, item: string) => {
    const currentItems = get(bagItemsAtom)
    set(bagItemsAtom, [...currentItems, item])
  }
)

// アイテムを削除する
export const removeBagItemAtom = atom(
  null,
  (get, set, itemId: string) => {
    const currentItems = get(bagItemsAtom)
    set(bagItemsAtom, currentItems.filter(item => item !== itemId))
  }
) 