interface MapProps {
  width?: number;
  height?: number;
}

export const Map = ({ width = 8, height = 8 }: MapProps) => {
  const grid = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
    }))
  )

  return (
    <div className="relative bg-gray-800">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${width}, 32px)` }}>
        {grid.map((row) =>
          row.map((cell) => (
            <div
              key={`${cell.x}-${cell.y}`}
              className="size-8 border border-gray-700"
              style={{
                backgroundColor: (cell.x + cell.y) % 2 === 0 ? '#1f2937' : '#374151',
              }}
            />
          ))
        )}
      </div>
    </div>
  )
} 