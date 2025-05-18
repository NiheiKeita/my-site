'use client'

import { useState, useEffect, useCallback } from 'react'
import { Enemy, BattleResult, BattleState } from '../../types/enemy'
import { getImagePath } from '../../utils/imagePath'
import { motion } from 'framer-motion'

// 定数
const INITIAL_PLAYER_HP = 100
const ESCAPE_CHANCE = 0.5
const ANIMATION_DURATION = {
  ATTACK: 1000,
  DAMAGE: 300,
  MESSAGE: 1000,
  BATTLE_END: 2000,
}

// バトルロジック
const useBattleLogic = (enemy: Enemy, onBattleEnd: (result: BattleResult) => void, playerHp: number, setPlayerHp: (hp: number) => void) => {
  const [enemyHp, setEnemyHp] = useState(enemy.hp)
  const [battleState, setBattleState] = useState<BattleState>({
    isPlayerTurn: true,
    isAttacking: false,
    message: `${enemy.name}が現れた！`,
    isBattleEnd: false,
    isVictory: false,
  })
  const [showEndMessage, setShowEndMessage] = useState(false)
  const [isEnemyDamaged, setIsEnemyDamaged] = useState(false)
  const [isEscaping, setIsEscaping] = useState(false)
  const [isEnemyAppeared, setIsEnemyAppeared] = useState(true)
  const [isPlayerDamaged, setIsPlayerDamaged] = useState(false)

  const updateBattleState = (updates: Partial<BattleState>) => {
    setBattleState(prev => ({ ...prev, ...updates }))
  }

  const handleNextTurn = useCallback(() => {
    setTimeout(() => {
      updateBattleState({
        isPlayerTurn: true,
        isAttacking: false,
        message: 'コマンドを選択してください',
      })
      setIsEscaping(false)
    }, ANIMATION_DURATION.MESSAGE)
  }, [])

  const handleVictory = useCallback(() => {
    setTimeout(() => {
      updateBattleState({
        isBattleEnd: true,
        isVictory: true,
        message: `${enemy.name}をやっつけた！`,
      })
      setShowEndMessage(true)
      setTimeout(() => {
        onBattleEnd({ isVictory: true, exp: enemy.exp, gold: enemy.gold })
      }, ANIMATION_DURATION.BATTLE_END)
    }, ANIMATION_DURATION.MESSAGE)
  }, [enemy, onBattleEnd])

  const handleDefeat = useCallback(() => {
    setTimeout(() => {
      updateBattleState({
        isBattleEnd: true,
        isVictory: false,
        message: 'あなたは力尽きた...',
      })
      setShowEndMessage(true)
      onBattleEnd({ isVictory: false, exp: 0, gold: 0 })
    }, ANIMATION_DURATION.MESSAGE)
  }, [onBattleEnd])

  const handleEnemyAttack = useCallback(() => {
    setTimeout(() => {
      updateBattleState({
        isPlayerTurn: false,
        message: `${enemy.name}の攻撃！`,
      })

      setTimeout(() => {
        const enemyDamage = Math.max(1, enemy.attack - 5)
        const newPlayerHp = Math.max(0, playerHp - enemyDamage)
        setPlayerHp(newPlayerHp)
        setIsPlayerDamaged(true)
        updateBattleState({ message: `${enemyDamage}のダメージを受けた！` })

        setTimeout(() => {
          setIsPlayerDamaged(false)
        }, ANIMATION_DURATION.DAMAGE)

        if (newPlayerHp === 0) {
          handleDefeat()

          return
        }

        handleNextTurn()
      }, ANIMATION_DURATION.ATTACK)
    }, ANIMATION_DURATION.MESSAGE)
  }, [enemy, playerHp, handleDefeat, handleNextTurn])

  const handleEscapeFailure = useCallback(() => {
    updateBattleState({ message: '逃げ出せなかった！' })
    setTimeout(() => {
      handleEnemyAttack()
    }, ANIMATION_DURATION.MESSAGE)
  }, [handleEnemyAttack])

  const handleEscapeSuccess = useCallback(() => {
    updateBattleState({
      isBattleEnd: true,
      isVictory: false,
      message: '逃げ出した！',
    })
    setShowEndMessage(true)
    setTimeout(() => {
      onBattleEnd({ isVictory: false, exp: 0, gold: 0 })
    }, ANIMATION_DURATION.BATTLE_END)
  }, [onBattleEnd])

  const handlePlayerAttack = useCallback(() => {
    if (!battleState.isPlayerTurn || battleState.isAttacking) return

    updateBattleState({ isAttacking: true, message: '攻撃！' })

    setTimeout(() => {
      const damage = Math.max(1, 20 - enemy.defense)
      const newEnemyHp = Math.max(0, enemyHp - damage)
      setEnemyHp(newEnemyHp)
      setIsEnemyDamaged(true)
      updateBattleState({ message: `${enemy.name}に${damage}のダメージ！` })

      setTimeout(() => setIsEnemyDamaged(false), ANIMATION_DURATION.DAMAGE)

      if (newEnemyHp === 0) {
        handleVictory()

        return
      }

      handleEnemyAttack()
    }, ANIMATION_DURATION.ATTACK)
  }, [battleState.isPlayerTurn, battleState.isAttacking, enemy, enemyHp, handleEnemyAttack, handleVictory])

  const handleEscape = useCallback(() => {
    if (!battleState.isPlayerTurn || battleState.isAttacking || isEscaping) return

    setIsEscaping(true)
    updateBattleState({ message: '逃げ出そうとしている...' })

    const isEscaped = Math.random() < ESCAPE_CHANCE

    setTimeout(() => {
      if (isEscaped) {
        handleEscapeSuccess()
      } else {
        handleEscapeFailure()
      }
    }, ANIMATION_DURATION.ATTACK)
  }, [battleState.isPlayerTurn, battleState.isAttacking, isEscaping, handleEscapeSuccess, handleEscapeFailure])

  useEffect(() => {
    // 敵の出現メッセージの後に戦闘開始メッセージを表示
    const timer = setTimeout(() => {
      updateBattleState({
        message: '戦闘開始！',
      })
      setIsEnemyAppeared(false)
    }, ANIMATION_DURATION.MESSAGE)

    return () => clearTimeout(timer)
  }, [])

  return {
    enemyHp,
    battleState,
    showEndMessage,
    isEnemyDamaged,
    isEscaping,
    isEnemyAppeared,
    isPlayerDamaged,
    handlePlayerAttack,
    handleEscape,
  }
}

interface BattleViewProps {
  enemy: Enemy
  onBattleEnd: (result: BattleResult) => void
  playerHp: number
  setPlayerHp: (hp: number) => void
}

export const BattleView = ({ enemy, onBattleEnd, playerHp, setPlayerHp }: BattleViewProps) => {
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
              style={{ width: `${(playerHp / INITIAL_PLAYER_HP) * 100}%` }}
            />
          </div>
          <p>HP: {playerHp}/{INITIAL_PLAYER_HP}</p>
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