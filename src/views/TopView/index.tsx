'use client'

import { useEffect, useState } from 'react'
import { Game } from '../../components/Game'
import { useSetAtom } from 'jotai'
import { resetPlayerStatusAtom } from '../../store/player'

export const TopView = () => {
  const resetPlayerStatus = useSetAtom(resetPlayerStatusAtom)
  const [showGame, setShowGame] = useState(false)

  useEffect(() => {
    // プレイヤーステータスをリセット
    resetPlayerStatus()

    const timer = setTimeout(() => {
      setShowGame(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [resetPlayerStatus])

  if (showGame) {
    return <Game />
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in">
        ドラゴンクエスト風RPG
      </h1>
      <p className="text-xl md:text-2xl mb-4 animate-fade-in">
        ようこそ、冒険者よ
      </p>
      <p className="text-lg md:text-xl animate-blink">
        ゲームを開始します...
      </p>
    </div>
  )
} 