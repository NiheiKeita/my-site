import { renderHook } from '@testing-library/react'
import { useGameLogic } from './hooks'
import { Provider } from 'jotai'
import React, { act } from 'react'

describe('useGameLogic', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>
      {children}
    </Provider>
  )

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGameLogic())

    expect(result.current.playerPosition).toEqual({ x: 4, y: 4 })
    expect(result.current.playerDirection).toBe('down')
    expect(result.current.showPopup).toBe(false)
    expect(result.current.showCommandMenu).toBe(false)
    expect(result.current.isInBattle).toBe(false)
  })

  it('レベルアップ時にポップアップが表示される', async () => {
    const { result } = renderHook(() => useGameLogic(), { wrapper })

    // 初期状態の確認
    expect(result.current.showPopup).toBe(false)
    expect(result.current.popupContent).toBe('')

    // レベルアップをシミュレート
    await act(async () => {
      result.current.setPlayerStatus({
        hp: 120,
        maxHp: 120,
        level: 2,
        exp: 100,
        gold: 0,
        attack: 15,
        defense: 8,
        mp: 0,
        maxMp: 0,
        spells: []
      })
    })

    // ポップアップが表示されることを確認
    expect(result.current.showPopup).toBe(true)
    expect(result.current.popupContent).toContain('✨ レベルアップ！ ✨')
    expect(result.current.popupContent).toContain('レベル 1 → 2')
    expect(result.current.popupContent).toContain('HP: 100 → 120')
    expect(result.current.popupContent).toContain('攻撃力: 10 → 15')
    expect(result.current.popupContent).toContain('防御力: 5 → 8')
  })

  it('レベルアップしていない場合はポップアップが表示されない', async () => {
    const { result } = renderHook(() => useGameLogic(), { wrapper })

    // 初期状態の確認
    expect(result.current.showPopup).toBe(false)
    expect(result.current.popupContent).toBe('')

    // レベルアップしていない状態をシミュレート
    await act(async () => {
      result.current.setPlayerStatus({
        hp: 10,
        maxHp: 10,
        level: 1,
        exp: 50,
        gold: 0,
        attack: 10,
        defense: 5,
        mp: 0,
        maxMp: 0,
        spells: []
      })
    })

    // ポップアップが表示されないことを確認
    expect(result.current.showPopup).toBe(false)
    expect(result.current.popupContent).toBe('')
  })

  it('ポップアップを閉じることができる', async () => {
    const { result } = renderHook(() => useGameLogic(), { wrapper })

    // レベルアップをシミュレート
    await act(async () => {
      result.current.setPlayerStatus({
        hp: 120,
        maxHp: 120,
        level: 2,
        exp: 100,
        gold: 0,
        attack: 15,
        defense: 8,
        mp: 0,
        maxMp: 0,
        spells: []
      })
    })

    // ポップアップが表示されていることを確認
    expect(result.current.showPopup).toBe(true)

    // ポップアップを閉じる
    await act(async () => {
      result.current.setShowPopup(false)
    })

    // ポップアップが閉じられていることを確認
    expect(result.current.showPopup).toBe(false)
  })
}) 