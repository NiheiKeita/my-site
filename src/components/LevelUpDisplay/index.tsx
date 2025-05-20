import React from 'react'
import { PlayerStatus } from '../../store/player'

interface LevelUpDisplayProps {
  previousLevel: number
  currentStatus: PlayerStatus
}

export const LevelUpDisplay: React.FC<LevelUpDisplayProps> = ({ previousLevel, currentStatus }) => {
  return (
    <div className="text-yellow-300">
      <p className="text-lg mb-2">✨ レベルアップ！ ✨</p>
      <p>レベル {previousLevel} → {currentStatus.level}</p>
      <p>HP: {currentStatus.maxHp - 20} → {currentStatus.maxHp}</p>
      <p>攻撃力: {currentStatus.attack - 5} → {currentStatus.attack}</p>
      <p>防御力: {currentStatus.defense - 3} → {currentStatus.defense}</p>
    </div>
  )
} 