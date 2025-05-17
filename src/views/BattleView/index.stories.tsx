import type { Meta, StoryObj } from '@storybook/react'
import { BattleView } from './index'

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

const slime = {
  id: 'slime',
  name: 'スライム',
  hp: 30,
  maxHp: 30,
  attack: 5,
  defense: 2,
  image: '/assets/enemies/slime.png',
  level: 1,
  exp: 10,
  gold: 5,
}

const goblin = {
  id: 'goblin',
  name: 'ゴブリン',
  hp: 50,
  maxHp: 50,
  attack: 8,
  defense: 4,
  image: '/assets/enemies/goblin.png',
  level: 2,
  exp: 20,
  gold: 10,
}

const wolf = {
  id: 'wolf',
  name: 'オオカミ',
  hp: 70,
  maxHp: 70,
  attack: 12,
  defense: 6,
  image: '/assets/enemies/wolf.png',
  level: 3,
  exp: 35,
  gold: 15,
}

export const SlimeBattle: Story = {
  args: {
    enemy: slime,
    onBattleEnd: (isVictory, exp, gold) => {
      console.log('Battle ended:', { isVictory, exp, gold })
    },
  },
}

export const GoblinBattle: Story = {
  args: {
    enemy: goblin,
    onBattleEnd: (isVictory, exp, gold) => {
      console.log('Battle ended:', { isVictory, exp, gold })
    },
  },
}

export const WolfBattle: Story = {
  args: {
    enemy: wolf,
    onBattleEnd: (isVictory, exp, gold) => {
      console.log('Battle ended:', { isVictory, exp, gold })
    },
  },
} 