import { ItemEffect } from '~/types/item'
import { PlayerStatus } from '~/store/player'

interface EffectResult {
  updates: Partial<PlayerStatus>
  messages: string[]
}

/**
 * アイテムの効果をプレイヤーのステータスに適用する
 * @param effect アイテムの効果
 * @param currentStatus 現在のプレイヤーステータス
 * @returns 更新されるステータスとメッセージ
 */
export const applyItemEffect = (effect: ItemEffect | undefined, currentStatus: PlayerStatus): EffectResult => {
  const updates: Partial<PlayerStatus> = {}
  const messages: string[] = []

  if (!effect) {
    return { updates, messages }
  }

  // HP回復
  if (effect.hp) {
    const newHp = Math.min(currentStatus.hp + effect.hp, currentStatus.maxHp)
    const hpDiff = newHp - currentStatus.hp

    if (hpDiff > 0) {
      updates.hp = newHp
      messages.push(`HPが${hpDiff}回復した！`)
    } else {
      messages.push('HPはすでに満タンだ！')
    }
  }

  // MP回復
  if (effect.mp) {
    const newMp = Math.min(currentStatus.mp + effect.mp, currentStatus.maxMp)
    const mpDiff = newMp - currentStatus.mp
    if (mpDiff > 0) {
      updates.mp = newMp
      messages.push(`MPが${mpDiff}回復した！`)
    } else {
      messages.push('MPはすでに満タンだ！')
    }
  }

  // 攻撃力上昇
  if (effect.attack) {
    updates.attack = currentStatus.attack + effect.attack
    messages.push(`攻撃力が${effect.attack}上がった！`)
  }

  // 防御力上昇
  if (effect.defense) {
    updates.defense = currentStatus.defense + effect.defense
    messages.push(`防御力が${effect.defense}上がった！`)
  }

  // 経験値獲得
  if (effect.exp) {
    updates.exp = currentStatus.exp + effect.exp
    messages.push(`経験値を${effect.exp}獲得した！`)
  }

  return { updates, messages }
} 
