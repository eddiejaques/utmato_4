import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from './Icon'

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof Icon>

export const Default: Story = {
  render: () => (
    <Icon size={24} color="currentColor" title="Sample Icon">
      <circle cx="12" cy="12" r="10" />
    </Icon>
  ),
}
export const Large: Story = {
  render: () => (
    <Icon size={48} color="blue" title="Large Icon">
      <rect x="4" y="4" width="16" height="16" />
    </Icon>
  ),
} 