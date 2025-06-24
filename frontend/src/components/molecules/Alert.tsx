import { Icon } from '../atoms/Icon'
import React from 'react'

export interface AlertProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  onClose?: () => void
}

const typeIconMap = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
  warning: 'warning',
}

export function Alert({ message, type = 'info', onClose }: AlertProps) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded border shadow bg-white ${
      type === 'success' ? 'border-green-500' :
      type === 'error' ? 'border-red-500' :
      type === 'warning' ? 'border-yellow-500' :
      'border-blue-500'
    }`}>
      <Icon name={typeIconMap[type]} />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 text-xs text-muted-foreground">×</button>
      )}
    </div>
  )
} 