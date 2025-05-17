import type { Meta, StoryObj } from '@storybook/react'
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
    onBattleEnd: (isVictory, exp, gold) => {
      console.log('Battle ended:', { isVictory, exp, gold })
    },
  },
}

export const GoblinBattle: Story = {
  args: {
    enemy: enemies[1],
    onBattleEnd: (isVictory, exp, gold) => {
      console.log('Battle ended:', { isVictory, exp, gold })
    },
  },
}

export const WolfBattle: Story = {
  args: {
    enemy: enemies[2],
    onBattleEnd: (isVictory, exp, gold) => {
      console.log('Battle ended:', { isVictory, exp, gold })
    },
  },
} 