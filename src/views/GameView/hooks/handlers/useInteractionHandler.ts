import { useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { currentMapAtom } from '~/store/currentMap'
import { addBagItemAtom, addPickedItemAtom, bagItemsAtom } from '~/store/bag'
import { items } from '~/data/items'
import type { GameObjectData } from '~/types/game'
import type { GameSend, GameState } from '../types'
import { addOpenedChestAtom } from '~/store/chest'
import { ANIMATION_DURATION } from '~/data/constants'
import { enemies } from '~/data/enemies'

export const useInteractionHandler = (
  state: GameState,
  send: GameSend,
  playerPosition: { x: number; y: number }
) => {
  const [currentMap] = useAtom(currentMapAtom)
  const addBagItem = useSetAtom(addBagItemAtom)
  const addPickedItem = useSetAtom(addPickedItemAtom)
  const [bagItems, setBagItems] = useAtom(bagItemsAtom)
  const addOpenedChest = useSetAtom(addOpenedChestAtom)

  const openChest = useCallback((gameObject: GameObjectData) => {
    gameObject.contents?.forEach(content => {
      const item = items.find(i => i.id === content.itemId)
      if (item) {
        setBagItems(prev => [
          ...prev,
          item.id,
        ])
        send({ type: 'SHOW_POPUP', content: `${item.name}を${content.quantity}個手に入れた！` })
      }
    })
    addOpenedChest({
      mapId: currentMap.id,
      objectId: gameObject.id,
    })
  }, [addOpenedChest, currentMap.id, send, setBagItems])

  const handleChestOpen = useCallback((gameObject: GameObjectData) => {
    if (gameObject.isOpened) {
      send({ type: 'SHOW_POPUP', content: 'この宝箱は既に開けられている' })

      return
    }

    if (gameObject.requiredKey) {
      const hasKey = bagItems.some(item =>
        item === gameObject.requiredKey,
      )

      if (!hasKey) {
        send({ type: 'SHOW_POPUP', content: gameObject.message })

        return
      }
      openChest(gameObject)
    }

    if (gameObject.contents) {
      openChest(gameObject)
    }
  }, [bagItems, openChest, send])

  const pickUpItemName = useCallback((nowObject: GameObjectData) => {
    const item = items.find(item => item.id === nowObject.itemId)
    if (!item) return
    send({ type: 'SHOW_POPUP', content: `${item.name}を拾った` })
    addBagItem(item.id)
    addPickedItem({
      mapId: currentMap.id,
      objectId: nowObject.id,
    })
  }, [addBagItem, addPickedItem, currentMap.id, send])

  const handleInteract = useCallback(() => {
    if (state.context.showPopup) return

    const frontPosition = { ...playerPosition }
    switch (state.context.playerDirection) {
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
      obj => obj.position.x === frontPosition.x && obj.position.y === frontPosition.y,
    )
    const nowObject = currentMap.gameObjects.find(
      obj => obj.position.x === playerPosition.x && obj.position.y === playerPosition.y,
    )

    if (nowObject?.type === 'item') {
      pickUpItemName(nowObject)
    } else if (object?.type === 'chest') {
      handleChestOpen(object)
    } else if (object?.type === 'enemy') {
      send({ type: 'SHOW_POPUP', content: object.message })
      setTimeout(() => {
        const enemy = enemies.find(enemy => enemy.id === object.enemyId)
        if (!enemy) return
        send({ type: 'ENTER_BATTLE', enemy })
      }, ANIMATION_DURATION)
    } else if (object) {
      send({ type: 'SHOW_POPUP', content: object.message })
    }
  }, [
    state.context.showPopup,
    state.context.playerDirection,
    playerPosition,
    currentMap.gameObjects,
    pickUpItemName,
    send,
    handleChestOpen,
  ])

  return {
    handleInteract,
    pickUpItemName,
  }
}
