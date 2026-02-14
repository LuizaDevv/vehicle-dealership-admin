'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MoreVertical, Trash2, Pencil, DollarSign, Eye, FileText } from 'lucide-react'

export interface Vehicle {
  id: string
  model: string
  plate: string
  year: number
  status: 'a-venda' | 'em-dia' | 'inadimplente' | 'quitado'
  type: 'carro' | 'moto'
  client?: string
  buyers?: number
  price?: string
  notes?: string
  documents?: any[]
  // Vendidos
  soldDate?: string // ISO
  nextDueDate?: string // ISO (próximo vencimento)
}

interface VehicleCardProps {
  lateMonths?: number

  vehicle: Vehicle

  // Visual
  showClient?: boolean
  clientInline?: boolean // mostra "Cliente" logo abaixo da placa/ano
  showTypePill?: boolean // mostra "Carro"/"Moto" acima do nome
  className?: string

  // Ações
  onOpen?: (vehicle: Vehicle) => void
  onSell?: (vehicle: Vehicle) => void
  onEdit?: (vehicle: Vehicle) => void
  onDelete?: (vehicle: Vehicle) => void
  onReport?: (vehicle: Vehicle) => void

  showSell?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showReport?: boolean

  // DnD
  draggable?: boolean
  onDragStart?: (id: string) => void
}

function statusLabel(status: Vehicle['status']) {
  if (status === 'a-venda') return 'A venda'
  if (status === 'em-dia') return 'Em dia'
  if (status === 'inadimplente') return 'Inadimplente'
  if (status === 'quitado') return 'Quitado'
  return status
}

function statusBadgeClass(status: Vehicle['status']) {
  switch (status) {
    case 'em-dia':
      return 'bg-[var(--status-em-dia)]/25 text-[var(--status-em-dia)] border-[var(--status-em-dia)]/60'
    case 'inadimplente':
      return 'bg-[var(--status-inadimplente)]/25 text-[var(--status-inadimplente)] border-[var(--status-inadimplente)]/60'
    case 'quitado':
      return 'bg-[var(--status-quitado)]/25 text-[var(--status-quitado)] border-[var(--status-quitado)]/60'
    default:
      return 'bg-white/10 text-card-foreground border-border/60'
  }
}

export function VehicleCard({
  vehicle,
  lateMonths,
  showClient,
  clientInline,
  showTypePill,
  className,
  onOpen,
  onSell,
  onEdit,
  onDelete,
  onReport,
  showSell = true,
  showEdit = true,
  showDelete = true,
  showReport = false,
  draggable,
  onDragStart,
}: VehicleCardProps) {
  return (
    <Card
      className={cn(
        'rounded-2xl border border-border/80 bg-card/70 shadow-sm shadow-black/20 transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-md animate-in fade-in-0 slide-in-from-bottom-1',
        className
      )}
      draggable={draggable}
      onDragStart={() => onDragStart?.(vehicle.id)}
    >
      <CardContent className="p-4">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {showTypePill ? (
              <div className="mb-2">
                <span className="inline-flex w-fit items-center rounded-full border border-border/70 bg-background/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-sm shadow-black/10">
                  {vehicle.type === 'moto' ? 'Moto' : 'Carro'}
                </span>
              </div>
            ) : null}
            <p className="truncate text-lg font-semibold leading-tight text-card-foreground">{vehicle.model}</p>

            <div className="mt-1 space-y-1">
              <p className="text-sm text-muted-foreground">
                {vehicle.plate} • {vehicle.year}
              </p>

              {showClient && clientInline && vehicle.client ? (
                <p className="text-sm">
                  <span className="text-muted-foreground">Cliente: </span>
                  <span className="font-semibold text-card-foreground">{vehicle.client}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={cn('border', statusBadgeClass(vehicle.status))}>{statusLabel(vehicle.status)}</Badge>
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

        {/* Preço */}
        <div className="mt-3 text-base font-semibold text-card-foreground">{vehicle.price ?? '-'}</div>

        {/* Ações abaixo do preço */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="h-9 rounded-xl border border-border/80 bg-[var(--btn-info)]/20 text-card-foreground hover:bg-[var(--btn-info)]/30"
              onClick={() => onOpen?.(vehicle)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver
            </Button>

            {showSell ? (
              <Button
                type="button"
                variant="secondary"
                className="h-9 rounded-xl border border-border/80 bg-[var(--btn-success)]/20 text-card-foreground hover:bg-[var(--btn-success)]/30"
                onClick={() => onSell?.(vehicle)}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Vender
              </Button>
            ) : null}

            {showReport ? (
              <Button
                type="button"
                variant="secondary"
                className="h-9 rounded-xl border border-border/80 bg-[var(--btn-report)]/20 text-card-foreground hover:bg-[var(--btn-report)]/30"
                onClick={() => onReport?.(vehicle)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Gerar relatório
              </Button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {showEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-white/10"
                onClick={() => onEdit?.(vehicle)}
                aria-label="Editar"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            ) : null}

            {showDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-white/10"
                onClick={() => onDelete?.(vehicle)}
                aria-label="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>

        {/* Cliente no rodapé (modo antigo) */}
        {showClient && !clientInline && vehicle.client ? (
          <div className="mt-2 text-sm text-muted-foreground">Cliente: {vehicle.client}</div>
        ) : null}

        {typeof lateMonths === 'number' ? (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span
              className={cn(
                'h-3.5 w-3.5 rounded-full ring-2 ring-white/15',
                lateMonths <= 1
                  ? 'bg-[var(--status-em-dia)]'
                  : lateMonths <= 3
                    ? 'bg-[var(--status-inadimplente)]'
                    : 'bg-[var(--status-quitado)]'
              )}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">Atraso:</span>
            <span
              className={cn(
                'font-semibold',
                lateMonths <= 1
                  ? 'text-[var(--status-em-dia)]'
                  : lateMonths <= 3
                    ? 'text-[var(--status-inadimplente)]'
                    : 'text-[var(--status-quitado)]'
              )}
            >
              {lateMonths === 0 ? '0 mês' : `${lateMonths} ${lateMonths === 1 ? 'mês' : 'meses'}`}
            </span>
          </div>
        ) : null}

      </CardContent>
    </Card>
  )
}
