'use client'

import { useEffect, useState } from 'react'
import { useSetAtom } from 'jotai'
import { resetPlayerStatusAtom } from '../../store/player'
import { getImagePath } from '../../utils/imagePath'
import { enemies } from '../../data/enemies'
import { GameView } from '../GameView'

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

  // 画像をプリロード
  useEffect(() => {
    // 主人公
    const directions = ["up", "down", "right", "left"] as const
    const steps = [0, 1] as const
    directions.forEach(direction => {
      const img = new Image()
      steps.forEach(step => {
        img.src = getImagePath(`/assets/characters/hero_${direction}_${step}.PNG`)
      })
    })
    //敵のやられた姿
    enemies.forEach(enemy => {
      const img = new Image()
      img.src = getImagePath(enemy.defeatedImage)
    })
  }, [])

  if (showGame) {
    return <GameView />
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in">
        ケイタMAXの冒険
      </h1>
      <p className="text-xl md:text-2xl mb-4 animate-fade-in">
        ケイタMAXの冒険にようこそ
      </p>
      <p className="text-lg md:text-xl animate-blink">
        ゲームを開始しています...
      </p>
    </div>
  )
} 