import { ItemEffect } from '../types/item'
import { PlayerStatus } from '../store/player'

/**
 * アイテムの効果をプレイヤーのステータスに適用する
 * @param effect アイテムの効果
 * @param currentStatus 現在のプレイヤーステータス
 * @returns 更新されるステータス
 */
export const applyItemEffect = (effect: ItemEffect, currentStatus: PlayerStatus): Partial<PlayerStatus> => {
  const updates: Partial<PlayerStatus> = {}

  // HP回復
  if (effect.hp) {
    updates.hp = Math.min(currentStatus.hp + effect.hp, currentStatus.maxHp)
  }

  // MP回復
  if (effect.mp) {
    updates.mp = Math.min(currentStatus.mp + effect.mp, currentStatus.maxMp)
  }

  // 攻撃力上昇
  if (effect.attack) {
    updates.attack = currentStatus.attack + effect.attack
  }

  // 防御力上昇
  if (effect.defense) {
    updates.defense = currentStatus.defense + effect.defense
  }

  // 経験値獲得
  if (effect.exp) {
    updates.exp = currentStatus.exp + effect.exp
  }

  return updates
} 