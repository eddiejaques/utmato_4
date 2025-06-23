import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = { args: { placeholder: 'Type here...' } }
export const Disabled: Story = { args: { placeholder: 'Disabled', disabled: true } } 