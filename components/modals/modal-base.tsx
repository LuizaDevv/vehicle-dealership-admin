'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const sizeClasses: Record<ModalSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  // Almost fullscreen: wide and tall, keeps some margin around.
  // NOTE: shadcn/ui DialogContent ships with `sm:max-w-lg` by default.
  // For a true "almost fullscreen" modal, we must override the sm max-width too.
  full: 'w-[calc(100vw-2rem)] sm:w-[calc(100vw-4rem)] max-w-none sm:max-w-none',
}

/**
 * ModalBase
 * - closes correctly via X/overlay/ESC (Radix onOpenChange)
 * - prevents overflowing screen (internal scroll)
 * - uses theme colors (bg-card / border-border)
 */
export function ModalBase({
  open,
  onClose,
  title,
  description,
  size = 'lg',
  className,
  contentClassName,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  size?: ModalSize
  className?: string
  /** Optional wrapper class for the scroll area/content. */
  contentClassName?: string
  children: React.ReactNode
}) {
  const isFull = size === 'full'

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent
        className={cn(
          'bg-card text-card-foreground border-border/70 shadow-2xl backdrop-blur-md',
          // Fullscreen variant should be taller.
          isFull ? 'h-[92vh] max-h-[92vh] overflow-hidden p-0 sm:rounded-3xl' : 'max-h-[85vh] overflow-y-auto p-6 sm:p-7',
          sizeClasses[size],
          className
        )}
      >
        <div className={cn(isFull ? 'flex h-full flex-col' : undefined)}>
          <DialogHeader className={cn('pr-8', isFull ? 'px-6 pt-6' : undefined)}>
            <DialogTitle className="text-card-foreground">{title}</DialogTitle>
            {description ? <DialogDescription className="text-muted-foreground">{description}</DialogDescription> : null}
          </DialogHeader>

          <div
            className={cn(
              // In full mode, body scrolls and header stays visible.
              isFull ? 'flex-1 overflow-y-auto px-6 pb-6' : undefined,
              contentClassName
            )}
          >
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
