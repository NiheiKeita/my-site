import React from 'react'
import { render } from '@testing-library/react'
import { maps } from '..'
import { messageUtils, createStairMessage } from '../messages'

describe('maps', () => {
  describe('マップデータの構造', () => {
    it('全てのマップが正しい構造を持っている', () => {
      maps.forEach((map) => {
        expect(map).toHaveProperty('id')
        expect(map).toHaveProperty('name')
        expect(map).toHaveProperty('width')
        expect(map).toHaveProperty('height')
        expect(map).toHaveProperty('gameObjects')
        expect(Array.isArray(map.gameObjects)).toBe(true)
      })
    })

    it('1階のマップが正しいオブジェクトを持っている', () => {
      const firstFloor = maps.find((map) => map.id === 'first-floor')
      expect(firstFloor).toBeDefined()
      expect(firstFloor?.gameObjects).toHaveLength(7)
      expect(firstFloor?.stairs?.down).toBeDefined()
    })

    it('2階のマップが正しい階段接続を持っている', () => {
      const secondFloor = maps.find((map) => map.id === 'second-floor')
      expect(secondFloor).toBeDefined()
      expect(secondFloor?.stairs?.up).toBeDefined()
      expect(secondFloor?.stairs?.down).toBeDefined()
    })
  })

  describe('メッセージ生成', () => {
    it('createMessageが正しくメッセージを生成する', () => {
      const content = <p>テストメッセージ</p>
      const { container } = render(messageUtils.createMessage(content))
      expect(container.querySelector('.text-gray-300')).toBeInTheDocument()
      expect(container.textContent).toBe('テストメッセージ')
    })

    it('createStairMessageが正しい方向のメッセージを生成する', () => {
      const { container: upContainer } = render(createStairMessage('up'))
      expect(upContainer.textContent).toContain('上へ続く階段')
      expect(upContainer.textContent).toContain('上の階へ続く階段がある')

      const { container: downContainer } = render(createStairMessage('down'))
      expect(downContainer.textContent).toContain('下へ続く階段')
      expect(downContainer.textContent).toContain('下の階へ続く階段がある')
    })
  })

  describe('オブジェクトの位置', () => {
    it('全てのオブジェクトが有効な位置を持っている', () => {
      maps.forEach((map) => {
        map.gameObjects.forEach((obj) => {
          expect(obj.position.x).toBeGreaterThanOrEqual(0)
          expect(obj.position.x).toBeLessThan(map.width)
          expect(obj.position.y).toBeGreaterThanOrEqual(0)
          expect(obj.position.y).toBeLessThan(map.height)
        })
      })
    })

    it('階段の位置が正しく設定されている', () => {
      const firstFloor = maps.find((map) => map.id === 'first-floor')
      const stairs = firstFloor?.gameObjects.find((obj) => obj.type === 'stairs')
      expect(stairs?.position).toEqual({ x: 7, y: 7 })
    })
  })
}) 