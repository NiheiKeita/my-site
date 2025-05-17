'use client'

import { useState, useEffect, useCallback } from 'react'
import { Enemy, BattleState } from '../../types/enemy'
import { getImagePath } from '../../utils/imagePath'

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
      setBattleState(prev => ({
        ...prev,
        message: `${enemy.name}に${damage}のダメージ！`,
      }))

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
          }, 1000)
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
        <img
          src={getImagePath(enemy.image)}
          alt={enemy.name}
          className="size-80 object-contain"
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
      {/* {battleState.isPlayerTurn && !battleState.isAttacking && !showEndMessage && ( */}
      <div className={`grid grid-cols-2 gap-4 p-4 ${(battleState.isPlayerTurn && !battleState.isAttacking && !showEndMessage) ? '' : 'invisible'}`}>
        <button
          onClick={handleAttack}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          たたかう
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          disabled
        >
          にげる
        </button>
      </div>
      {/* )} */}
    </div>
  )
} 