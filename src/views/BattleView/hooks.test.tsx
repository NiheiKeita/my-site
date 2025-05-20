import React from 'react'
import { act } from 'react';
import { renderHook } from '@testing-library/react'
import { useBattleLogic } from './hooks'
import { Enemy } from '../../types/enemy'
import { Provider } from 'jotai'

// モックの敵データ
const mockEnemy: Enemy = {
  id: 1,
  name: 'テスト敵',
  level: 1,
  hp: 30,
  maxHp: 30,
  attack: 10,
  defense: 5,
  exp: 100,
  gold: 50,
  image: '/assets/enemies/test.png',
  defeatedImage: '/assets/enemies/test_defeated.png',
}

describe('useBattleLogic', () => {
  const mockOnBattleEnd = jest.fn()
  const mockSetPlayerHp = jest.fn()

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>
      {children}
    </Provider>
  )

  beforeEach(() => {
    jest.useFakeTimers()
    mockOnBattleEnd.mockClear()
    mockSetPlayerHp.mockClear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('初期状態が正しく設定される', () => {
    const { result } = renderHook(
      () => useBattleLogic(mockEnemy, mockOnBattleEnd, 100, mockSetPlayerHp),
      { wrapper }
    )

    expect(result.current.enemyHp).toBe(mockEnemy.hp)
    expect(result.current.battleState.isPlayerTurn).toBe(true)
    expect(result.current.battleState.isAttacking).toBe(false)
    expect(result.current.battleState.message).toBe(`${mockEnemy.name}が現れた！`)
    expect(result.current.battleState.isBattleEnd).toBe(false)
    expect(result.current.battleState.isVictory).toBe(false)
    expect(result.current.showEndMessage).toBe(false)
    expect(result.current.isEnemyDamaged).toBe(false)
    expect(result.current.isEscaping).toBe(false)
    expect(result.current.isEnemyAppeared).toBe(true)
    expect(result.current.isPlayerDamaged).toBe(false)
  })

  it('プレイヤーの攻撃が正しく処理される', async () => {
    const { result } = renderHook(
      () => useBattleLogic(mockEnemy, mockOnBattleEnd, 100, mockSetPlayerHp),
      { wrapper }
    )

    // 初期メッセージを待つ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    // プレイヤーの攻撃を実行
    await act(async () => {
      result.current.handlePlayerAttack()
    })

    // 攻撃メッセージの確認
    expect(result.current.battleState.message).toBe('攻撃！')
    expect(result.current.battleState.isAttacking).toBe(true)

    // ダメージメッセージ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    const expectedDamage = Math.max(1, 20 - mockEnemy.defense)
    expect(result.current.enemyHp).toBe(mockEnemy.hp - expectedDamage)
    expect(result.current.battleState.message).toBe(`${mockEnemy.name}に${expectedDamage}のダメージ！`)
  })

  it('敵の攻撃が正しく処理される', async () => {
    const { result } = renderHook(
      () => useBattleLogic(mockEnemy, mockOnBattleEnd, 100, mockSetPlayerHp),
      { wrapper }
    )

    // 初期メッセージを待つ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    // プレイヤーの攻撃を実行
    await act(async () => {
      result.current.handlePlayerAttack()
    })
    // ダメージメッセージ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    // 敵の攻撃メッセージ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.battleState.message).toBe(`${mockEnemy.name}の攻撃！`)
    // ダメージを受けたメッセージ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    const expectedDamage = Math.max(1, mockEnemy.attack - 5)
    expect(mockSetPlayerHp).toHaveBeenCalledWith(100 - expectedDamage)
    expect(result.current.battleState.message).toBe(`${expectedDamage}のダメージを受けた！`)
  })

  it('勝利時に正しく処理される', async () => {
    const { result } = renderHook(
      () => useBattleLogic(mockEnemy, mockOnBattleEnd, 100, mockSetPlayerHp),
      { wrapper }
    )

    // 初期メッセージを待つ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    // 1回目の攻撃
    await act(async () => {
      result.current.handlePlayerAttack()
    })

    // 1回目の攻撃メッセージ
    expect(result.current.battleState.message).toBe('攻撃！')

    // 1回目のダメージメッセージ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    const expectedDamage = Math.max(1, 20 - mockEnemy.defense)
    expect(result.current.enemyHp).toBe(mockEnemy.hp - expectedDamage)
    expect(result.current.battleState.message).toBe(`${mockEnemy.name}に${expectedDamage}のダメージ！`)

    // 敵の攻撃メッセージ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.battleState.message).toBe(`${mockEnemy.name}の攻撃！`)

    // 敵のダメージメッセージ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    const enemyDamage = Math.max(1, mockEnemy.attack - 5)
    expect(mockSetPlayerHp).toHaveBeenCalledWith(100 - enemyDamage)
    expect(result.current.battleState.message).toBe(`${enemyDamage}のダメージを受けた！`)

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    // 2回目の攻撃
    await act(async () => {
      result.current.handlePlayerAttack()
    })
    // 2回目の攻撃メッセージ
    expect(result.current.battleState.message).toBe('攻撃！')

    // 2回目のダメージメッセージ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.enemyHp).toBe(0)
    expect(result.current.battleState.message).toBe(`${mockEnemy.name}に${expectedDamage}のダメージ！`)

    // 勝利メッセージ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.battleState.message).toBe(`${mockEnemy.name}をやっつけた！`)
    expect(result.current.battleState.isVictory).toBe(true)
    expect(result.current.battleState.isBattleEnd).toBe(true)
    expect(result.current.showEndMessage).toBe(true)

    // バトル終了のコールバック確認
    await act(async () => {
      jest.advanceTimersByTime(2000)
    })
    expect(mockOnBattleEnd).toHaveBeenCalledWith({
      isVictory: true,
      exp: mockEnemy.exp,
      gold: mockEnemy.gold,
    })
  })

  it('逃走が正しく処理される', async () => {
    const { result } = renderHook(
      () => useBattleLogic(mockEnemy, mockOnBattleEnd, 100, mockSetPlayerHp),
      { wrapper }
    )
    // 初期メッセージを待つ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    // 逃走の試行
    await act(async () => {
      result.current.handleEscape()
    })
    expect(result.current.battleState.message).toBe('逃げ出そうとしている...')
    expect(result.current.isEscaping).toBe(true)
    // 逃走の結果を確認（成功または失敗）
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    expect(['逃げ出した！', '逃げ出せなかった！']).toContain(result.current.battleState.message)
  })

  it('戦闘開始メッセージが正しく表示される', async () => {
    const { result } = renderHook(
      () => useBattleLogic(mockEnemy, mockOnBattleEnd, 100, mockSetPlayerHp),
      { wrapper }
    )
    // 初期メッセージを待つ
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    expect(result.current.battleState.message).toBe('戦闘開始！')
    expect(result.current.isEnemyAppeared).toBe(false)
  })
}) 