import { BattleCommand, BattlePhase } from '~/types/battle'

interface BattleCommandMenuProps {
  phase: BattlePhase
  onCommandSelect: (command: BattleCommand) => void
}

export const BattleCommandMenu = ({ phase, onCommandSelect }: BattleCommandMenuProps) => {
  const initialCommands: { id: BattleCommand; label: string }[] = [
    { id: 'fight', label: 'たたかう' },
    { id: 'run', label: 'にげる' },
  ]

  const actionCommands: { id: BattleCommand; label: string }[] = [
    { id: 'attack', label: 'こうげき' },
    { id: 'spell', label: 'じゅもん' },
    { id: 'item', label: 'どうぐ' },
    { id: 'back', label: 'もどる' },
  ]

  const commands = phase === 'initial' ? initialCommands : actionCommands

  return (
    <div className="grid grid-cols-2 gap-4">
      {commands.map((command) => (
        <button
          key={command.id}
          onClick={() => onCommandSelect(command.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {command.label}
        </button>
      ))}
    </div>
  )
} 