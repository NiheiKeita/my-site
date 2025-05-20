import { describe, it, expect } from 'vitest'
import { playerStatusAtom, updatePlayerStatusAtom } from './player'
import { createStore } from 'jotai/vanilla'

describe('プレイヤーステータスの更新', () => {
  it('経験値を追加するとレベルアップする', () => {
    const store = createStore()
    store.set(playerStatusAtom, {
      hp: 100,
      maxHp: 100,
      level: 1,
      exp: 0,
      gold: 0,
      attack: 10,
      defense: 5,
    })

    // レベル2に必要な経験値（100）を追加
    store.set(updatePlayerStatusAtom, { exp: 100 })

    const newStatus = store.get(playerStatusAtom)
    expect(newStatus.level).toBe(2)
    expect(newStatus.maxHp).toBe(120) // +20
    expect(newStatus.attack).toBe(15) // +5
    expect(newStatus.defense).toBe(8) // +3
    expect(newStatus.hp).toBe(120) // HP全回復
  })

  it('レベルアップに必要な経験値に達していない場合はレベルアップしない', () => {
    const store = createStore()
    store.set(playerStatusAtom, {
      hp: 100,
      maxHp: 100,
      level: 1,
      exp: 0,
      gold: 0,
      attack: 10,
      defense: 5,
    })

    // レベル2に必要な経験値（100）に達していない経験値を追加
    store.set(updatePlayerStatusAtom, { exp: 50 })

    const newStatus = store.get(playerStatusAtom)
    expect(newStatus.level).toBe(1)
    expect(newStatus.maxHp).toBe(100)
    expect(newStatus.attack).toBe(10)
    expect(newStatus.defense).toBe(5)
  })

  it('複数レベルアップする場合も正しく処理される', () => {
    const store = createStore()
    store.set(playerStatusAtom, {
      hp: 100,
      maxHp: 100,
      level: 1,
      exp: 0,
      gold: 0,
      attack: 10,
      defense: 5,
    })

    // レベル3に必要な経験値（300）を追加
    store.set(updatePlayerStatusAtom, { exp: 300 })

    const newStatus = store.get(playerStatusAtom)
    expect(newStatus.level).toBe(3)
    expect(newStatus.maxHp).toBe(140) // +20 * 2
    expect(newStatus.attack).toBe(20) // +5 * 2
    expect(newStatus.defense).toBe(11) // +3 * 2
    expect(newStatus.hp).toBe(140) // HP全回復
  })
}) 