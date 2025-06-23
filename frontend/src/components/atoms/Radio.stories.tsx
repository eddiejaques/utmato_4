import type { Meta, StoryObj } from '@storybook/react'
import { Radio } from './Radio'

const meta: Meta<typeof Radio> = {
  title: 'Atoms/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof Radio>

export const Unchecked: Story = { args: { checked: false } }
export const Checked: Story = { args: { checked: true } }
export const Disabled: Story = { args: { checked: false, disabled: true } } 