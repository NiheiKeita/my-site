import { useState, useCallback, useEffect, useRef } from 'react'
import { Enemy, BattleResult } from '../../types/enemy'
import { useAtom } from 'jotai'
import { playerStatusAtom } from '../../store/player'
import { bagItemsAtom } from '../../store/bag'
import { BattleCommand, BattleState, Spell } from '../../types/battle'
import { items } from '../../data/items'
import { ANIMATION_DURATION, SWORD_ANIMATION_DURATION, ESCAPE_CHANCE } from '~/data/constants'


export const useBattleLogic = (enemy: Enemy, onBattleEnd: (result: BattleResult) => void) => {
  const [playerStatus] = useAtom(playerStatusAtom)
  const [bagItems, setBagItems] = useAtom(bagItemsAtom)
  const [playerHp, setPlayerHp] = useState(playerStatus.hp)
  const [playerMp, setPlayerMp] = useState(playerStatus.mp)
  const currentMp = useRef(playerStatus.mp)
  const currentHp = useRef(playerStatus.hp)
  const [enemyHp, setEnemyHp] = useState(enemy.hp)
  const [battleState, setBattleState] = useState<BattleState>({
    isPlayerTurn: true,
    isAttacking: false,
    isHealing: false,
    isVictory: false,
    message: `${enemy.name}が現れた！`,
    phase: 'initial',
    isBattleEnd: false,
  })
  const [showEndMessage, setShowEndMessage] = useState(true)
  const [isEnemyDamaged, setIsEnemyDamaged] = useState(false)
  const [isPlayerDamaged, setIsPlayerDamaged] = useState(false)

  // バトル開始時のメッセージ表示後にコマンドメニューを表示
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEndMessage(false)
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
        hp: currentHp.current,
        mp: currentMp.current,
      })
    }, 2000)
  }, [enemy, onBattleEnd, currentHp, currentMp])

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
        hp: currentHp.current,
        mp: currentMp.current,
      })
    }, 2000)
  }, [onBattleEnd, currentHp, currentMp])

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
      currentHp.current = Math.max(0, currentHp.current - damage)
      setPlayerHp(currentHp.current)
      setIsPlayerDamaged(true)
      setTimeout(() => {
        setIsPlayerDamaged(false)
        if (currentHp.current <= 0) {
          handleDefeat()
        } else {
          setShowEndMessage(false)
          setBattleState(prev => ({
            ...prev,
            isPlayerTurn: true,
            isAttacking: false,
            isHealing: false,
            phase: 'initial',
          }))
        }
      }, ANIMATION_DURATION)
    }, ANIMATION_DURATION)
  }, [enemy.attack, enemy.name, playerStatus.defense, setPlayerHp, currentHp, handleDefeat])

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


  const handleSpellSelect = useCallback((spell: Spell) => {
    setShowEndMessage(true)
    if (currentMp.current < spell.mp) {
      setBattleState(prev => ({
        ...prev,
        message: 'MPが足りない！',
        isAttacking: false,
        isHealing: true,
        isPlayerTurn: true,
      }))
      setTimeout(() => {
        setShowEndMessage(false)
        setBattleState(prev => ({
          ...prev,
          message: '',
          isAttacking: false,
          isHealing: false,
          isPlayerTurn: true,
        }))
      }, ANIMATION_DURATION)

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
        currentMp.current = Math.max(0, currentMp.current - spell.mp)
        setPlayerMp(currentMp.current)
        if (enemy.id === 7) {
          // メタルラーメは０ダメージ
          applyDamageToEnemy(0)
        } else {
          applyDamageToEnemy(damage)
        }
      }, SWORD_ANIMATION_DURATION)
    } else if (spell.effect.type === 'heal') {
      const heal = spell.effect.value
      setBattleState(prev => ({
        ...prev,
        message: `${spell.name}！`,
        isAttacking: false,
        isHealing: true,
        isPlayerTurn: true,
      }))
      setTimeout(() => {
        currentHp.current = Math.min(playerStatus.maxHp, currentHp.current + heal)
        currentMp.current = Math.max(0, currentMp.current - spell.mp)
        setPlayerHp(currentHp.current)
        setPlayerMp(currentMp.current)
        setBattleState(prev => ({
          ...prev,
          message: `HPが${heal}回復した！`,
        }))
        setTimeout(() => {
          handleEnemyAttack()
        }, ANIMATION_DURATION)
      }, ANIMATION_DURATION)
    }
  }, [handleEnemyAttack, playerStatus.maxHp, currentHp, startAttackAnimation, applyDamageToEnemy])

  const handleItemUse = useCallback((itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (!item || !item.effect) return false

    // アイテムの効果を適用
    if (item.effect.hp) {
      setShowEndMessage(true)
      const heal = item.effect.hp
      currentHp.current = Math.min(playerStatus.maxHp, currentHp.current + heal)
      setPlayerHp(currentHp.current)
      setBattleState(prev => ({
        ...prev,
        message: `${item.name}を使用した！HPが${heal}回復した！`,
        isHealing: true,
      }))

      // アイテムを消費
      if (item.consumable) {
        const newBagItems = bagItems.filter(id => id !== itemId)
        setBagItems(newBagItems)
      }

      // 敵の攻撃
      setTimeout(() => {
        handleEnemyAttack()
      }, ANIMATION_DURATION)

      return true
    } else {
      setShowEndMessage(true)
      setBattleState(prev => ({
        ...prev,
        message: `${item.name}を使用しても効果がない・・・`,
      }))
      // 敵の攻撃
      setTimeout(() => {
        setShowEndMessage(false)
      }, ANIMATION_DURATION)
    }

    return false
  }, [playerStatus.maxHp, handleEnemyAttack, bagItems, setBagItems])

  const handleCommandSelect = useCallback((command: BattleCommand, spell?: Spell, itemId?: string) => {
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
                hp: currentHp.current,
                mp: currentMp.current,
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
        setShowEndMessage(true)
        startAttackAnimation()
        handlePlayerAttack()
        break
      case 'spell':
        if (!spell) return
        handleSpellSelect(spell)
        break
      case 'item':
        if (!itemId) return
        handleItemUse(itemId)
        break
      case 'back':
        setBattleState(prev => ({
          ...prev,
          phase: 'initial',
        }))
        break
    }
  }, [handleEnemyAttack, handlePlayerAttack, handleSpellSelect, handleItemUse, onBattleEnd, startAttackAnimation, currentHp, currentMp])


  return {
    enemyHp,
    battleState,
    showEndMessage,
    isEnemyDamaged,
    isPlayerDamaged,
    handleCommandSelect,
    playerHp,
    playerMp
  }
} 