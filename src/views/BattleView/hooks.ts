import { useState, useCallback, useEffect } from 'react'
import { Enemy, BattleResult } from '../../types/enemy'
import { useAtom } from 'jotai'
import { playerStatusAtom } from '../../store/player'
import { BattleCommand, BattleState, Spell } from '../../types/battle'

// 定数
const ESCAPE_CHANCE = 0.1
const ANIMATION_DURATION = 800
const SWORD_ANIMATION_DURATION = 800

export const useBattleLogic = (enemy: Enemy, onBattleEnd: (result: BattleResult) => void, playerHp: number, setPlayerHp: (hp: number) => void) => {
  const [playerStatus] = useAtom(playerStatusAtom)
  const [enemyHp, setEnemyHp] = useState(enemy.hp)
  const [battleState, setBattleState] = useState<BattleState>({
    isPlayerTurn: true,
    isAttacking: false,
    isVictory: false,
    message: `${enemy.name}が現れた！`,
    phase: 'initial',
    isBattleEnd: false,
  })
  const [showEndMessage, setShowEndMessage] = useState(false)
  const [isEnemyDamaged, setIsEnemyDamaged] = useState(false)
  const [isPlayerDamaged, setIsPlayerDamaged] = useState(false)
  const [showSpellSelect, setShowSpellSelect] = useState(false)
  const [showItemSelect, setShowItemSelect] = useState(false)
  const [showCommandMenu, setShowCommandMenu] = useState(false)

  // バトル開始時のメッセージ表示後にコマンドメニューを表示
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCommandMenu(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleVictory = useCallback(() => {
    setBattleState(prev => ({
      ...prev,
      isVictory: true,
      message: `${enemy.name}をやっつけた！`,
    }))
    setShowEndMessage(true)
    setTimeout(() => {
      onBattleEnd({
        isVictory: true,
        isEscaped: false,
        exp: enemy.exp,
        gold: enemy.gold,
      })
    }, 2000)
  }, [enemy, onBattleEnd])

  const handleDefeat = useCallback(() => {
    setBattleState(prev => ({
      ...prev,
      isVictory: false,
      message: 'あなたは力尽きた...',
    }))
    setShowEndMessage(true)
    setTimeout(() => {
      onBattleEnd({
        isVictory: false,
        isEscaped: false,
        exp: 0,
        gold: 0,
      })
    }, 2000)
  }, [onBattleEnd])

  const startAttackAnimation = useCallback(() => {
    setBattleState(prev => ({
      ...prev,
      isAttacking: true,
      isPlayerTurn: false,
    }))
  }, [])

  const handleEnemyAttack = useCallback(() => {
    const damage = Math.max(1, enemy.attack - playerStatus.defense)
    setBattleState(prev => ({
      ...prev,
      message: `${enemy.name}の攻撃！`,
    }))

    setTimeout(() => {
      setBattleState(prev => ({
        ...prev,
        message: `${damage}のダメージ！`,
      }))
      setPlayerHp(Math.max(0, playerHp - damage))
      setIsPlayerDamaged(true)
      setTimeout(() => {
        setIsPlayerDamaged(false)
        if (playerHp <= damage) {
          handleDefeat()
        } else {
          setShowEndMessage(false)
          setBattleState(prev => ({
            ...prev,
            isPlayerTurn: true,
            isAttacking: false,
            phase: 'initial',
          }))
        }
      }, ANIMATION_DURATION)
    }, ANIMATION_DURATION)
  }, [enemy.attack, enemy.name, playerStatus.defense, setPlayerHp, playerHp, handleDefeat])

  const applyDamageToEnemy = useCallback((damage: number) => {
    setEnemyHp(prev => Math.max(0, prev - damage))
    setIsEnemyDamaged(true)
    setBattleState(prev => ({
      ...prev,
      message: `${enemy.name}に${damage}のダメージ！`,
    }))

    setTimeout(() => {
      setIsEnemyDamaged(false)
      if (enemyHp <= damage) {
        handleVictory()
      } else {
        handleEnemyAttack()
      }
    }, ANIMATION_DURATION)
  }, [enemy.name, enemyHp, handleVictory, handleEnemyAttack])

  const handlePlayerAttack = useCallback(() => {
    const damage = Math.max(1, playerStatus.attack - enemy.defense)
    setBattleState(prev => ({
      ...prev,
      message: `攻撃！`,
    }))

    setTimeout(() => {
      applyDamageToEnemy(damage)
    }, SWORD_ANIMATION_DURATION)
  }, [playerStatus.attack, enemy.defense, applyDamageToEnemy])

  const handleCommandSelect = useCallback((command: BattleCommand) => {
    switch (command) {
      case 'fight':
        setBattleState(prev => ({
          ...prev,
          phase: 'action',
        }))
        break
      case 'run':
        setShowEndMessage(true)
        setBattleState(prev => ({
          ...prev,
          message: '逃げ出そうとしている...',
        }))
        setTimeout(() => {
          if (Math.random() < ESCAPE_CHANCE) {
            setBattleState(prev => ({
              ...prev,
              message: '逃げ出した！',
            }))
            setTimeout(() => {
              onBattleEnd({
                isVictory: false,
                isEscaped: true,
                exp: 0,
                gold: 0,
              })
            }, 1000)
          } else {
            setBattleState(prev => ({
              ...prev,
              message: '逃げ出せなかった！',
            }))
            setTimeout(() => {
              handleEnemyAttack()
            }, 1000)
          }
        }, 1000)
        break
      case 'attack':
        startAttackAnimation()
        handlePlayerAttack()
        break
      case 'spell':
        setShowSpellSelect(true)
        break
      case 'item':
        setShowItemSelect(true)
        break
      case 'back':
        setBattleState(prev => ({
          ...prev,
          phase: 'initial',
        }))
        break
    }
  }, [handleEnemyAttack, handlePlayerAttack, onBattleEnd, startAttackAnimation])

  const handleSpellSelect = useCallback((spell: Spell) => {
    if (playerStatus.mp < spell.mp) {
      setBattleState(prev => ({
        ...prev,
        message: 'MPが足りない！',
      }))

      return
    }

    if (spell.effect.type === 'damage') {
      startAttackAnimation()
      const damage = spell.effect.value
      setBattleState(prev => ({
        ...prev,
        message: `${spell.name}！`,
      }))

      setTimeout(() => {
        applyDamageToEnemy(damage)
      }, SWORD_ANIMATION_DURATION)
    } else if (spell.effect.type === 'heal') {
      const heal = spell.effect.value
      setPlayerHp(Math.min(playerStatus.maxHp, playerHp + heal))
      setBattleState(prev => ({
        ...prev,
        message: `${spell.name}！HPが${heal}回復した！`,
      }))
      handleEnemyAttack()
    }
  }, [handleEnemyAttack, playerHp, playerStatus.maxHp, playerStatus.mp, setPlayerHp, startAttackAnimation, applyDamageToEnemy])

  return {
    enemyHp,
    battleState,
    showEndMessage,
    isEnemyDamaged,
    isPlayerDamaged,
    showSpellSelect,
    showItemSelect,
    showCommandMenu,
    handleCommandSelect,
    handleSpellSelect,
    setShowSpellSelect,
    setShowItemSelect,
    startAttackAnimation,
  }
} 