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
    type: 'pot',
    position: { x: 0, y: 0 },
  },
}

export const Chest: Story = {
  args: {
    type: 'chest',
    position: { x: 0, y: 0 },
  },
} 