import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FileText, MoreVertical, FileCheck, Users } from 'lucide-react'


export interface Vehicle {
  id: string
  model: string
  plate: string
  year: number
  status: 'a-venda' | 'em-dia' | 'inadimplente' | 'quitado'
  type: 'carro' | 'moto'
  client?: string
  buyers?: number
  price?: number
}


interface VehicleCardProps {
  vehicle: Vehicle
  showClient?: boolean
  href?: string
  onSell?: (vehicle: Vehicle) => void
}


const statusConfig = {
  'a-venda': {
    label: 'À Venda',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  'em-dia': {
    label: 'Em dia',
    className: 'bg-[var(--status-em-dia)]/10 text-[var(--status-em-dia)] border-[var(--status-em-dia)]/20',
  },
  'inadimplente': {
    label: 'Inadimplente',
    className: 'bg-[var(--status-inadimplente)]/10 text-[var(--status-inadimplente)] border-[var(--status-inadimplente)]/20',
  },
  'quitado': {
    label: 'Quitado',
    className: 'bg-[var(--status-quitado)]/10 text-[var(--status-quitado)] border-[var(--status-quitado)]/20',
  },
}


export function VehicleCard({ vehicle, showClient = false, href, onSell }: VehicleCardProps) {
  const statusInfo = statusConfig[vehicle.status]
  
  const cardContent = (
    <Card className={cn(
      'overflow-hidden border transition-all hover:shadow-lg bg-card/50',
      href && 'cursor-pointer hover:border-primary/30'
    )}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-base">{vehicle.model}</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{vehicle.plate}</span>
              </div>
            </div>
            <Badge variant="outline" className={cn('text-xs font-medium border', statusInfo.className)}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* Price */}
          {vehicle.price && (
            <div className="text-sm font-semibold text-foreground">
              {'R$ '}{(vehicle.price / 1000).toFixed(0)}{'.000'}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent text-foreground gap-1 flex-1 justify-start"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onSell?.(vehicle)
              }}
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{'Vender'}</span>
            </Button>
            <div className="ml-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 4 21 4 23 6 20 20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></polyline>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (!href) {
    return <div>{cardContent}</div>
  }

  return (
    <Link href={href}>
      {cardContent}
    </Link>
  )
}
