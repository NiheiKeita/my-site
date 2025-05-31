import type { Meta, StoryObj } from '@storybook/react'
import { BattleCommandMenu } from '.'

const meta: Meta<typeof BattleCommandMenu> = {
  component: BattleCommandMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    playerStatus: {
      hp: 100,
      mp: 100,
      maxHp: 100,
      maxMp: 100,
      level: 1,
      exp: 0,
      gold: 0,
      attack: 10,
      defense: 5,
      spells: [],
    },
    phase: 'initial',
    onCommandSelect: () => { },
  }
} 