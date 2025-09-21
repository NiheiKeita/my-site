import { renderHook, act } from '@testing-library/react'
import { useMovementHandler } from '../useMovementHandler'
import type { GameState } from '../../types'
import { ENEMY_ENCOUNTER_RATE } from '~/data/constants'

jest.mock('jotai', () => ({
  useAtom: jest.fn(),
  useSetAtom: jest.fn(),
  atom: jest.fn((initialValue) => initialValue),
}))

jest.mock('~/store/playerPosition', () => ({
  playerPositionAtom: 'playerPositionAtom',
}))

jest.mock('~/store/currentMap', () => ({
  currentMapAtom: 'currentMapAtom',
  writeCurrentMapAtom: 'writeCurrentMapAtom',
}))

jest.mock('~/store/player', () => ({
  playerStatusAtom: 'playerStatusAtom',
}))

jest.mock('~/data/maps', () => ({
  maps: [
    { id: 'floor-1', width: 5, height: 5, gameObjects: [], stairs: undefined, enemies: [] },
    { id: 'floor-2', width: 5, height: 5, gameObjects: [], stairs: undefined, enemies: [] },
  ],
}))

describe('useMovementHandler', () => {
  const mockSend = jest.fn()
  const mockSetPlayerPosition = jest.fn()
  const mockSetPlayerStatus = jest.fn()
  const mockOnRandomEncounter = jest.fn()
  const mockSetCurrentMap = jest.fn()

  const { useAtom, useSetAtom } = jest.requireMock('jotai') as jest.Mocked<typeof import('jotai')>

  const createState = (contextOverrides: Partial<GameState['context']> = {}): GameState => ({
    value: 'exploration',
    context: {
      currentEnemy: null,
      playerDirection: 'down',
      showPopup: false,
      showCommandMenu: false,
      popupContent: '',
      previousLevel: 1,
      ...contextOverrides,
    },
    matches: (value: string | string[]) => {
      if (Array.isArray(value)) {
        return value.includes('exploration')
      }
      
return value === 'exploration'
    },
  }) as unknown as GameState

  const baseMap = {
    id: 'floor-1',
    width: 6,
    height: 6,
    gameObjects: [] as any[],
    stairs: undefined,
    enemies: [],
  }

  const baseStatus = {
    hp: 10,
    maxHp: 20,
    mp: 5,
    maxMp: 10,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === 'playerPositionAtom') {
        return [{ x: 1, y: 1 }, mockSetPlayerPosition]
      }
      if (atom === 'currentMapAtom') {
        return [baseMap]
      }
      if (atom === 'playerStatusAtom') {
        return [baseStatus, mockSetPlayerStatus]
      }
      
return [null]
    })
    ;(useSetAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === 'writeCurrentMapAtom') return mockSetCurrentMap
      
return jest.fn()
    })
  })

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore()
  })

  it('ショーポップアップ中は移動しない', () => {
    const state = createState({ showPopup: true })
    const { result } = renderHook(() => useMovementHandler(state, mockSend, mockOnRandomEncounter))

    result.current.handleMove('right')

    expect(mockSend).not.toHaveBeenCalled()
    expect(mockSetPlayerPosition).not.toHaveBeenCalled()
  })

  it('障害物がなければ移動と向きが更新される', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(Math.min(0.99, ENEMY_ENCOUNTER_RATE + 0.01))
    const state = createState()
    const { result } = renderHook(() => useMovementHandler(state, mockSend, mockOnRandomEncounter))

    act(() => {
      result.current.handleMove('right')
    })

    expect(mockSend).toHaveBeenCalledWith({ type: 'SET_DIRECTION', direction: 'right' })
    expect(mockSetPlayerPosition).toHaveBeenCalledWith({ x: 2, y: 1 })
  })

  it('エンカウント判定が発生するとランダムエンカウント処理のみ呼ばれる', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0)
    const state = createState()
    const { result } = renderHook(() => useMovementHandler(state, mockSend, mockOnRandomEncounter))

    result.current.handleMove('right')

    expect(mockOnRandomEncounter).toHaveBeenCalled()
    expect(mockSetPlayerPosition).not.toHaveBeenCalled()
  })

  it('泉に到達したらHPとMPが回復してポップアップを表示する', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1)
    const mapWithFountain = {
      ...baseMap,
      gameObjects: [
        { type: 'fountain', position: { x: 2, y: 1 } },
      ],
    }

    ;(useAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === 'playerPositionAtom') return [{ x: 1, y: 1 }, mockSetPlayerPosition]
      if (atom === 'currentMapAtom') return [mapWithFountain]
      if (atom === 'playerStatusAtom') {
        return [{ ...baseStatus, hp: 5, mp: 4 }, mockSetPlayerStatus]
      }

      return [null]
    })

    const state = createState()
    const { result } = renderHook(() => useMovementHandler(state, mockSend, mockOnRandomEncounter))

    act(() => {
      result.current.handleMove('right')
    })

    expect(mockSetPlayerStatus).toHaveBeenCalled()
    expect(mockSend).toHaveBeenCalledWith({ type: 'SHOW_POPUP', content: 'HP・MPが全回復した！' })
  })

  it('障害物がある場合は移動しない', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(1)
    const mapWithObstacle = {
      ...baseMap,
      gameObjects: [
        { type: 'npc', position: { x: 2, y: 1 } },
      ],
    }

    ;(useAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === 'playerPositionAtom') return [{ x: 1, y: 1 }, mockSetPlayerPosition]
      if (atom === 'currentMapAtom') return [mapWithObstacle]
      if (atom === 'playerStatusAtom') return [baseStatus, mockSetPlayerStatus]

      return [null]
    })

    const state = createState()
    const { result } = renderHook(() => useMovementHandler(state, mockSend, mockOnRandomEncounter))

    result.current.handleMove('right')

    expect(mockSetPlayerPosition).not.toHaveBeenCalled()
  })
})
