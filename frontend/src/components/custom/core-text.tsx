'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CoreTextProps extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | 'title'
    | 'subtitle'
    | 'heading'
    | 'subheading'
    | 'content'
    | 'muted'
    | 'caption'
    | 'bold'
    | 'label'
    | 'code'
  as?: React.ElementType
}

const variantClasses: Record<NonNullable<CoreTextProps['variant']>, string> = {
  title: 'text-3xl font-bold text-foreground',
  subtitle: 'text-2xl font-semibold text-foreground',
  heading: 'text-xl font-semibold text-foreground',
  subheading: 'text-lg font-medium text-foreground',
  content: 'text-base text-foreground',
  muted: 'text-sm text-muted-foreground',
  caption: 'text-xs text-muted-foreground',
  bold: 'text-base font-semibold text-foreground',
  label: 'text-sm font-medium text-foreground',
  code: 'text-sm font-mono bg-muted px-1 py-0.5 rounded text-foreground',
}

export const CoreText = React.forwardRef<HTMLElement, CoreTextProps>(
  ({ variant = 'content', as: Component = 'p', className, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(variantClasses[variant], 'leading-tight', className)}
        {...props}
      />
    )
  },
)

CoreText.displayName = 'CoreText'
