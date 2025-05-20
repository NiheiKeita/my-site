import { Item } from '../types/item'

export const initialItems: Item[] = [
  {
    id: 'sword_1',
    description: '基本的な銅で作られた剣。',
    type: 'weapon',
    effect: {
      attack: 5,
    },
    value: 100,
    image: '/assets/items/copper_sword.png',
    x: 2,
    y: 2,
  },
  {
    id: 'shield_1',
    name: '木の盾',
    description: '丈夫な木で作られた盾。',
    type: 'armor',
    effect: {
      defense: 3,
    },
    value: 80,
    image: '/assets/items/wooden_shield.png',
    x: 4,
    y: 2,
  },
  {
    id: 'potion_1',
    name: '回復薬',
    description: 'HPを30回復する。',
    type: 'potion',
    effect: {
      hp: 30,
    },
    value: 50,
    image: '/assets/items/healing_potion.png',
    x: 3,
    y: 4,
  },
] 