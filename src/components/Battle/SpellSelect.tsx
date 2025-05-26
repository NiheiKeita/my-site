import { useAtom } from 'jotai'
import { playerStatusAtom } from '~/store/player'
import { Spell } from '~/types/battle'

interface SpellSelectProps {
  spells: Spell[]
  onSpellSelect: (spell: Spell) => void
  onClose: () => void
}

export const SpellSelect = ({ spells, onSpellSelect, onClose }: SpellSelectProps) => {
  const [playerStatus] = useAtom(playerStatusAtom)

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-gray-800 p-4">
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl font-bold text-white">じゅもん</h2>
          <button onClick={onClose} className="text-white">
            ✕
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {spells.map((spell) => (
            <button
              key={spell.id}
              onClick={() => onSpellSelect(spell)}
              disabled={playerStatus.mp < spell.mp}
              className="mb-2 w-full rounded bg-gray-700 p-2 text-left text-white hover:bg-gray-600 disabled:opacity-50"
            >
              <div className="flex justify-between">
                <span>{spell.name}</span>
                <span>MP: {spell.mp}</span>
              </div>
              <p className="text-sm text-gray-300">{spell.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 