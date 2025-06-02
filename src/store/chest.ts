import { atom } from "jotai"

// 空いたチェストを管理するアトム
export const openedChestAtom = atom<{ mapId: string; objectId: string }[]>([])

// チェストを開いたことを記録するアトム
export const addOpenedChestAtom = atom(
  null,
  (get, set, item: { mapId: string; objectId: string }) => {
    const currentOpenedChests = get(openedChestAtom)
    set(openedChestAtom, [...currentOpenedChests, item])
  }
)