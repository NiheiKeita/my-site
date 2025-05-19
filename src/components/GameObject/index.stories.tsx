import type { Meta, StoryObj } from '@storybook/react'
import { GameObject } from '.'

const meta = {
  title: 'Components/GameObject',
  component: GameObject,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GameObject>

export default meta
type Story = StoryObj<typeof meta>

export const Pot: Story = {
  args: {
    object: {
      type: 'pot',
      position: { x: 0, y: 0 },
      message: '壺の中に何かが入っている気がする...'
    },
    gridSize: 10,
  },
}

export const Chest: Story = {
  args: {
    object: {
      type: 'chest',
      position: { x: 0, y: 0 },
      message: '宝箱の中に何かが入っている気がする...'
    },
    gridSize: 10,
  },
} 