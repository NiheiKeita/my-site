'use client'

import { useEffect, useState } from 'react'
import { Game } from '../../components/Game'

export const TopView = () => {
  const [showGame, setShowGame] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGame(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (showGame) {
    return <Game />
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="mb-8 text-6xl font-bold">ドラゴンクエスト風RPG</h1>
      <div className="text-2xl">
        <p className="mb-4">ようこそ、冒険者よ</p>
        <p className="animate-pulse">ゲームを開始します...</p>
      </div>
    </div>
  )
} 