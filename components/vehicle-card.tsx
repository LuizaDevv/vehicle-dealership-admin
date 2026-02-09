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
}


interface VehicleCardProps {
  vehicle: Vehicle
  showClient?: boolean
  href?: string
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


export function VehicleCard({ vehicle, showClient = false, href }: VehicleCardProps) {
  const statusInfo = statusConfig[vehicle.status]
  
  const cardContent = (
    <Card className={cn(
      'overflow-hidden border transition-all hover:shadow-lg',
      href && 'cursor-pointer hover:border-primary/30'
    )}>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between p-4 pb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{vehicle.model}</h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono text-xs">{vehicle.plate}</span>
                {vehicle.buyers && (
                  <>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {vehicle.buyers}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className={cn('text-xs font-medium border', statusInfo.className)}>
                {statusInfo.label}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>



          {/* Footer Actions */}
          <div className="flex items-center gap-1 border-t border-border/50 p-2 px-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <FileCheck className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <FileText className="h-4 w-4" />
            </Button>
            <div className="ml-auto text-xs text-muted-foreground">{'•••'}</div>
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
