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
      />
    )
  }

  return (
    <div className="relative flex size-full items-center justify-center">
      <div className="fixed inset-0 bg-gray-900" />

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

      <TouchControls onMove={handleMove} onInteract={handleInteract} onMenu={() => setShowCommandMenu(true)} />
      {showPopup && <Popup content={popupContent} onClose={() => setShowPopup(false)} />}
      {showCommandMenu && <CommandMenu onClose={() => setShowCommandMenu(false)} />}
    </div>
  )
} 