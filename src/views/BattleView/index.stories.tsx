import type { Meta, StoryObj } from '@storybook/react'
import { BattleView } from './index'
import { Enemy } from '../../types/enemy'
import { Provider } from 'jotai'
import { bagItemsAtom } from '../../store/bag'
import { playerStatusAtom } from '../../store/player'
import { initialPlayerStatus } from '../../data/initialPlayerStatus'
import { createStore } from 'jotai/vanilla'
import { enemies } from '~/data/enemies'

const meta: Meta<typeof BattleView> = {
  title: 'Views/BattleView',
  component: BattleView,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Provider>
        <Story />
      </Provider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BattleView>

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
  image: '/assets/enemies/slime_default.png',
  defeatedImage: '/assets/enemies/slime_defeated.png'
}
const findEnemy = (id: number) => {
  return enemies.find(enemy => enemy.id === id)
}

export const Default: Story = {
  args: {
    enemy: findEnemy(4),
    onBattleEnd: () => { },
  },
}

export const WithItems: Story = {
  args: {
    enemy: mockEnemy,
    onBattleEnd: () => { },
  },
  decorators: [
    (Story) => {
      const store = createStore()
      store.set(bagItemsAtom, ['healing_potion', 'mobile_battery', 'macbook_pro'])
      store.set(playerStatusAtom, { ...initialPlayerStatus, hp: 50, maxHp: 100, mp: 20, maxMp: 100 })

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      )
    },
  ],
}

export const LowLevelEnemy: Story = {
  args: {
    enemy: {
      ...mockEnemy,
      level: 1,
      hp: 50,
      maxHp: 50,
      attack: 5,
      defense: 2,
    },
    onBattleEnd: () => { },
  },
}

export const HighLevelEnemy: Story = {
  args: {
    enemy: {
      ...mockEnemy,
      level: 5,
      hp: 200,
      maxHp: 200,
      attack: 20,
      defense: 10,
    },
    onBattleEnd: () => { },
  },
}

