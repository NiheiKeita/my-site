import type { Meta, StoryObj } from '@storybook/react'
import { Map } from '.'

const meta = {
  title: 'Components/Map',
  component: Map,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Map>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    width: 8,
    height: 8,
  },
}

export const Small: Story = {
  args: {
    width: 4,
    height: 4,
  },
}

export const Large: Story = {
  args: {
    width: 12,
    height: 12,
  },
}

export const Rectangle: Story = {
  args: {
    width: 12,
    height: 8,
  },
} 