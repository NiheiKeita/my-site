'use client'
import React from 'react'
import { Enemy, BattleResult } from '../../types/enemy'
import { Spell } from '../../types/battle'
import { useAtom } from 'jotai'
import { playerStatusAtom } from '../../store/player'
import { BattleCommandMenu } from '../../components/Battle/BattleCommandMenu'
import { SpellSelect } from '../../components/Battle/SpellSelect'
import { ItemSelect } from '../../components/Battle/ItemSelect'
import { useBattleLogic } from './hooks'
import { getImagePath } from '../../utils/imagePath'
import { motion } from 'framer-motion'

interface BattleViewProps {
  enemy: Enemy
  onBattleEnd: (result: BattleResult) => void
}

export const BattleView = ({ enemy, onBattleEnd }: BattleViewProps) => {
  const [playerStatus] = useAtom(playerStatusAtom)

  const {
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
    playerHp
  } = useBattleLogic(enemy, onBattleEnd)

  const handleSpellSelectWithClose = (spell: Spell) => {
    handleSpellSelect(spell)
    setShowSpellSelect(false)
    if (spell.effect.type === 'damage') {
      startAttackAnimation()
    }
  }

  const handleItemSelectWithClose = (itemId?: string) => {
    setShowItemSelect(false)
    if (itemId && itemId === 'potion') {
      startAttackAnimation()
    }
  }

  const isCommandMenuVisible = showCommandMenu && !showEndMessage && battleState.isPlayerTurn && (!battleState.isAttacking && !battleState.isHealing)

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
          <p>MP: {playerStatus.mp}/{playerStatus.maxMp}</p>
        </div>
        <div>
          <p>{enemy.name} Lv.{enemy.level}</p>
          <div className="h-4 sm:w-64 w-36 bg-gray-700 rounded">
            <div
              className="h-full bg-red-500 rounded"
              style={{ width: `${(enemyHp / enemy.hp) * 100}%` }}
            />
          </div>
          <p>HP: {enemyHp}/{enemy.hp}</p>
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

      {/* コマンド選択 */}
      {isCommandMenuVisible && (
        <div className="p-4">
          <BattleCommandMenu
            playerStatus={playerStatus}
            phase={battleState.phase}
            onCommandSelect={handleCommandSelect}
            onSpellSelect={handleSpellSelectWithClose}
            onItemSelect={handleItemSelectWithClose}
          />
        </div>
      )}

      {/* 呪文選択 */}
      {showSpellSelect && (
        <SpellSelect
          spells={playerStatus.spells}
          onSpellSelect={handleSpellSelectWithClose}
          onClose={() => setShowSpellSelect(false)}
        />
      )}

      {/* アイテム選択 */}
      {showItemSelect && (
        <ItemSelect onClose={handleItemSelectWithClose} />
      )}

      {/* バトルメッセージ */}
      {battleState.message && !isCommandMenuVisible && (
        <div className="h-32 bg-black/80 p-4">
          <p className="text-xl">{battleState.message}</p>
          {showEndMessage && (
            <p className="text-lg mt-2 text-yellow-400 animate-blink">
              {battleState.isVictory
                ? `経験値${enemy.exp}と${enemy.gold}ゴールドを獲得！`
                : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
} 