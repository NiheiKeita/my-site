import React, { useState, useEffect } from 'react'
import { GRID_SIZE } from '../Map'

interface CharacterProps {
  position: {
    x: number;
    y: number;
  };
  direction: 'up' | 'down' | 'left' | 'right';
}

export const Character = ({ position, direction }: CharacterProps) => {
  const [isWalking, setIsWalking] = useState(false)
  const [step, setStep] = useState(0)

  // 位置が変更されたときに歩行アニメーションを開始
  useEffect(() => {
    setIsWalking(true)
    const timer = setTimeout(() => {
      setIsWalking(false)
    }, 200) // 200ミリ秒後に歩行アニメーションを停止
    return () => clearTimeout(timer)
  }, [position])

  // 歩行アニメーション中はステップを切り替え
  useEffect(() => {
    if (isWalking) {
      const timer = setInterval(() => {
        setStep((prev) => (prev + 1) % 2)
      }, 100) // 100ミリ秒ごとにステップを切り替え
      return () => clearInterval(timer)
    }
  }, [isWalking])

  return (
    <img
      src={`/assets/characters/hero_${direction}_${step}.PNG`}
      alt="主人公"
      className="absolute size-12"
      style={{
        left: `${position.x * GRID_SIZE}px`,
        top: `${position.y * GRID_SIZE}px`,
      }}
    />
  )
} 