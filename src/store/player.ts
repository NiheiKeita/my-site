import { atom } from 'jotai'
import { initialPlayerStatus } from '~/data/initialPlayerStatus'
import { Spell } from '~/types/battle'

export interface PlayerStatus {
  hp: number
  maxHp: number
  level: number
  exp: number
  gold: number
  attack: number
  defense: number
  mp: number
  maxMp: number
  spells: Spell[]
}

// レベルアップに必要な経験値テーブル
const EXP_TABLE = [
  0,    // レベル1
  50,  // レベル2
  120,  // レベル3
  200,  // レベル4
  400, // レベル5
  650, // レベル6
  950, // レベル7
  1300, // レベル8
  1800, // レベル9
  2600, // レベル10
  3500, // レベル11
  4500, // レベル12
  5500, // レベル13
  6500, // レベル14
  7500, // レベル15
  8500, // レベル16
  9500, // レベル17
]

// レベルアップ時のステータス上昇値
const LEVEL_UP_STATS = {
  maxHp: 10,
  maxMp: 5,
  attack: 2,
  defense: 1,
}

export const playerStatusAtom = atom<PlayerStatus>(initialPlayerStatus)

// プレイヤーのステータスを更新する関数
export const updatePlayerStatusAtom = atom(
  null,
  (get, set, update: Partial<PlayerStatus>) => {
    const currentStatus = get(playerStatusAtom)
    const newStatus = { ...currentStatus, ...update }

    // 経験値が増加した場合、レベルアップをチェック
    if (update.exp !== undefined && update.exp > currentStatus.exp) {
      const newLevel = calculateLevel(newStatus.exp)

      // レベルアップした場合
      if (newLevel > currentStatus.level) {
        const levelDiff = newLevel - currentStatus.level
        newStatus.level = newLevel
        newStatus.maxHp += LEVEL_UP_STATS.maxHp * levelDiff
        newStatus.maxMp += LEVEL_UP_STATS.maxMp * levelDiff
        newStatus.hp = newStatus.maxHp // HPを全回復
        newStatus.mp = newStatus.maxMp // MPを全回復
        newStatus.attack += LEVEL_UP_STATS.attack * levelDiff
        newStatus.defense += LEVEL_UP_STATS.defense * levelDiff
      }
    }

    set(playerStatusAtom, newStatus)
  }
)

// 経験値からレベルを計算する関数
const calculateLevel = (exp: number): number => {
  for (let level = EXP_TABLE.length - 1; level >= 0; level--) {
    if (exp >= EXP_TABLE[level]) {
      return level + 1
    }
  }

  return 1
}

// プレイヤーステータスをリセットするアトム
export const resetPlayerStatusAtom = atom(
  null,
  (get, set) => {
    set(playerStatusAtom, initialPlayerStatus)
  }
) 