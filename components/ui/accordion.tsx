'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

// Componente raiz do accordion
const Accordion = AccordionPrimitive.Root

// ITEM
type AccordionItemProps =
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    className?: string
    children?: React.ReactNode
  }

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    data-slot="accordion-item"
    className={cn('border-b', className)}
    {...props}
  >
    {children}
  </AccordionPrimitive.Item>
))

AccordionItem.displayName = 'AccordionItem'

// TRIGGER (onde clica para abrir/fechar)
type AccordionTriggerProps =
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    className?: string
    children?: React.ReactNode
  }

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      data-slot="accordion-trigger"
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
        '[&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))

AccordionTrigger.displayName = 'AccordionTrigger'

// CONTENT (parte que aparece quando abre)
type AccordionContentProps =
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    className?: string
    children?: React.ReactNode
  }

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    data-slot="accordion-content"
    className={cn(
      'overflow-hidden text-sm transition-all',
      'data-[state=closed]:animate-accordion-up',
      'data-[state=open]:animate-accordion-down',
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
