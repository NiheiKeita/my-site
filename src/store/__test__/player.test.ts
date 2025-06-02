import { playerStatusAtom, updatePlayerStatusAtom } from '../player'
import { createStore } from 'jotai/vanilla'

describe('プレイヤーステータスの更新', () => {
  it('経験値を追加するとレベルアップする', () => {
    const store = createStore()
    store.set(playerStatusAtom, {
      hp: 10,
      maxHp: 10,
      level: 1,
      exp: 0,
      gold: 0,
      attack: 10,
      defense: 5,
      mp: 0,
      maxMp: 0,
      spells: [],
    })

    // レベル2に必要な経験値を追加
    store.set(updatePlayerStatusAtom, { exp: 50 })

    const newStatus = store.get(playerStatusAtom)
    expect(newStatus.level).toBe(2)
    expect(newStatus.maxHp).toBe(20) // +20
    expect(newStatus.attack).toBe(12) // +2
    expect(newStatus.defense).toBe(6) // +1
    expect(newStatus.hp).toBe(20) // HP全回復
  })

  it('レベルアップに必要な経験値に達していない場合はレベルアップしない', () => {
    const store = createStore()
    store.set(playerStatusAtom, {
      hp: 10,
      maxHp: 10,
      level: 1,
      exp: 0,
      gold: 0,
      attack: 10,
      defense: 5,
      mp: 0,
      maxMp: 0,
      spells: [],
    })

    // レベル2に必要な経験値に達していない経験値を追加
    store.set(updatePlayerStatusAtom, { exp: 20 })

    const newStatus = store.get(playerStatusAtom)
    expect(newStatus.level).toBe(1)
    expect(newStatus.maxHp).toBe(10)
    expect(newStatus.attack).toBe(10)
    expect(newStatus.defense).toBe(5)
  })

  it('複数レベルアップする場合も正しく処理される', () => {
    const store = createStore()
    store.set(playerStatusAtom, {
      hp: 10,
      maxHp: 10,
      level: 1,
      exp: 0,
      gold: 0,
      attack: 10,
      defense: 5,
      mp: 0,
      maxMp: 0,
      spells: [],
    })

    // レベル3に必要な経験値を追加
    store.set(updatePlayerStatusAtom, { exp: 120 })

    const newStatus = store.get(playerStatusAtom)
    expect(newStatus.level).toBe(3)
    expect(newStatus.maxHp).toBe(30) // +10 * 2
    expect(newStatus.attack).toBe(14) // +2 * 2
    expect(newStatus.defense).toBe(7) // +1 * 2
    expect(newStatus.hp).toBe(30) // HP全回復
  })
}) 