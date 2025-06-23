import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof Spinner>

export const Default: Story = { args: { size: 24 } }
export const Small: Story = { args: { size: 16 } }
export const Large: Story = { args: { size: 48 } } 