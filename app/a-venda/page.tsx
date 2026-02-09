import { AppSidebar } from '@/components/app-sidebar'
import { VehicleCard, type Vehicle } from '@/components/vehicle-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Plus, SlidersHorizontal, Bell, HelpCircle, ChevronDown, MoreHorizontal, Car, Bike, CheckCircle, Circle } from 'lucide-react'

// Mock data
const vehicles: Vehicle[] = [
  { id: '1', model: 'Toyota Corolla 2022', plate: 'PZZ8E53', year: 2022, status: 'a-venda', type: 'carro' },
  { id: '2', model: 'Ford Ranger 2020', plate: 'XY21G56', year: 2020, status: 'a-venda', type: 'carro' },
  { id: '3', model: 'Volkswagen Gol 2017', plate: 'HTL5B21', year: 2017, status: 'a-venda', type: 'carro' },
  { id: '4', model: 'Honda Civic 2018', plate: 'GHT9D31', year: 2018, status: 'a-venda', type: 'carro' },
  { id: '5', model: 'Honda CB 3000', plate: 'FGD2H12', year: 2023, status: 'a-venda', type: 'moto', buyers: 2 },
  { id: '6', model: 'Yamaha Fazer 2021', plate: 'HJL7K21', year: 2021, status: 'a-venda', type: 'moto', buyers: 2 },
  { id: '7', model: 'Honda Biz 2020', plate: 'QWE8N20', year: 2020, status: 'a-venda', type: 'moto', buyers: 2 },
  { id: '8', model: 'Yamaha XTZ 2018', plate: 'BNC6C34', year: 2018, status: 'a-venda', type: 'moto', buyers: 2 },
]

export default function AVendaPage() {
  const carros = vehicles.filter(v => v.type === 'carro')
  const motos = vehicles.filter(v => v.type === 'moto')
  const totalVehicles = vehicles.length

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <main className="ml-[180px] flex-1">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center gap-4 px-6">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar..."
                className="pl-9 h-9 bg-background/50"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <div className="h-6 w-px bg-border" />
              <Button variant="ghost" className="gap-2 h-9">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{'WP'}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{'Warien Paz'}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{'À Venda'}</h1>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                {'Novo Veículo'}
              </Button>
            </div>

            {/* Kanban Columns */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Carros Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">{'Carros'}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Circle className="h-3 w-3 fill-muted stroke-muted" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {carros.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      href={`/veiculo/${vehicle.id}`}
                    />
                  ))}
                </div>
              </div>

              {/* Motos Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-foreground">{'Motos'}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Circle className="h-3 w-3 fill-muted stroke-muted" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {motos.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      href={`/veiculo/${vehicle.id}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Stats */}
          <aside className="w-80 border-l border-border bg-card/50 p-6">
            <div className="space-y-6">
              {/* Segurtar Section */}
              <div>
                <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{'SEGURTAR'}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Circle className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Circle className="h-3 w-3 fill-muted stroke-muted" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Circle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Total Card */}
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{'Total'}</span>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Circle className="h-3 w-3 fill-muted stroke-muted" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Circle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-background p-3">
                    <span className="text-sm">{'A Venda'}</span>
                    <span className="font-semibold">{totalVehicles}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
                    <span className="text-sm text-primary">{'Vendidos'}</span>
                    <span className="font-semibold text-primary">{'24'}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-background p-3">
                    <span className="text-sm">{'Arquivo Morto'}</span>
                    <span className="font-semibold">{'48'}</span>
                  </div>
                </div>
              </div>

              {/* Total Recebido */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{'Total Recebido'}</span>
                  <Badge variant="outline" className="text-xs">{'(Mai)'}</Badge>
                </div>
                <p className="text-3xl font-bold">{'R$ 15.620'}</p>
              </div>

              {/* Próximos Meses */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium">{'Próximos meses'}</span>
                  <span className="text-xs text-muted-foreground">{'Maio'}</span>
                </div>

                <div className="space-y-3">
                  <Card>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{'05/05/24'}</span>
                          <span className="text-muted-foreground">{'02/05/24'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{'Vinícius Oliveira'}</span>
                          <CheckCircle className="h-4 w-4 text-[var(--status-em-dia)]" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-mono">{'R$ 1.280,00'}</span>
                          <span className="font-mono">{'R1 230,00'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{'08/05/24'}</span>
                          <span className="text-muted-foreground">{'02/05/24'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{'Maria Souza'}</span>
                          <CheckCircle className="h-4 w-4 text-[var(--status-em-dia)]" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-mono">{'R$ 879,00'}</span>
                          <span className="font-mono">{'R$ 879,00'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button className="mt-4 w-full bg-primary hover:bg-primary/90">
                  {'Ver Relatórios'}
                </Button>
              </div>

              {/* More Section */}
              <div className="pt-4 border-t border-border">
                <Button variant="ghost" className="w-full justify-between">
                  <span>{'More'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
