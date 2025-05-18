type Direction = 'up' | 'down' | 'left' | 'right';

interface TouchControlsProps {
  onMove: (_direction: Direction) => void;
  onInteract: () => void;
}

export const TouchControls = ({ onMove, onInteract }: TouchControlsProps) => {
  return (
    <div className="fixed bottom-8 sm:right-8 right-2 flex flex-col items-center gap-2">
      <button
        className="flex sm:size-12 size-10 items-center justify-center rounded-full bg-gray-700 text-white"
        onClick={() => onMove('up')}
      >
        ↑
      </button>
      <div className="flex gap-2">
        <button
          className="flex  sm:size-12 size-10 items-center justify-center rounded-full bg-gray-700 text-white"
          onClick={() => onMove('left')}
        >
          ←
        </button>
        <button
          className="flex  sm:size-12 size-10 items-center justify-center rounded-full bg-gray-700 text-white"
          onClick={onInteract}
        >
          ⏎
        </button>
        <button
          className="flex  sm:size-12 size-10 items-center justify-center rounded-full bg-gray-700 text-white"
          onClick={() => onMove('right')}
        >
          →
        </button>
      </div>
      <button
        className="flex  sm:size-12 size-10 items-center justify-center rounded-full bg-gray-700 text-white"
        onClick={() => onMove('down')}
      >
        ↓
      </button>
    </div>
  )
} 