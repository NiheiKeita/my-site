import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGameLogic } from './hooks'
import { Provider } from 'jotai'
import React from 'react'

describe('useGameLogic', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>
      {children}
    </Provider>
  )

  it('レベルアップ時にポップアップが表示される', () => {
    const { result } = renderHook(() => useGameLogic(), { wrapper })

    // 初期状態の確認
    expect(result.current.showPopup).toBe(false)
    expect(result.current.popupContent).toBe('')

    // レベルアップをシミュレート
    result.current.setPlayerStatus({
      hp: 120,
      maxHp: 120,
      level: 2,
      exp: 100,
      gold: 0,
      attack: 15,
      defense: 8,
    })

    // ポップアップが表示されることを確認
    expect(result.current.showPopup).toBe(true)
    expect(result.current.popupContent).toContain('✨ レベルアップ！ ✨')
    expect(result.current.popupContent).toContain('レベル 1 → 2')
    expect(result.current.popupContent).toContain('HP: 100 → 120')
    expect(result.current.popupContent).toContain('攻撃力: 10 → 15')
    expect(result.current.popupContent).toContain('防御力: 5 → 8')
  })

  it('レベルアップしていない場合はポップアップが表示されない', () => {
    const { result } = renderHook(() => useGameLogic(), { wrapper })

    // 初期状態の確認
    expect(result.current.showPopup).toBe(false)
    expect(result.current.popupContent).toBe('')

    // レベルアップしていない状態をシミュレート
    result.current.setPlayerStatus({
      hp: 100,
      maxHp: 100,
      level: 1,
      exp: 50,
      gold: 0,
      attack: 10,
      defense: 5,
    })

    // ポップアップが表示されないことを確認
    expect(result.current.showPopup).toBe(false)
    expect(result.current.popupContent).toBe('')
  })

  it('ポップアップを閉じることができる', () => {
    const { result } = renderHook(() => useGameLogic(), { wrapper })

    // レベルアップをシミュレート
    result.current.setPlayerStatus({
      hp: 120,
      maxHp: 120,
      level: 2,
      exp: 100,
      gold: 0,
      attack: 15,
      defense: 8,
    })

    // ポップアップが表示されていることを確認
    expect(result.current.showPopup).toBe(true)

    // ポップアップを閉じる
    result.current.setShowPopup(false)

    // ポップアップが閉じられていることを確認
    expect(result.current.showPopup).toBe(false)
  })
}) 