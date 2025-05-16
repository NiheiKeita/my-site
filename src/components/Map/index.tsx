// グリッドのサイズを定数として定義
export const GRID_SIZE = 48

interface MapProps {
  width?: number;
  height?: number;
}

export const Map = ({ width = 8, height = 8 }: MapProps) => {
  const grid = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      isAlternate: (x + y) % 2 === 0,
    }))
  )

  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${width}, ${GRID_SIZE}px)` }}>
      {grid.flat().map((cell) => (
        <div
          key={`${cell.x}-${cell.y}`}
          className={`size-12 ${cell.isAlternate ? 'bg-gray-700' : 'bg-gray-800'}`}
        />
      ))}
    </div>
  )
} 