import { atom } from 'jotai'
import { PlayerStatus } from '../types/player'

const initialPlayerStatus: PlayerStatus = {
  hp: 100,
  maxHp: 100,
  level: 1,
  exp: 0,
  gold: 0,
  attack: 10,
  defense: 5,
}

export const playerStatusAtom = atom<PlayerStatus>(initialPlayerStatus)

// プレイヤーステータスを更新するアトム
export const updatePlayerStatusAtom = atom(
  null,
  (get, set, update: Partial<PlayerStatus>) => {
    const currentStatus = get(playerStatusAtom)
    set(playerStatusAtom, { ...currentStatus, ...update })
  }
)

// プレイヤーステータスをリセットするアトム
export const resetPlayerStatusAtom = atom(
  null,
  (get, set) => {
    set(playerStatusAtom, initialPlayerStatus)
  }
) 