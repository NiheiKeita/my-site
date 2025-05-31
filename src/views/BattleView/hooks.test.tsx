import { renderHook } from '@testing-library/react'
import { useBattleLogic } from './hooks'
import { Enemy } from '../../types/enemy'
import { act } from 'react'

jest.useFakeTimers()

describe('useBattleLogic', () => {
  const mockEnemy: Enemy = {
    id: 1,
    name: 'テストモンスター',
    level: 1,
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 5,
    exp: 10,
    gold: 10,
    image: '/test.png',
    defeatedImage: '/test-defeated.png'
  }

  const mockOnBattleEnd = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('初期状態が正しく設定される', () => {
    const { result } = renderHook(() =>
      useBattleLogic(mockEnemy, mockOnBattleEnd)
    )

    expect(result.current.enemyHp).toBe(mockEnemy.hp)
    expect(result.current.battleState.isPlayerTurn).toBe(true)
    expect(result.current.battleState.isAttacking).toBe(false)
    expect(result.current.battleState.isHealing).toBe(false)
    expect(result.current.battleState.isVictory).toBe(false)
    expect(result.current.showEndMessage).toBe(true)
    expect(result.current.isEnemyDamaged).toBe(false)
    expect(result.current.isPlayerDamaged).toBe(false)
  })

  it('攻撃コマンドが正しく処理される', async () => {
    const { result } = renderHook(() =>
      useBattleLogic(mockEnemy, mockOnBattleEnd)
    )

    act(() => {
      result.current.handleCommandSelect('attack')
    })

    expect(result.current.battleState.isAttacking).toBe(true)
    expect(result.current.battleState.isPlayerTurn).toBe(false)

    // アニメーション完了を待機
    act(() => {
      jest.advanceTimersByTime(800)
    })
  })

  it('呪文選択が正しく処理される', () => {
    const { result } = renderHook(() =>
      useBattleLogic(mockEnemy, mockOnBattleEnd)
    )

    act(() => {
      result.current.handleCommandSelect('spell')
    })
  })

  it('アイテム選択が正しく処理される', () => {
    const { result } = renderHook(() =>
      useBattleLogic(mockEnemy, mockOnBattleEnd)
    )

    act(() => {
      result.current.handleCommandSelect('item')
    })
  })

  it('戻るコマンドが正しく処理される', () => {
    const { result } = renderHook(() =>
      useBattleLogic(mockEnemy, mockOnBattleEnd)
    )

    act(() => {
      result.current.handleCommandSelect('back')
    })

    expect(result.current.battleState.phase).toBe('initial')
  })

  it('戦うコマンドが正しく処理される', () => {
    const { result } = renderHook(() =>
      useBattleLogic(mockEnemy, mockOnBattleEnd)
    )

    act(() => {
      result.current.handleCommandSelect('fight')
    })

    expect(result.current.battleState.phase).toBe('action')
  })

  it('逃げるコマンドが正しく処理される', () => {
    const { result } = renderHook(() =>
      useBattleLogic(mockEnemy, mockOnBattleEnd)
    )

    act(() => {
      result.current.handleCommandSelect('run')
    })

    expect(result.current.battleState.message).toBe('逃げ出そうとしている...')

    // 逃げる判定を待機
    act(() => {
      jest.advanceTimersByTime(1000)
    })
  })
}) 