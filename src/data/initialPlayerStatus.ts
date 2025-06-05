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
      name: 'メラ',
      mp: 4,
      description: '敵に炎のダメージを与える',
      effect: { type: 'damage', value: 20 },
    },
    {
      id: 'heal',
      name: 'ホイミ',
      mp: 4,
      description: 'HPを回復する',
      effect: { type: 'heal', value: 30 },
    },
  ],
}
