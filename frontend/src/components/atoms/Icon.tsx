import * as React from 'react'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  color?: string
  title?: string
}

export function Icon({ size = 20, color = 'currentColor', title, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill={color}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
} 