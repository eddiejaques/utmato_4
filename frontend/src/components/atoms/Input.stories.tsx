import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof Input>

export const Text: Story = { args: { type: 'text', placeholder: 'Text input' } }
export const Number: Story = { args: { type: 'number', placeholder: 'Number input' } }
export const Email: Story = { args: { type: 'email', placeholder: 'Email input' } }
export const Password: Story = { args: { type: 'password', placeholder: 'Password input' } }
export const Disabled: Story = { args: { type: 'text', placeholder: 'Disabled', disabled: true } } 