'use client'

import React, { useState } from 'react'
import { Character } from '~/components/Character'
import { CommandMenu } from '~/components/CommandMenu'
import { GameObject } from '~/components/GameObject'
import { Popup } from '~/components/Popup'
import { TouchControls } from '~/components/TouchControls'
import { BattleView } from '../BattleView'
import { useGameLogic } from './hooks'
import { Map } from '~/components/Map'

export const GameView: React.FC = () => {
  const {
    playerStatus,
    setPlayerStatus,
    isInBattle,
    currentEnemy,
    playerPosition,
    playerDirection,
    showPopup,
    popupContent,
    showCommandMenu,
    currentMap,
    handleMove,
    handleInteract,
    handleBattleEnd,
    setShowPopup,
    setShowCommandMenu,
  } = useGameLogic()

  const [gridSize, setGridSize] = useState(48)

  if (isInBattle && currentEnemy) {
    return (
      <BattleView
        enemy={currentEnemy}
        onBattleEnd={handleBattleEnd}
        playerHp={playerStatus.hp}
        setPlayerHp={(hp) => setPlayerStatus(prev => ({ ...prev, hp }))}
      />
    )
  }

  return (
    <div className="relative flex size-full items-center justify-center">
      <div className="fixed inset-0 bg-gray-900" />
      <div className="fixed left-4 bottom-4 z-2 rounded bg-black/50 p-2 text-white">
        <p>Lv.{playerStatus.level}</p>
        <div className="h-4 sm:w-48 w-36 rounded bg-gray-700">
          <div
            className="h-full rounded bg-green-500"
            style={{ width: `${(playerStatus.hp / playerStatus.maxHp) * 100}%` }}
          />
        </div>
        <p>HP: {playerStatus.hp}/{playerStatus.maxHp}</p>
        <p>EXP: {playerStatus.exp}</p>
        <p>GOLD: {playerStatus.gold}</p>
      </div>

      <div className="fixed inset-0 flex items-start justify-center pt-8">
        <div className="relative">
          <Map
            width={currentMap.width}
            height={currentMap.height}
            onGridSizeChange={setGridSize}
          />
          <div className="absolute inset-0">
            {currentMap.gameObjects.map((obj, index) => (
              <GameObject
                key={`${obj.type}-${index}`}
                object={obj}
                gridSize={gridSize}
              />
            ))}
          </div>
          <Character position={playerPosition} direction={playerDirection} gridSize={gridSize} />
        </div>
      </div>

      <TouchControls onMove={handleMove} onInteract={handleInteract} />
      {showPopup && <Popup content={popupContent} onClose={() => setShowPopup(false)} />}
      {showCommandMenu && <CommandMenu onClose={() => setShowCommandMenu(false)} />}
    </div>
  )
} 