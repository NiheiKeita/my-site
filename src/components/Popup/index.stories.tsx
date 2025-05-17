import type { Meta, StoryObj } from '@storybook/react'
import { Popup } from '.'

const meta = {
  component: Popup,
  tags: ['autodocs'],
} satisfies Meta<typeof Popup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    content: 'これはポップアップの内容です。',
    onClose: () => console.log('Close popup'),
  },
} 