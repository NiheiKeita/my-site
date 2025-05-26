import React from 'react'
import { PlayerStatus } from '../../types/player'
import { Spell } from '../../types/battle'

type BattleCommand = 'attack' | 'spell' | 'item' | 'run' | 'back' | 'fight'

interface BattleCommandMenuProps {
  playerStatus: PlayerStatus
  onCommandSelect: (command: BattleCommand) => void
  onSpellSelect: (spell: Spell) => void
  onItemSelect: (itemId?: string) => void
  phase: 'initial' | 'action'
}

export const BattleCommandMenu: React.FC<BattleCommandMenuProps> = ({
  onCommandSelect,
  phase
}) => {
  if (phase === 'initial') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded"
          onClick={() => onCommandSelect('fight')}
        >
          戦う
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded"
          onClick={() => onCommandSelect('run')}
        >
          逃げる
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded"
        onClick={() => onCommandSelect('attack')}
      >
        攻撃
      </button>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded"
        onClick={() => onCommandSelect('spell')}
      >
        呪文
      </button>
      <button
        className="bg-green-600 hover:bg-green-700 text-white p-4 rounded"
        onClick={() => onCommandSelect('item')}
      >
        道具
      </button>
      <button
        className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded"
        onClick={() => onCommandSelect('back')}
      >
        戻る
      </button>
    </div>
  )
} 