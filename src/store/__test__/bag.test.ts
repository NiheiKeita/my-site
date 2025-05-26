import { createStore } from 'jotai/vanilla'
import { useItemAtom, bagItemsAtom, itemEffectMessageAtom } from '../bag'
import { playerStatusAtom } from '../player'
import { items } from '~/data/items'

describe('useItemAtom', () => {
  it('アイテムを使用すると、効果が適用され、メッセージが表示される', () => {
    const store = createStore()
    const healingPotion = items.find(item => item.id === 'healing_potion')
    if (!healingPotion) throw new Error('healing_potion not found')

    // 初期状態を設定
    store.set(bagItemsAtom, ['healing_potion'])
    store.set(playerStatusAtom, {
      hp: 50,
      maxHp: 100,
      mp: 20,
      maxMp: 50,
      level: 1,
      exp: 0,
      gold: 0,
      attack: 10,
      defense: 5,
      spells: [],
    })

    // アイテムを使用
    store.set(useItemAtom, 'healing_potion')

    // バッグからアイテムが消費されることを確認
    const remainingItems = store.get(bagItemsAtom)
    expect(remainingItems).toEqual([])

    // プレイヤーステータスが更新されることを確認
    const newStatus = store.get(playerStatusAtom)
    expect(newStatus.hp).toBe(80) // 全回復

    // メッセージが表示されることを確認
    const message = store.get(itemEffectMessageAtom)
    expect(message).toBe('HPが30回復した！')
  })

  it('消費不可アイテムをかつ効果がないアイテムを使用しても何も起こらない', () => {
    const store = createStore()
    const copperSword = items.find(item => item.id === 'copper_sword')
    if (!copperSword) throw new Error('copper_sword not found')

    // 初期状態を設定
    store.set(bagItemsAtom, ['copper_sword'])
    store.set(playerStatusAtom, {
      hp: 50,
      maxHp: 100,
      mp: 20,
      maxMp: 50,
      level: 1,
      exp: 0,
      gold: 0,
      attack: 10,
      defense: 5,
      spells: [],
    })

    // アイテムを使用
    store.set(useItemAtom, 'copper_sword')

    // バッグにアイテムが残っていることを確認
    const remainingItems = store.get(bagItemsAtom)
    expect(remainingItems).toEqual(['copper_sword'])

    // プレイヤーステータスが更新されることを確認
    const newStatus = store.get(playerStatusAtom)
    expect(newStatus.attack).toBe(10) // 攻撃力+2

    // メッセージが表示されることを確認
    const message = store.get(itemEffectMessageAtom)
    expect(message).toBe('')
  })

  it('存在しないアイテムを使用しようとすると、何も起こらない', () => {
    const store = createStore()

    // 初期状態を設定
    store.set(bagItemsAtom, [])
    store.set(playerStatusAtom, {
      hp: 50,
      maxHp: 100,
      mp: 20,
      maxMp: 50,
      level: 1,
      exp: 0,
      gold: 0,
      attack: 10,
      defense: 5,
      spells: [],
    })

    // 存在しないアイテムを使用
    store.set(useItemAtom, 'non_existent_item')

    // バッグが空のままであることを確認
    const remainingItems = store.get(bagItemsAtom)
    expect(remainingItems).toEqual([])

    // プレイヤーステータスが変化していないことを確認
    const newStatus = store.get(playerStatusAtom)
    expect(newStatus).toEqual({
      hp: 50,
      maxHp: 100,
      mp: 20,
      maxMp: 50,
      level: 1,
      exp: 0,
      gold: 0,
      attack: 10,
      defense: 5,
      spells: [],
    })

    // メッセージが表示されていないことを確認
    const message = store.get(itemEffectMessageAtom)
    expect(message).toBeNull()
  })
}) 