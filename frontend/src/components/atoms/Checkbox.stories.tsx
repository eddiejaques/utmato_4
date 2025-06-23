import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Unchecked: Story = { args: { checked: false } }
export const Checked: Story = { args: { checked: true } }
export const Disabled: Story = { args: { checked: false, disabled: true } } 