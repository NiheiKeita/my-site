import { applyItemEffect } from './useItemEffect'
import { PlayerStatus } from '~/store/player'

describe('useItemEffect', () => {
  const initialStatus: PlayerStatus = {
    hp: 50,
    maxHp: 100,
    mp: 20,
    maxMp: 50,
    level: 1,
    exp: 0,
    gold: 0,
    attack: 10,
    defense: 5,
  }

  it('HP回復アイテムを使用すると、HPが回復し、メッセージが表示される', () => {
    const effect = { hp: 30 }
    const { updates, messages } = applyItemEffect(effect, initialStatus)

    expect(updates.hp).toBe(80) // 50 + 30
    expect(messages).toContain('HPが30回復した！')
  })

  it('HP回復アイテムを使用しても、最大HPを超えて回復しない', () => {
    const effect = { hp: 100 }
    const { updates, messages } = applyItemEffect(effect, initialStatus)

    expect(updates.hp).toBe(100) // maxHp
    expect(messages).toContain('HPが50回復した！')
  })

  it('MP回復アイテムを使用すると、MPが回復し、メッセージが表示される', () => {
    const effect = { mp: 20 }
    const { updates, messages } = applyItemEffect(effect, initialStatus)

    expect(updates.mp).toBe(40) // 20 + 20
    expect(messages).toContain('MPが20回復した！')
  })

  it('MP回復アイテムを使用しても、最大MPを超えて回復しない', () => {
    const effect = { mp: 100 }
    const { updates, messages } = applyItemEffect(effect, initialStatus)

    expect(updates.mp).toBe(50) // maxMp
    expect(messages).toContain('MPが30回復した！')
  })

  it('攻撃力上昇アイテムを使用すると、攻撃力が上がり、メッセージが表示される', () => {
    const effect = { attack: 5 }
    const { updates, messages } = applyItemEffect(effect, initialStatus)

    expect(updates.attack).toBe(15) // 10 + 5
    expect(messages).toContain('攻撃力が5上がった！')
  })

  it('防御力上昇アイテムを使用すると、防御力が上がり、メッセージが表示される', () => {
    const effect = { defense: 3 }
    const { updates, messages } = applyItemEffect(effect, initialStatus)

    expect(updates.defense).toBe(8) // 5 + 3
    expect(messages).toContain('防御力が3上がった！')
  })

  it('経験値獲得アイテムを使用すると、経験値が増加し、メッセージが表示される', () => {
    const effect = { exp: 50 }
    const { updates, messages } = applyItemEffect(effect, initialStatus)

    expect(updates.exp).toBe(50)
    expect(messages).toContain('経験値を50獲得した！')
  })

  it('複数の効果を持つアイテムを使用すると、全ての効果が適用され、メッセージが表示される', () => {
    const effect = {
      hp: 20,
      mp: 10,
      attack: 3,
      defense: 2,
      exp: 30,
    }
    const { updates, messages } = applyItemEffect(effect, initialStatus)

    expect(updates.hp).toBe(70) // 50 + 20
    expect(updates.mp).toBe(30) // 20 + 10
    expect(updates.attack).toBe(13) // 10 + 3
    expect(updates.defense).toBe(7) // 5 + 2
    expect(updates.exp).toBe(30)

    expect(messages).toContain('HPが20回復した！')
    expect(messages).toContain('MPが10回復した！')
    expect(messages).toContain('攻撃力が3上がった！')
    expect(messages).toContain('防御力が2上がった！')
    expect(messages).toContain('経験値を30獲得した！')
  })

  it('効果がないアイテムを使用すると、何も変化しない', () => {
    const effect = {}
    const { updates, messages } = applyItemEffect(effect, initialStatus)

    expect(updates).toEqual({})
    expect(messages).toEqual([])
  })
}) 