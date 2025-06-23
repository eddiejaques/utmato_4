import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = { args: { children: 'Default', variant: 'default' } }
export const Success: Story = { args: { children: 'Success', variant: 'success' } }
export const Warning: Story = { args: { children: 'Warning', variant: 'warning' } }
export const Danger: Story = { args: { children: 'Danger', variant: 'danger' } } 