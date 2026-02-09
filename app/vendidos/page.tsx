import { AppSidebar } from '@/components/app-sidebar'
import { VehicleCard, type Vehicle } from '@/components/vehicle-card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

// Mock data
const vehicles: Vehicle[] = [
  { id: '10', model: 'Fiat Argo 2022', plate: 'STU-9012', year: 2022, status: 'em-dia', type: 'carro', client: 'João Silva' },
  { id: '11', model: 'Chevrolet Onix 2021', plate: 'VWX-3456', year: 2021, status: 'em-dia', type: 'carro', client: 'Maria Santos' },
  { id: '12', model: 'Renault Kwid 2023', plate: 'YZA-7890', year: 2023, status: 'em-dia', type: 'carro', client: 'Pedro Oliveira' },
  { id: '13', model: 'Honda Fit 2020', plate: 'BCD-1234', year: 2020, status: 'inadimplente', type: 'carro', client: 'Ana Costa' },
  { id: '14', model: 'Volkswagen Polo 2022', plate: 'EFG-5678', year: 2022, status: 'inadimplente', type: 'carro', client: 'Carlos Souza' },
  { id: '15', model: 'Toyota Yaris 2021', plate: 'HIJ-9012', year: 2021, status: 'quitado', type: 'carro', client: 'Juliana Lima' },
  { id: '16', model: 'Honda PCX 160', plate: 'KLM-3456', year: 2023, status: 'quitado', type: 'moto', client: 'Roberto Alves' },
]

export default function VendidosPage() {
  const emDia = vehicles.filter(v => v.status === 'em-dia')
  const inadimplente = vehicles.filter(v => v.status === 'inadimplente')
  const quitado = vehicles.filter(v => v.status === 'quitado')

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <main className="ml-16 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{'Vendidos'}</h1>
            <p className="mt-2 text-muted-foreground">{'Veículos vendidos organizados por status de pagamento'}</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por modelo, placa, cliente..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Kanban Columns by Payment Status */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Em Dia Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[var(--status-em-dia)]" />
                <h2 className="text-xl font-semibold text-foreground">
                  {'Em Dia'}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {`(${emDia.length})`}
                  </span>
                </h2>
              </div>
              
              <div className="space-y-3">
                {emDia.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    showClient
                    href={`/veiculo/${vehicle.id}`}
                  />
                ))}
                {emDia.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    {'Nenhum veículo nesta categoria'}
                  </p>
                )}
              </div>
            </div>

            {/* Inadimplente Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[var(--status-inadimplente)]" />
                <h2 className="text-xl font-semibold text-foreground">
                  {'Inadimplente'}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {`(${inadimplente.length})`}
                  </span>
                </h2>
              </div>
              
              <div className="space-y-3">
                {inadimplente.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    showClient
                    href={`/veiculo/${vehicle.id}`}
                  />
                ))}
                {inadimplente.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    {'Nenhum veículo nesta categoria'}
                  </p>
                )}
              </div>
            </div>

            {/* Quitado Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-[var(--status-quitado)]" />
                <h2 className="text-xl font-semibold text-foreground">
                  {'Quitado'}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {`(${quitado.length})`}
                  </span>
                </h2>
              </div>
              
              <div className="space-y-3">
                {quitado.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    showClient
                    href={`/veiculo/${vehicle.id}`}
                  />
                ))}
                {quitado.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    {'Nenhum veículo nesta categoria'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{'Nota: '}</span>
              {'Veículos quitados são automaticamente movidos para o Arquivo Morto.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
