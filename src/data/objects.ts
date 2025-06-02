import { GameObjectType } from '../types/game'

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
  item: {
    type: 'item',
    image: '/assets/objects/item.png',
  },
}

export const getObjectImage = (type: GameObjectType, direction?: 'up' | 'down', isOpened?: boolean): string => {
  if (type === 'stairs' && direction) {
    return `/assets/objects/stairs_${direction}.png`
  }
  if (type === "chest") {
    return isOpened ? '/assets/objects/opened_chest.png' : objectImages["chest"]?.image || '/assets/objects/default.png'
  }

  return objectImages[type]?.image || '/assets/objects/default.png'
} 