import { useState, useEffect, useCallback } from 'react'
import { Enemy, BattleResult, BattleState } from '../../types/enemy'
import { useAtom } from 'jotai'
import { playerStatusAtom } from '../../store/player'

// 定数
const ESCAPE_CHANCE = 0.3
const ANIMATION_DURATION = {
  ATTACK: 1000,
  DAMAGE: 300,
  MESSAGE: 1000,
  BATTLE_END: 2000,
}

export const useBattleLogic = (enemy: Enemy, onBattleEnd: (result: BattleResult) => void, playerHp: number, setPlayerHp: (hp: number) => void) => {
  const [playerStatus] = useAtom(playerStatusAtom)
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
      setTimeout(() => {
        onBattleEnd({ isVictory: false, exp: 0, gold: 0 })
      }, ANIMATION_DURATION.BATTLE_END)
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
  }, [enemy, playerHp, handleDefeat, handleNextTurn, setPlayerHp])

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
    playerStatus,
  }
} 