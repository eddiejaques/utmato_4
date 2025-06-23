import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { children: 'Primary', variant: 'primary' } }
export const Secondary: Story = { args: { children: 'Secondary', variant: 'secondary' } }
export const Outlined: Story = { args: { children: 'Outlined', variant: 'outlined' } }
export const Text: Story = { args: { children: 'Text', variant: 'text' } }
export const Disabled: Story = { args: { children: 'Disabled', disabled: true } }
export const Small: Story = { args: { children: 'Small', size: 'sm' } }
export const Large: Story = { args: { children: 'Large', size: 'lg' } } 