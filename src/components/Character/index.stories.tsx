import type { Meta, StoryObj } from '@storybook/react'
import { Character } from '.'

const meta = {
  component: Character,
  tags: ['autodocs'],
} satisfies Meta<typeof Character>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    position: { x: 0, y: 0 },
    direction: 'down',
  },
}

export const Up: Story = {
  args: {
    position: { x: 0, y: 0 },
    direction: 'up',
  },
}

export const Left: Story = {
  args: {
    position: { x: 0, y: 0 },
    direction: 'left',
  },
}

export const Right: Story = {
  args: {
    position: { x: 10, y: 10 },
    direction: 'right',
  },
} 