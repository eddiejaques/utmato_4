import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Toggle } from './Toggle'

const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof Toggle>

export const Off: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return <Toggle checked={checked} onChange={setChecked} />
  },
}
export const On: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return <Toggle checked={checked} onChange={setChecked} />
  },
}
export const Disabled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return <Toggle checked={checked} onChange={setChecked} disabled />
  },
} 