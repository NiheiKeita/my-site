import React, { useState } from 'react'
import { PlayerStatus } from '~/store/player'
import { Spell } from '~/types/battle'
import { ItemSelect } from '../ItemSelect'
import { SpellSelect } from '../SpellSelect'

type BattleCommand = 'attack' | 'spell' | 'item' | 'run' | 'back' | 'fight'

interface BattleCommandMenuProps {
  playerStatus: PlayerStatus
  phase: 'initial' | 'action'
  onCommandSelect: (command: BattleCommand, spell?: Spell, itemId?: string) => void
}

export const BattleCommandMenu = ({
  playerStatus,
  phase,
  onCommandSelect,
}: BattleCommandMenuProps) => {
  const [showSpellSelect, setShowSpellSelect] = useState(false)
  const [showItemSelect, setShowItemSelect] = useState(false)

  const handleSpellSelectWithClose = (spell: Spell) => {
    onCommandSelect('spell', spell)
    setShowSpellSelect(false)
  }

  const handleItemSelectWithClose = (itemId?: string) => {
    onCommandSelect('item', undefined, itemId)
    setShowItemSelect(false)
  }

  return (
    <div className="fixed bottom-0 inset-x-0 bg-black bg-opacity-80 p-4">
      {phase === 'initial' ? (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onCommandSelect('fight')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            たたかう
          </button>
          <button
            onClick={() => onCommandSelect('run')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
          >
            にげる
          </button>
        </div>
      ) : (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onCommandSelect('attack')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            攻撃
          </button>
          <button
            onClick={() => setShowSpellSelect(true)}
            disabled={!playerStatus.spells?.length}
            className={`px-4 py-2 rounded ${playerStatus.spells?.length
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
          >
            呪文
          </button>
          <button
            onClick={() => setShowItemSelect(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            道具
          </button>
          <button
            onClick={() => onCommandSelect('back')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            戻る
          </button>
        </div>
      )}

      {/* 呪文選択 */}
      {showSpellSelect && (
        <SpellSelect
          spells={playerStatus.spells}
          onSpellSelect={handleSpellSelectWithClose}
          onClose={() => setShowSpellSelect(false)}
        />
      )}

      {/* アイテム選択 */}
      {showItemSelect && (
        <ItemSelect onClose={handleItemSelectWithClose} />
      )}
    </div>
  )
} 