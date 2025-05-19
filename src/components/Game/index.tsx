'use client'

import { useEffect, useState, useCallback, ReactNode } from 'react'
import { Character } from '../Character'
import { Map, calculateGridSize } from '../Map'
import { TouchControls } from '../TouchControls'
import { Popup } from '../Popup'
import { GameObject } from '../GameObject'
import { CommandMenu } from '../CommandMenu'
import { BattleView } from '../../views/BattleView'
import { enemies } from '../../data/enemies'
import { useAtom, useSetAtom } from 'jotai'
import { playerStatusAtom, updatePlayerStatusAtom } from '../../store/player'
import { Enemy, BattleResult } from '../../types/enemy'
import { MapData } from '../../types/game'
import { maps } from '../../constants/maps'

interface Position {
  x: number
  y: number
}

export const Game = () => {
  const [playerStatus, setPlayerStatus] = useAtom(playerStatusAtom)
  const updatePlayerStatus = useSetAtom(updatePlayerStatusAtom)
  const [isInBattle, setIsInBattle] = useState(false)
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null)
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 4, y: 4 })
  const [playerDirection, setPlayerDirection] = useState<'up' | 'down' | 'left' | 'right'>('down')
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState<ReactNode>('')
  const [gridSize, setGridSize] = useState(48)
  const [showCommandMenu, setShowCommandMenu] = useState(false)
  const [currentMap, setCurrentMap] = useState<MapData>(maps[0])

  // const androidApps = [
  //   { id: 1, name: 'ひたすら因数分解', url: "https://play.google.com/store/apps/details?id=com.iggyapp.insuubunkai&hl=ja", },
  //   { id: 2, name: 'ひたすら積分', url: "https://play.google.com/store/apps/details?id=com.iggyapp.sekibunn&hl=ja", },
  //   { id: 3, name: 'ひたすら微分', url: "https://play.google.com/store/apps/details?id=com.iggyapp.bibunn&hl=ja", },
  //   { id: 4, name: 'ひたすら素因数分解', url: "https://play.google.com/store/apps/details?id=com.iggyapp.soinnsuubunnkai&hl=ja", },
  //   { id: 5, name: '鬼封じの縄', url: "https://play.google.com/store/apps/details?id=com.iggy.catchthedemon&hl=ja", },
  // ]
  // const [gameObjects] = useState<GameObjectData[]>([
  //   {
  //     type: 'pot',
  //     position: { x: 2, y: 2 },
  //     message: (
  //       <div className="text-gray-300">
  //         <p className="text-lg mb-2">✨ Androidアプリを見つけた ✨</p>
  //         {
  //           androidApps.map((app) => {
  //             return (
  //               <div className="text-yellow-300" key={app.id}>
  //                 <a
  //                   href={app.url}
  //                   target="_blank"
  //                   rel="noopener noreferrer"
  //                   className="mb-2 block hover:underline"
  //                 >
  //                   {app.name}
  //                 </a>
  //               </div>
  //             )
  //           })}
  //       </div>
  //     )
  //   },
  //   {
  //     type: 'pot',
  //     position: { x: 5, y: 2 },
  //     message: (
  //       <div className="text-yellow-300">
  //         <p className="text-lg mb-2">✨ 光る壺 ✨</p>
  //         <p>壺の中に何かが入っている気がする...</p>
  //       </div>
  //     )
  //   },
  //   {
  //     type: 'chest',
  //     position: { x: 2, y: 5 },
  //     message: (
  //       <div className="text-gray-300">
  //         <p className="text-lg mb-2">宝箱</p>
  //         <p>宝箱は固く閉ざされている。</p>
  //       </div>
  //     )
  //   },
  //   {
  //     type: 'chest',
  //     position: { x: 5, y: 5 },
  //     message: (
  //       <div className="text-yellow-300">
  //         <p className="text-lg mb-2">✨ 輝く宝箱 ✨</p>
  //         <p>宝箱の中から光が漏れている...</p>
  //       </div>
  //     )
  //   },
  //   {
  //     type: 'fountain',
  //     position: { x: 0, y: 0 },
  //     message: (
  //       <div className="text-blue-300">
  //         <p className="text-lg mb-2">💫 神秘の泉 💫</p>
  //         <p>神秘的な力が宿る泉だ。</p>
  //         <p className="text-sm mt-2">HPが全回復するかもしれない...</p>
  //       </div>
  //     )
  //   },
  //   {
  //     type: 'stairs',
  //     position: { x: 7, y: 7 },
  //     message: (
  //       <div className="text-gray-300">
  //         <p className="text-lg mb-2">下へ続く階段</p>
  //         <p>下の階へ続く階段がある。</p>
  //       </div>
  //     ),
  //     direction: 'down'
  //   }
  // ])

  // グリッドサイズの更新
  useEffect(() => {
    const updateGridSize = () => {
      setGridSize(calculateGridSize(currentMap.width, currentMap.height))
    }

    // 初期サイズを計算
    updateGridSize()

    // リサイズイベントのリスナーを追加
    window.addEventListener('resize', updateGridSize)

    // クリーンアップ
    return () => window.removeEventListener('resize', updateGridSize)
  }, [currentMap])

  // // ランダムエンカウントの処理
  // useEffect(() => {
  //   if (isInBattle) return

  //   const handleMove = () => {
  //     // 10%の確率でエンカウント
  //     if (Math.random() < 0.1) {
  //       const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)]
  //       setCurrentEnemy(randomEnemy)
  //       setIsInBattle(true)
  //     }
  //   }

  //   window.addEventListener('keydown', handleMove)
  //   return () => window.removeEventListener('keydown', handleMove)
  // }, [isInBattle])

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    // ポップアップ表示中またはコマンドメニュー表示中は移動しない
    if (showPopup || showCommandMenu) return

    setPlayerDirection(direction)
    const newPosition = { ...playerPosition }

    switch (direction) {
      case 'up':
        newPosition.y = Math.max(0, playerPosition.y - 1)
        break
      case 'down':
        newPosition.y = Math.min(currentMap.height - 1, playerPosition.y + 1)
        break
      case 'left':
        newPosition.x = Math.max(0, playerPosition.x - 1)
        break
      case 'right':
        newPosition.x = Math.min(currentMap.width - 1, playerPosition.x + 1)
        break
    }

    // オブジェクトとの衝突チェック
    const isCollision = currentMap.gameObjects.some(
      (obj) => obj.position.x === newPosition.x && obj.position.y === newPosition.y &&
        obj.type !== 'fountain' && obj.type !== 'stairs'
    )

    // 衝突している場合は、元の位置に戻す
    if (isCollision) {
      newPosition.x = playerPosition.x
      newPosition.y = playerPosition.y
    }

    // 位置を更新してアニメーションを表示
    setPlayerPosition(newPosition)

    // 回復の泉に乗った時の処理
    const fountain = currentMap.gameObjects.find(
      (obj) => obj.position.x === newPosition.x && obj.position.y === newPosition.y && obj.type === 'fountain'
    )
    if (fountain && playerStatus.hp < playerStatus.maxHp) {
      setPlayerStatus(prev => ({ ...prev, hp: prev.maxHp }))
      setPopupContent('HPが全回復した！')
      setShowPopup(true)
    }

    // 階段に乗った時の処理
    const stairs = currentMap.gameObjects.find(
      (obj) => obj.position.x === newPosition.x && obj.position.y === newPosition.y && obj.type === 'stairs'
    )
    if (stairs) {
      // 階段を降りる/登る処理
      if (stairs.direction === 'down' && currentMap.stairs?.down) {
        const nextMap = maps.find(map => map.id === currentMap.stairs?.down?.mapId)
        if (nextMap) {
          setCurrentMap(nextMap)
          setPlayerPosition(currentMap.stairs.down.position)
        }
      } else if (stairs.direction === 'up' && currentMap.stairs?.up) {
        const prevMap = maps.find(map => map.id === currentMap.stairs?.up?.mapId)
        if (prevMap) {
          setCurrentMap(prevMap)
          setPlayerPosition(currentMap.stairs.up.position)
        }
      }
    }

    // 25分の1の確率でランダムなメッセージを表示
    if (Math.random() < 0.01) {
      if (isInBattle) return
      const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)]
      setCurrentEnemy(randomEnemy)
      setIsInBattle(true)
    }
  }, [playerPosition, showPopup, showCommandMenu, currentMap, isInBattle, playerStatus])

  const handleInteract = useCallback(() => {
    // ポップアップ表示中はインタラクションしない
    if (showPopup) return

    const frontPosition = { ...playerPosition }
    switch (playerDirection) {
      case 'up':
        frontPosition.y -= 1
        break
      case 'down':
        frontPosition.y += 1
        break
      case 'left':
        frontPosition.x -= 1
        break
      case 'right':
        frontPosition.x += 1
        break
    }

    const object = currentMap.gameObjects.find(
      obj => obj.position.x === frontPosition.x && obj.position.y === frontPosition.y
    )

    if (object) {
      // オブジェクトのメッセージを表示
      setPopupContent(object.message)
      setShowPopup(true)
    } else {
      // オブジェクトがない場合はコマンドメニューを表示
      setShowCommandMenu(true)
    }
  }, [playerPosition, playerDirection, showPopup, currentMap])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          handleMove('up')
          break
        case 'ArrowDown':
          handleMove('down')
          break
        case 'ArrowLeft':
          handleMove('left')
          break
        case 'ArrowRight':
          handleMove('right')
          break
        case 'z':
          handleInteract()
          break
        case 'Enter':
          if (showPopup) {
            setShowPopup(false)
          } else if (showCommandMenu) {
            setShowCommandMenu(false)
          } else {
            handleInteract()
          }
          break
        case 'Escape':
          if (showCommandMenu) {
            setShowCommandMenu(false)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [playerPosition, showPopup, showCommandMenu, handleMove, handleInteract])

  const handleBattleEnd = (result: BattleResult) => {
    if (result.isVictory) {
      updatePlayerStatus({
        exp: playerStatus.exp + result.exp,
        gold: playerStatus.gold + result.gold,
      })
    } else {
      setPlayerStatus(prev => ({ ...prev, hp: prev.maxHp }))
    }
    setIsInBattle(false)
    setCurrentEnemy(null)
  }

  if (isInBattle && currentEnemy !== null) {
    return <BattleView
      enemy={currentEnemy}
      onBattleEnd={handleBattleEnd}
      playerHp={playerStatus.hp}
      setPlayerHp={(hp: number) => setPlayerStatus(prev => ({ ...prev, hp }))}
    />
  }

  return (
    <div className="relative flex size-full items-center justify-center">
      <div className="fixed inset-0 bg-gray-900" />
      {/* ステータス表示 */}
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
          <Map width={currentMap.width} height={currentMap.height} />
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