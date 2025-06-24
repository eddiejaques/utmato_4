import { Label } from '../ui/label'
import { Input } from '../atoms/Input'
import { Textarea } from '../atoms/Textarea'
import React from 'react'

export interface FormGroupProps {
  label: string
  htmlFor: string
  children?: React.ReactNode
  textarea?: boolean
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

export function FormGroup({ label, htmlFor, children, textarea, inputProps, textareaProps }: FormGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children ? children : textarea ? (
        <Textarea id={htmlFor} {...textareaProps} />
      ) : (
        <Input id={htmlFor} {...inputProps} />
      )}
    </div>
  )
} 