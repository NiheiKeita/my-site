import { useEffect, useState } from 'react'

// グリッドのサイズを計算する関数
export const calculateGridSize = (width: number, height: number): number => {
  // 画面の幅と高さを取得
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  // マップの表示領域の余白を考慮（左右上下のパディング）
  const padding = 32 // 16px * 2
  const controlHeight = 200 // コントロール部分の高さの概算

  // 利用可能な幅と高さを計算
  const availableWidth = screenWidth - padding
  const availableHeight = screenHeight - padding - controlHeight

  // 幅と高さに基づいてグリッドサイズを計算
  const widthBasedSize = Math.floor(availableWidth / width)
  const heightBasedSize = Math.floor(availableHeight / height)

  // 小さい方を採用（正方形を維持するため）
  const gridSize = Math.min(widthBasedSize, heightBasedSize)

  // 最小サイズを設定（32px）
  return Math.max(gridSize, 32)
}

// グリッドのサイズを定数として定義（デフォルト値）
export const GRID_SIZE = 48

interface MapProps {
  width?: number;
  height?: number;
  onGridSizeChange?: (size: number) => void;
}

export const Map = ({ width = 8, height = 8, onGridSizeChange }: MapProps) => {
  const [gridSize, setGridSize] = useState(GRID_SIZE)

  useEffect(() => {
    // 初期サイズを計算
    const newGridSize = calculateGridSize(width, height)
    setGridSize(newGridSize)
    onGridSizeChange?.(newGridSize)

    // リサイズイベントのハンドラー
    const handleResize = () => {
      const newGridSize = calculateGridSize(width, height)
      setGridSize(newGridSize)
      onGridSizeChange?.(newGridSize)
    }

    // リサイズイベントのリスナーを追加
    window.addEventListener('resize', handleResize)

    // クリーンアップ
    return () => window.removeEventListener('resize', handleResize)
  }, [width, height, onGridSizeChange])

  const grid = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      isAlternate: (x + y) % 2 === 0,
    }))
  )

  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${width}, ${gridSize}px)` }}>
      {grid.flat().map((cell) => (
        <div
          key={`${cell.x}-${cell.y}`}
          className={`${cell.isAlternate ? 'bg-gray-600' : 'bg-gray-700'}`}
          style={{ width: `${gridSize}px`, height: `${gridSize}px` }}
        />
      ))}
    </div>
  )
} 