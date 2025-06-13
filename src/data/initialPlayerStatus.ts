import { PlayerStatus } from "~/store/player"

export const initialPlayerStatus: PlayerStatus = {
  hp: 5,
  maxHp: 10,
  level: 1,
  exp: 0,
  gold: 0,
  attack: 10,
  defense: 5,
  mp: 5,
  maxMp: 5,
  spells: [
    {
      id: 'fire',
      name: 'タイポ',
      mp: 4,
      description: '敵にタイポの精神的ダメージを与える',
      effect: { type: 'damage', value: 20 },
    },
    {
      id: 'heal',
      name: 'LGTM',
      mp: 4,
      description: '気分が良くなりHPが回復する',
      effect: { type: 'heal', value: 30 },
    },
  ],
}
