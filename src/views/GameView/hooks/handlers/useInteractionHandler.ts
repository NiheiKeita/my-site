import { ReactNode, useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { currentMapAtom } from '~/store/currentMap'
import { addBagItemAtom, addPickedItemAtom, bagItemsAtom } from '~/store/bag'
import { items } from '~/data/items'
import type { GameObjectData, Position } from '~/types/game'
import type { GameSend, GameState } from '../types'
import { addOpenedChestAtom } from '~/store/chest'
import { ANIMATION_DURATION } from '~/data/constants'
import { enemies } from '~/data/enemies'

const directionOffsets: Record<GameState['context']['playerDirection'], Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const toNextPosition = (direction: GameState['context']['playerDirection'], position: Position) => ({
  x: position.x + directionOffsets[direction].x,
  y: position.y + directionOffsets[direction].y,
})

const isSamePosition = (a: Position, b: Position) => a.x === b.x && a.y === b.y

export const useInteractionHandler = (
  state: GameState,
  send: GameSend,
  playerPosition: Position
) => {
  const [currentMap] = useAtom(currentMapAtom)
  const addBagItem = useSetAtom(addBagItemAtom)
  const addPickedItem = useSetAtom(addPickedItemAtom)
  const [bagItems, setBagItems] = useAtom(bagItemsAtom)
  const addOpenedChest = useSetAtom(addOpenedChestAtom)

  const showPopup = useCallback((content: ReactNode) => {
    send({ type: 'SHOW_POPUP', content })
  }, [send])

  const getObjectAt = useCallback((position: Position) => {
    return currentMap.gameObjects.find(obj => isSamePosition(obj.position, position))
  }, [currentMap.gameObjects])

  const startBattle = useCallback((gameObject: GameObjectData) => {
    showPopup(gameObject.message)
    setTimeout(() => {
      const enemy = enemies.find(candidate => candidate.id === gameObject.enemyId)
      if (!enemy) return
      send({ type: 'ENTER_BATTLE', enemy })
    }, ANIMATION_DURATION)
  }, [send, showPopup])

  const openChest = useCallback((gameObject: GameObjectData) => {
    gameObject.contents?.forEach(content => {
      const item = items.find(candidate => candidate.id === content.itemId)
      if (!item) return

      setBagItems(prev => [...prev, item.id])
      showPopup(`${item.name}を${content.quantity}個手に入れた！`)
    })

    addOpenedChest({
      mapId: currentMap.id,
      objectId: gameObject.id,
    })
  }, [addOpenedChest, currentMap.id, setBagItems, showPopup])

  const handleChestOpen = useCallback((gameObject: GameObjectData) => {
    if (gameObject.isOpened) {
      showPopup('この宝箱は既に開けられている')

      return
    }

    if (gameObject.requiredKey) {
      const ownsKey = bagItems.some(item => item === gameObject.requiredKey)

      if (!ownsKey) {
        showPopup(gameObject.message)

        return
      }
    }

    if (gameObject.contents) {
      openChest(gameObject)
    }
  }, [bagItems, openChest, showPopup])

  const pickUpItemName = useCallback((gameObject: GameObjectData) => {
    const item = items.find(candidate => candidate.id === gameObject.itemId)
    if (!item) return

    showPopup(`${item.name}を拾った`)
    addBagItem(item.id)
    addPickedItem({
      mapId: currentMap.id,
      objectId: gameObject.id,
    })
  }, [addBagItem, addPickedItem, currentMap.id, showPopup])

  const handleInteract = useCallback(() => {
    if (state.context.showPopup) return

    const frontPosition = toNextPosition(state.context.playerDirection, playerPosition)
    const objectAhead = frontPosition ? getObjectAt(frontPosition) : undefined
    const objectAtPlayer = getObjectAt(playerPosition)

    if (objectAtPlayer?.type === 'item') {
      pickUpItemName(objectAtPlayer)

      return
    }

    if (!objectAhead) return

    switch (objectAhead.type) {
      case 'chest':
        handleChestOpen(objectAhead)
        break
      case 'enemy':
        startBattle(objectAhead)
        break
      default:
        showPopup(objectAhead.message)
        break
    }
  }, [
    state.context.playerDirection,
    state.context.showPopup,
    playerPosition,
    getObjectAt,
    pickUpItemName,
    handleChestOpen,
    startBattle,
    showPopup,
  ])

  return {
    handleInteract,
    pickUpItemName,
  }
}
