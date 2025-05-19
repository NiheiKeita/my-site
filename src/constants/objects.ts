import { GameObjectData, GameObjectType } from '../types/game'
import { messages } from './messages'

export const getMapObjects = (mapId: string): GameObjectData[] => {
  switch (mapId) {
    case 'map1':
      return [
        {
          type: 'pot',
          position: { x: 2, y: 2 },
          message: messages.pot.empty
        },
        {
          type: 'pot',
          position: { x: 5, y: 2 },
          message: messages.pot.treasure
        },
        {
          type: 'chest',
          position: { x: 2, y: 5 },
          message: messages.chest.locked
        },
        {
          type: 'chest',
          position: { x: 5, y: 5 },
          message: messages.chest.treasure
        },
        {
          type: 'fountain',
          position: { x: 0, y: 0 },
          message: messages.fountain.mystic
        },
        {
          type: 'stairs',
          position: { x: 7, y: 7 },
          message: messages.stairs.down,
          direction: 'down'
        }
      ]
    case 'map2':
      return [
        {
          type: 'pot',
          position: { x: 3, y: 3 },
          message: messages.pot.empty
        },
        {
          type: 'chest',
          position: { x: 4, y: 4 },
          message: messages.chest.treasure
        },
        {
          type: 'stairs',
          position: { x: 7, y: 7 },
          message: messages.stairs.up,
          direction: 'up'
        },
        {
          type: 'stairs',
          position: { x: 0, y: 0 },
          message: messages.stairs.down,
          direction: 'down'
        }
      ]
    case 'map3':
      return [
        {
          type: 'chest',
          position: { x: 3, y: 3 },
          message: messages.chest.treasure
        },
        {
          type: 'fountain',
          position: { x: 4, y: 4 },
          message: messages.fountain.mystic
        },
        {
          type: 'stairs',
          position: { x: 0, y: 0 },
          message: messages.stairs.up,
          direction: 'up'
        }
      ]
    default:
      return []
  }
}

export const androidApps = [
  { id: 1, name: 'ひたすら因数分解', url: "https://play.google.com/store/apps/details?id=com.iggyapp.insuubunkai&hl=ja" },
  { id: 2, name: 'ひたすら積分', url: "https://play.google.com/store/apps/details?id=com.iggyapp.sekibunn&hl=ja" },
  { id: 3, name: 'ひたすら微分', url: "https://play.google.com/store/apps/details?id=com.iggyapp.bibunn&hl=ja" },
  { id: 4, name: 'ひたすら素因数分解', url: "https://play.google.com/store/apps/details?id=com.iggyapp.soinnsuubunnkai&hl=ja" },
  { id: 5, name: '鬼封じの縄', url: "https://play.google.com/store/apps/details?id=com.iggy.catchthedemon&hl=ja" }
]

interface ObjectImageConfig {
  type: GameObjectType;
  image: string;
  size?: {
    width: number;
    height: number;
  };
}

export const objectImages: Partial<Record<GameObjectType, ObjectImageConfig>> = {
  pot: {
    type: 'pot',
    image: '/assets/objects/pot.png',
  },
  chest: {
    type: 'chest',
    image: '/assets/objects/chest.png',
  },
  fountain: {
    type: 'fountain',
    image: '/assets/objects/fountain.png',
  },
  stairs: {
    type: 'stairs',
    image: '/assets/objects/stairs_down.png', // デフォルトの画像
  },
}

export const getObjectImage = (type: GameObjectType, direction?: 'up' | 'down'): string => {
  if (type === 'stairs' && direction) {
    return `/assets/objects/stairs_${direction}.png`
  }
  return objectImages[type]?.image || '/assets/objects/default.png'
} 