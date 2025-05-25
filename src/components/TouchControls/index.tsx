import { IoMdMenu } from "react-icons/io"

type Direction = 'up' | 'down' | 'left' | 'right';

interface TouchControlsProps {
  onMove: (_direction: Direction) => void;
  onInteract: () => void;
  onMenu: () => void;
}

export const TouchControls = ({ onMove, onInteract, onMenu }: TouchControlsProps) => {
  return (
    <>
      <div className="fixed bottom-8 sm:left-8 left-2 flex flex-col items-center gap-2">
        <button
          className="flex size-16 items-center justify-center rounded-full text-4xl bg-gray-700 text-white"
          onClick={() => onMenu()}
        >
          <IoMdMenu />
        </button>
      </div>
      <div className="fixed bottom-8 sm:right-8 right-2 flex flex-col items-center gap-2">
        <button
          className="flex size-16 items-center justify-center rounded-full bg-gray-700 text-white"
          onClick={() => onMove('up')}
        >
          ↑
        </button>
        <div className="flex gap-2">
          <button
            className="flex size-16 items-center justify-center rounded-full bg-gray-700 text-white"
            onClick={() => onMove('left')}
          >
            ←
          </button>
          <button
            className="flex size-16 items-center justify-center rounded-full text-4xl bg-gray-700 text-white"
            onClick={onInteract}
          >
            ◉
          </button>
          <button
            className="flex size-16 items-center justify-center rounded-full bg-gray-700 text-white"
            onClick={() => onMove('right')}
          >
            →
          </button>
        </div>
        <button
          className="flex size-16 items-center justify-center rounded-full bg-gray-700 text-white"
          onClick={() => onMove('down')}
        >
          ↓
        </button>
      </div>
    </>
  )
} 