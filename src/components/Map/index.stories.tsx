import type { Meta, StoryObj } from '@storybook/react'
import { Map } from '.'

const meta = {
  component: Map,
  tags: ['autodocs'],
} satisfies Meta<typeof Map>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {} 