import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { BattleView } from './index'
import { enemies } from '../../data/enemies'

const meta: Meta<typeof BattleView> = {
  title: 'Views/BattleView',
  component: BattleView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BattleView>

export const SlimeBattle: Story = {
  args: {
    enemy: enemies[0],
    onBattleEnd: (result) => {
      console.log('Battle ended:', result)
    },
    setPlayerHp: fn()
  },
}

export const TomatoBattle: Story = {
  args: {
    enemy: enemies[1],
    onBattleEnd: (result) => {
      console.log('Battle ended:', result)
    },
    setPlayerHp: fn()
  },
}

export const CheeseBattle: Story = {
  args: {
    enemy: enemies[2],
    onBattleEnd: (result) => {
      console.log('Battle ended:', result)
    },
    setPlayerHp: fn()
  },
}

