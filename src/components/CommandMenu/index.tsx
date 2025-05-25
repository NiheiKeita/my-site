import { useState } from 'react'
import { CommandDetail } from '../CommandDetail'
import { useAtom } from 'jotai/react'
import { playerStatusAtom } from '~/store/player'

interface CommandMenuProps {
  onClose: () => void
}

export const CommandMenu = ({ onClose }: CommandMenuProps) => {
  const [playerStatus,] = useAtom(playerStatusAtom)
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null)

  const commands = [
    { id: 'spell', label: '呪文' },
    { id: 'item', label: 'バッグ' },
    { id: 'status', label: '強さ' },
    { id: 'equip', label: '装備' },
    { id: 'skill', label: 'スキル' },
  ]

  const handleCommandSelect = (commandId: string) => {
    setSelectedCommand(commandId)
  }

  const handleDetailClose = () => {
    setSelectedCommand(null)
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-64 rounded-lg bg-gray-800 p-4 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {commands.map((command) => (
              <button
                key={command.id}
                onClick={() => handleCommandSelect(command.id)}
                className="rounded bg-gray-700 p-2 text-white transition-colors hover:bg-gray-600"
              >
                {command.label}
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="rounded bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
            >
              閉じる
            </button>
          </div>
        </div>
        <div className="fixed left-4 bottom-4 rounded bg-black/50 p-2 text-white">
          <p>Lv.{playerStatus.level}</p>
          <div className="h-4 sm:w-48 w-36 rounded bg-gray-700">
            <div
              className="h-full rounded bg-green-500"
              style={{ width: `${(playerStatus.hp / playerStatus.maxHp) * 100}%` }}
            />
          </div>
          <p>HP: {playerStatus.hp}/{playerStatus.maxHp}</p>
          <p>EXP: {playerStatus.exp}</p>
          <p>GOLD: {playerStatus.gold}</p>
        </div>
        {selectedCommand && (
          <CommandDetail
            type={selectedCommand as 'spell' | 'item' | 'status' | 'equip'}
            onClose={handleDetailClose}
          />
        )}
      </div>
    </>
  )
} 