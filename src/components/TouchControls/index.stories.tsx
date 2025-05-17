import type { Meta, StoryObj } from '@storybook/react'
import { TouchControls } from '.'

const meta = {
  component: TouchControls,
  tags: ['autodocs'],
} satisfies Meta<typeof TouchControls>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onMove: () => { },
    onInteract: () => { },
  },
} 