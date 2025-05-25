import { atom } from 'jotai'
import { maps } from '~/data/maps'
import { pickedItemsAtom } from './bag'
import type { MapData } from '~/types/game'

// 初期値としてmaps[0]を設定
const baseMapAtom = atom<MapData>(maps[0])

// フィルタリングされたマップを返すatom
export const currentMapAtom = atom<MapData>((get) => {
  const currentMap = get(baseMapAtom)
  const pickedItems = get(pickedItemsAtom)

  return {
    ...currentMap,
    gameObjects: currentMap.gameObjects.filter(obj => {
      if (obj.type !== 'item') return true

      return !pickedItems.some(
        item => item.mapId === currentMap.id && item.objectId === obj.id
      )
    })
  }
})

// 書き込み専用のatom
export const writeCurrentMapAtom = atom(
  null,
  (get, set, newMap: MapData) => {
    set(baseMapAtom, newMap)
  }
) 