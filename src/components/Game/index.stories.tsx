import type { Meta, StoryObj } from '@storybook/react'
import { Game } from '.'

const meta: Meta<typeof Game> = {
  component: Game,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {} 