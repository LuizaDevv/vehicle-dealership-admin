'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/components/vehicle-card'
import { Eye, FileText, MoreVertical } from 'lucide-react'
import { differenceInCalendarMonths, parseISO, isAfter } from 'date-fns'

type PaymentStatus = 'em-dia' | 'inadimplente' | 'quitado'

function labelStatus(status: PaymentStatus) {
  if (status === 'em-dia') return 'Em dia'
  if (status === 'inadimplente') return 'Inadimplente'
  return 'Quitado'
}

function monthsLate(nextDueDate?: string): number {
  if (!nextDueDate) return 0
  try {
    const due = parseISO(nextDueDate)
    const now = new Date()
    if (!isAfter(now, due)) return 0
    return Math.max(0, differenceInCalendarMonths(now, due))
  } catch {
    return 0
  }
}

function lateToneByMonths(m: number): 'ok' | 'warn' | 'danger' {
  // Regra: mensal. 0 = verde, 1-2 = amarelo, 3+ = vermelho.
  if (m >= 3) return 'danger'
  if (m >= 1) return 'warn'
  return 'ok'
}

function toneClasses(tone: 'ok' | 'warn' | 'danger') {
  if (tone === 'ok') return 'bg-emerald-400'
  if (tone === 'warn') return 'bg-amber-400'
  return 'bg-rose-400'
}

export interface SoldVehicleCardProps {
  vehicle: Vehicle
  onOpen?: (vehicle: Vehicle) => void
  onReport?: (vehicle: Vehicle) => void
  className?: string
  draggable?: boolean
  onDragStart?: (id: string) => void
}

export function SoldVehicleCard({ vehicle, onOpen, onReport, className, draggable, onDragStart }: SoldVehicleCardProps) {
  const status = vehicle.status as PaymentStatus
  const m = monthsLate(vehicle.nextDueDate)
  const tone = status === 'em-dia' ? 'ok' : lateToneByMonths(m)

  return (
    <Card
      className={cn('rounded-2xl border-border/60 bg-card/60', className)}
      draggable={draggable}
      onDragStart={() => onDragStart?.(vehicle.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold leading-tight text-card-foreground">{vehicle.model}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {vehicle.plate} • {vehicle.year}
            </p>
            {vehicle.client ? (
              <p className="mt-1 text-sm font-medium text-card-foreground">Cliente: {vehicle.client}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Badge className="border border-white/10 bg-white/10 text-card-foreground">{labelStatus(status)}</Badge>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-white/10"
              aria-label="Mais opções"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Indicador de atraso (em meses) */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={cn('h-2.5 w-2.5 rounded-full', toneClasses(tone))} />
            <p className="text-sm text-muted-foreground">
              {status === 'em-dia' || m === 0 ? 'Em dia' : `Atraso: ${m} ${m === 1 ? 'mês' : 'meses'}`}
            </p>
          </div>
          <div className="text-base font-semibold text-card-foreground">{vehicle.price ?? '-'}</div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-9 rounded-xl border border-border/60 bg-white/10 text-card-foreground hover:bg-white/15"
              onClick={() => onOpen?.(vehicle)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-9 rounded-xl border border-border/60 bg-white/10 text-card-foreground hover:bg-white/15"
              onClick={() => onReport?.(vehicle)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Gerar relatório
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
