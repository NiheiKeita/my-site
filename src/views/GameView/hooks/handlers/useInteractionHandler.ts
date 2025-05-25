import React, { useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { currentMapAtom } from '~/store/currentMap'
import { addBagItemAtom, addPickedItemAtom } from '~/store/bag'
import { items } from '~/data/items'
import type { GameObjectData } from '~/types/game'
import type { GameState } from '../types'

export const useInteractionHandler = (
  state: GameState,
  dispatch: React.Dispatch<any>,
  playerPosition: { x: number; y: number }
) => {
  const [currentMap] = useAtom(currentMapAtom)
  const addBagItem = useSetAtom(addBagItemAtom)
  const addPickedItem = useSetAtom(addPickedItemAtom)

  const pickUpItemName = useCallback((nowObject: GameObjectData) => {
    const item = items.find(item => item.id === nowObject.itemId)
    if (!item) return
    dispatch({ type: 'SHOW_POPUP', payload: `${item.name}を拾った` })
    addBagItem(item.id)
    addPickedItem({
      mapId: currentMap.id,
      objectId: nowObject.id
    })
  }, [addBagItem, addPickedItem, currentMap.id, dispatch])

  const handleInteract = useCallback(() => {
    if (state.showPopup) return

    const frontPosition = { ...playerPosition }
    switch (state.playerDirection) {
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
    const nowObject = currentMap.gameObjects.find(
      obj => obj.position.x === playerPosition.x && obj.position.y === playerPosition.y
    )

    if (nowObject?.type === 'item') {
      pickUpItemName(nowObject)
    } else if (object) {
      dispatch({ type: 'SHOW_POPUP', payload: object.message })
    }
  }, [state.showPopup, state.playerDirection, playerPosition, currentMap.gameObjects, pickUpItemName, dispatch])

  return {
    handleInteract,
    pickUpItemName
  }
} 