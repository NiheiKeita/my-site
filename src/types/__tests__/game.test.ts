import { GameObjectData, MapData, Position, StairData } from '../game'

describe('game types', () => {
  describe('Position', () => {
    it('正しい位置オブジェクトを作成できる', () => {
      const position: Position = { x: 1, y: 2 }
      expect(position).toHaveProperty('x', 1)
      expect(position).toHaveProperty('y', 2)
    })
  })

  describe('GameObjectData', () => {
    it('正しいゲームオブジェクトを作成できる', () => {
      const gameObject: GameObjectData = {
        id: 'pot',
        type: 'pot',
        position: { x: 1, y: 2 },
        message: 'テストメッセージ'
      }
      expect(gameObject).toHaveProperty('type', 'pot')
      expect(gameObject).toHaveProperty('position')
      expect(gameObject).toHaveProperty('message')
    })

    it('階段オブジェクトに方向を設定できる', () => {
      const stairs: GameObjectData = {
        id: 'stairs',
        type: 'stairs',
        position: { x: 1, y: 2 },
        message: '階段のメッセージ',
        direction: 'up'
      }
      expect(stairs).toHaveProperty('direction', 'up')
    })
  })

  describe('StairData', () => {
    it('正しい階段データを作成できる', () => {
      const stairData: StairData = {
        mapId: 'second-floor',
        position: { x: 1, y: 2 }
      }
      expect(stairData).toHaveProperty('mapId', 'second-floor')
      expect(stairData).toHaveProperty('position')
    })
  })

  describe('MapData', () => {
    it('正しいマップデータを作成できる', () => {
      const mapData: MapData = {
        id: 'test-map',
        name: 'テストマップ',
        width: 8,
        height: 8,
        enemies: [],
        gameObjects: [],
        stairs: {
          up: {
            mapId: 'upper-floor',
            position: { x: 1, y: 2 }
          }
        }
      }
      expect(mapData).toHaveProperty('id', 'test-map')
      expect(mapData).toHaveProperty('name', 'テストマップ')
      expect(mapData).toHaveProperty('width', 8)
      expect(mapData).toHaveProperty('height', 8)
      expect(mapData).toHaveProperty('gameObjects')
      expect(mapData).toHaveProperty('stairs')
    })
  })
}) 