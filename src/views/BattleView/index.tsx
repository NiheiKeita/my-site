'use client'
import React from 'react'
import { useCallback, useEffect } from 'react'
import { Enemy, BattleResult } from '../../types/enemy'
import { getImagePath } from '../../utils/imagePath'
import { motion } from 'framer-motion'
import { useBattleLogic } from './hooks'

interface BattleViewProps {
  enemy: Enemy;
  onBattleEnd: (result: BattleResult) => void;
  playerHp: number;
  setPlayerHp: (hp: number) => void;
}

export const BattleView: React.FC<BattleViewProps> = ({ enemy, onBattleEnd, playerHp, setPlayerHp }) => {
  const {
    enemyHp,
    battleState,
    showEndMessage,
    isEnemyDamaged,
    isEscaping,
    isEnemyAppeared,
    isPlayerDamaged,
    handlePlayerAttack,
    handleEscape,
    playerStatus,
  } = useBattleLogic(enemy, onBattleEnd, playerHp, setPlayerHp)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (showEndMessage && e.key === 'Enter') {
      onBattleEnd({
        isVictory: battleState.isVictory,
        exp: battleState.isVictory ? enemy.exp : 0,
        gold: battleState.isVictory ? enemy.gold : 0,
      })
    }
  }, [showEndMessage, battleState.isVictory, enemy.exp, enemy.gold, onBattleEnd])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    
return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 text-white">
      {/* ダメージエフェクト */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={isPlayerDamaged ? {
          backgroundColor: ['rgba(255, 0, 0, 0.3)', 'rgba(255, 0, 0, 0)'],
          transition: {
            duration: 0.3,
            ease: "easeInOut"
          }
        } : {}}
        initial={false}
      />
      {/* ステータス表示 */}
      <div className="flex justify-between p-4">
        <div>
          <p>あなた</p>
          <div className="h-4 sm:w-64 w-36 bg-gray-700 rounded">
            <div
              className="h-full bg-green-500 rounded"
              style={{ width: `${(playerHp / playerStatus.maxHp) * 100}%` }}
            />
          </div>
          <p>HP: {playerHp}/{playerStatus.maxHp}</p>
        </div>
        <div>
          <p>{enemy.name} Lv.{enemy.level}</p>
          <div className="h-4 sm:w-64 w-36 bg-gray-700 rounded">
            <div
              className="h-full bg-red-500 rounded"
              style={{ width: `${(enemyHp / enemy.maxHp) * 100}%` }}
            />
          </div>
          <p>HP: {enemyHp}/{enemy.maxHp}</p>
        </div>
      </div>

      {/* 敵の画像 */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* プレイヤーの剣 */}
        <motion.img
          src={getImagePath('/assets/weapons/sword.png')}
          alt="剣"
          className="absolute left-0 bottom-0 sm:size-32 size-24 object-contain"
          animate={battleState.isAttacking ? {
            y: ['-50vh', '0vh', 0],
            x: [0, '50vw', 0],
            rotate: [-30, 45, 0],
            transition: {
              duration: 0.8,
              times: [0, 0.4, 1],
              ease: ["easeOut", "easeIn", "easeInOut"]
            }
          } : {}}
          initial={false}
        />
        {/* 敵の画像 */}
        <motion.img
          src={getImagePath(battleState.isVictory ? enemy.defeatedImage : enemy.image)}
          alt={enemy.name}
          className="size-80 object-contain"
          animate={isEnemyDamaged ? {
            x: [0, -10, 10, -10, 10, 0],
            transition: {
              duration: 0.3,
              ease: "easeInOut"
            }
          } : battleState.isVictory ? {
            opacity: [1, 0],
            scale: [1, 0.8],
            transition: {
              duration: 1,
              ease: "easeOut"
            }
          } : {}}
          initial={false}
        />
      </div>

      {/* メッセージウィンドウ */}
      <div className="h-32 bg-black/80 p-4">
        <p className="text-xl">{battleState.message}</p>
        {showEndMessage && (
          <p className="text-lg mt-2 text-yellow-400 animate-blink">
            {battleState.isVictory
              ? `経験値${enemy.exp}と${enemy.gold}ゴールドを獲得！`
              : 'エンターキーを押してください'}
          </p>
        )}
      </div>

      {/* コマンド選択 */}
      <div className={`grid grid-cols-2 gap-4 p-4 ${(battleState.isPlayerTurn && !battleState.isAttacking && !showEndMessage && !isEscaping && !isEnemyAppeared) ? '' : 'invisible'}`}>
        <button
          onClick={handlePlayerAttack}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          たたかう
        </button>
        <button
          onClick={handleEscape}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          にげる
        </button>
      </div>
    </div>
  )
} 