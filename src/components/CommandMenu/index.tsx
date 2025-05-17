import { useState } from 'react'
import { CommandDetail } from '../CommandDetail'

interface CommandMenuProps {
  onClose: () => void
}

export const CommandMenu = ({ onClose }: CommandMenuProps) => {
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null)

  const commands = [
    { id: 'spell', label: '呪文' },
    { id: 'item', label: 'バッグ' },
    { id: 'status', label: '強さ' },
    { id: 'equip', label: '装備' },
  ]

  const handleCommandSelect = (commandId: string) => {
    setSelectedCommand(commandId)
  }

  const handleDetailClose = () => {
    setSelectedCommand(null)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-64">
        <div className="grid grid-cols-2 gap-2">
          {commands.map((command) => (
            <button
              key={command.id}
              onClick={() => handleCommandSelect(command.id)}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
            >
              {command.label}
            </button>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
      {selectedCommand && (
        <CommandDetail
          type={selectedCommand as 'spell' | 'item' | 'status' | 'equip'}
          onClose={handleDetailClose}
        />
      )}
    </div>
  )
} 