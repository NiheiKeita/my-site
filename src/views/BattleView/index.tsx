'use client'

import { useState, useEffect, useCallback } from 'react'
import { Enemy, BattleState } from '../../types/enemy'
import { getImagePath } from '../../utils/imagePath'
import { motion } from 'framer-motion'

interface BattleViewProps {
  enemy: Enemy
  onBattleEnd: (isVictory: boolean, exp: number, gold: number) => void
}

export const BattleView = ({ enemy, onBattleEnd }: BattleViewProps) => {
  const [playerHp, setPlayerHp] = useState(100)
  const [enemyHp, setEnemyHp] = useState(enemy.hp)
  const [battleState, setBattleState] = useState<BattleState>({
    isPlayerTurn: true,
    isAttacking: false,
    message: '戦闘開始！',
    isBattleEnd: false,
    isVictory: false,
  })
  const [showEndMessage, setShowEndMessage] = useState(false)
  const [isEnemyDamaged, setIsEnemyDamaged] = useState(false)
  const [isEscaping, setIsEscaping] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (showEndMessage && e.key === 'Enter') {
      onBattleEnd(battleState.isVictory, battleState.isVictory ? enemy.exp : 0, battleState.isVictory ? enemy.gold : 0)
    }
  }, [showEndMessage, battleState.isVictory, enemy.exp, enemy.gold, onBattleEnd])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleAttack = () => {
    if (!battleState.isPlayerTurn || battleState.isAttacking) return

    setBattleState(prev => ({ ...prev, isAttacking: true, message: '攻撃！' }))

    // プレイヤーの攻撃
    setTimeout(() => {
      const damage = Math.max(1, 20 - enemy.defense)
      const newEnemyHp = Math.max(0, enemyHp - damage)
      setEnemyHp(newEnemyHp)
      setIsEnemyDamaged(true)
      setBattleState(prev => ({
        ...prev,
        message: `${enemy.name}に${damage}のダメージ！`,
      }))

      // ダメージアニメーションをリセット
      setTimeout(() => {
        setIsEnemyDamaged(false)
      }, 300)

      // 敵のHPが0になった場合
      if (newEnemyHp === 0) {
        setTimeout(() => {
          setBattleState(prev => ({
            ...prev,
            isBattleEnd: true,
            isVictory: true,
            message: `${enemy.name}をやっつけた！`,
          }))
          setShowEndMessage(true)
          setTimeout(() => {
            onBattleEnd(true, enemy.exp, enemy.gold)
          }, 2000)
        }, 1000)

        return
      }

      // 敵の攻撃
      setTimeout(() => {
        setBattleState(prev => ({
          ...prev,
          isPlayerTurn: false,
          message: `${enemy.name}の攻撃！`,
        }))

        setTimeout(() => {
          const enemyDamage = Math.max(1, enemy.attack - 5)
          const newPlayerHp = Math.max(0, playerHp - enemyDamage)
          setPlayerHp(newPlayerHp)
          setBattleState(prev => ({
            ...prev,
            message: `${enemyDamage}のダメージを受けた！`,
          }))

          // プレイヤーのHPが0になった場合
          if (newPlayerHp === 0) {
            setTimeout(() => {
              setBattleState(prev => ({
                ...prev,
                isBattleEnd: true,
                isVictory: false,
                message: 'あなたは力尽きた...',
              }))
              setShowEndMessage(true)
              onBattleEnd(false, 0, 0)
            }, 1000)

            return
          }

          // 次のターンへ
          setTimeout(() => {
            setBattleState(prev => ({
              ...prev,
              isPlayerTurn: true,
              isAttacking: false,
              message: 'コマンドを選択してください',
            }))
          }, 1000)
        }, 1000)
      }, 1000)
    }, 1000)
  }

  const handleEscape = () => {
    if (!battleState.isPlayerTurn || battleState.isAttacking || isEscaping) return

    setIsEscaping(true)
    setBattleState(prev => ({ ...prev, message: '逃げ出そうとしている...' }))

    // 50%の確率で逃げられる
    const isEscaped = Math.random() < 0.5

    setTimeout(() => {
      if (isEscaped) {
        setBattleState(prev => ({
          ...prev,
          isBattleEnd: true,
          isVictory: false,
          message: '逃げ出した！',
        }))
        setShowEndMessage(true)
        setTimeout(() => {
          onBattleEnd(false, 0, 0)
        }, 2000)
      } else {
        setBattleState(prev => ({
          ...prev,
          message: '逃げ出せなかった！',
        }))
        // 敵の攻撃
        setTimeout(() => {
          const enemyDamage = Math.max(1, enemy.attack - 5)
          const newPlayerHp = Math.max(0, playerHp - enemyDamage)
          setPlayerHp(newPlayerHp)
          setBattleState(prev => ({
            ...prev,
            message: `${enemyDamage}のダメージを受けた！`,
          }))

          // プレイヤーのHPが0になった場合
          if (newPlayerHp === 0) {
            setTimeout(() => {
              setBattleState(prev => ({
                ...prev,
                isBattleEnd: true,
                isVictory: false,
                message: 'あなたは力尽きた...',
              }))
              setShowEndMessage(true)
              onBattleEnd(false, 0, 0)
            }, 1000)
            return
          }

          // 次のターンへ
          setTimeout(() => {
            setBattleState(prev => ({
              ...prev,
              isPlayerTurn: true,
              isAttacking: false,
              message: 'コマンドを選択してください',
            }))
            setIsEscaping(false)
          }, 1000)
        }, 1000)
      }
    }, 1000)
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-900 text-white">
      {/* ステータス表示 */}
      <div className="flex justify-between p-4">
        <div>
          <p>あなた</p>
          <div className="h-4 sm:w-64 w-36 bg-gray-700 rounded">
            <div
              className="h-full bg-green-500 rounded"
              style={{ width: `${(playerHp / 100) * 100}%` }}
            />
          </div>
          <p>HP: {playerHp}/100</p>
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
      <div className="flex-1 flex items-center justify-center">
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
      <div className={`grid grid-cols-2 gap-4 p-4 ${(battleState.isPlayerTurn && !battleState.isAttacking && !showEndMessage && !isEscaping) ? '' : 'invisible'}`}>
        <button
          onClick={handleAttack}
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