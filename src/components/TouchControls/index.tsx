type Direction = 'up' | 'down' | 'left' | 'right';

type MoveHandler = {
  (direction: Direction): void;
};

interface TouchControlsProps {
  onMove: MoveHandler;
  onInteract: () => void;
}

export const TouchControls = ({ onMove, onInteract }: TouchControlsProps) => {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center gap-2">
      <button
        className="flex size-12 items-center justify-center rounded-full bg-gray-700 text-white"
        onClick={() => onMove('up')}
      >
        ↑
      </button>
      <div className="flex gap-2">
        <button
          className="flex size-12 items-center justify-center rounded-full bg-gray-700 text-white"
          onClick={() => onMove('left')}
        >
          ←
        </button>
        <button
          className="flex size-12 items-center justify-center rounded-full bg-gray-700 text-white"
          onClick={onInteract}
        >
          ⏎
        </button>
        <button
          className="flex size-12 items-center justify-center rounded-full bg-gray-700 text-white"
          onClick={() => onMove('right')}
        >
          →
        </button>
      </div>
      <button
        className="flex size-12 items-center justify-center rounded-full bg-gray-700 text-white"
        onClick={() => onMove('down')}
      >
        ↓
      </button>
    </div>
  )
} 