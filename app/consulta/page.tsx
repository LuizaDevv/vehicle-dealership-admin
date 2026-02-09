import { VehicleCard, type Vehicle } from '@/components/vehicle-card'
import { Input } from '@/components/ui/input'
import { Search, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Mock data - all vehicles in the system
const vehicles: Vehicle[] = [
  { id: '1', model: 'Honda Civic 2023', plate: 'ABC-1234', year: 2023, status: 'a-venda', type: 'carro' },
  { id: '2', model: 'Toyota Corolla 2022', plate: 'XYZ-5678', year: 2022, status: 'a-venda', type: 'carro' },
  { id: '10', model: 'Fiat Argo 2022', plate: 'STU-9012', year: 2022, status: 'em-dia', type: 'carro', client: 'João Silva' },
  { id: '11', model: 'Chevrolet Onix 2021', plate: 'VWX-3456', year: 2021, status: 'em-dia', type: 'carro', client: 'Maria Santos' },
  { id: '13', model: 'Honda Fit 2020', plate: 'BCD-1234', year: 2020, status: 'inadimplente', type: 'carro', client: 'Ana Costa' },
  { id: '15', model: 'Toyota Yaris 2021', plate: 'HIJ-9012', year: 2021, status: 'quitado', type: 'carro', client: 'Juliana Lima' },
  { id: '5', model: 'Honda CG 160', plate: 'JKL-7890', year: 2023, status: 'a-venda', type: 'moto' },
  { id: '6', model: 'Yamaha MT-03', plate: 'MNO-1234', year: 2022, status: 'a-venda', type: 'moto' },
]

export default function ConsultaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Simple Header - No Sidebar */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">{'G'}</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{'Sistema de Consulta'}</h1>
              <p className="text-xs text-muted-foreground">{'Modo somente leitura'}</p>
            </div>
          </div>
          
          <Badge variant="secondary" className="gap-2">
            <Eye className="h-3 w-3" />
            {'Consulta'}
          </Badge>
        </div>
      </header>
      
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Search Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
              {'Base de Dados de Veículos'}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {'Busque e consulte informações de veículos, clientes e documentos.'}
            </p>
            
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por modelo, placa, cliente, ano..."
                className="h-12 pl-11 text-base"
              />
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{'Modo de Consulta: '}</span>
              {'Você tem acesso somente leitura. Pode visualizar informações de veículos, clientes e baixar documentos, mas não pode editar dados ou acessar informações financeiras.'}
            </p>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{'Total de Veículos'}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{vehicles.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{'À Venda'}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {vehicles.filter(v => v.status === 'a-venda').length}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{'Vendidos'}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {vehicles.filter(v => v.status === 'em-dia' || v.status === 'inadimplente').length}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{'Quitados'}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {vehicles.filter(v => v.status === 'quitado').length}
              </p>
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {'Todos os Veículos'}
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  showClient={!!vehicle.client}
                  href={`/consulta/${vehicle.id}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4">
        <div className="mx-auto max-w-7xl px-8">
          <p className="text-center text-xs text-muted-foreground">
            {'Sistema de Gestão de Concessionária - Modo de Consulta'}
          </p>
        </div>
      </footer>
    </div>
  )
}
