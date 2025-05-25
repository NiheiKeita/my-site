import { atom } from 'jotai'
import { items } from '~/data/items'
import { updatePlayerStatusAtom } from './player'
import { playerStatusAtom } from './player'
import { applyItemEffect } from '~/hooks/useItemEffect'

// バッグの中身の状態
export const bagItemsAtom = atom<string[]>([])

// 拾ったアイテムの位置情報を管理するアトム
export const pickedItemsAtom = atom<{ mapId: string; objectId: string }[]>([])

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

// アイテムを拾ったことを記録するアトム
export const addPickedItemAtom = atom(
  null,
  (get, set, item: { mapId: string; objectId: string }) => {
    const currentPickedItems = get(pickedItemsAtom)
    set(pickedItemsAtom, [...currentPickedItems, item])
  }
)

// アイテムを使用する
export const useItemAtom = atom(
  null,
  (get, set, itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return

    // 現在のプレイヤーステータスを取得
    const currentStatus = get(playerStatusAtom)

    // アイテムの効果を適用
    const updates = applyItemEffect(item.effect, currentStatus)
    set(updatePlayerStatusAtom, updates)

    // 消費可能なアイテムの場合のみ消費
    if (item.consumable) {
      set(removeBagItemAtom, itemId)
    }
  }
) 