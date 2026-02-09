import { AppSidebar } from '@/components/app-sidebar'
import { VehicleCard, type Vehicle } from '@/components/vehicle-card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

// Mock data - archived vehicles organized by year
const vehicles: (Vehicle & { archivedYear: number })[] = [
  { id: '20', model: 'Ford Ka 2019', plate: 'NOP-1234', year: 2019, status: 'quitado', type: 'carro', client: 'Lucas Ferreira', archivedYear: 2023 },
  { id: '21', model: 'Hyundai HB20 2018', plate: 'QRS-5678', year: 2018, status: 'quitado', type: 'carro', client: 'Patricia Rocha', archivedYear: 2023 },
  { id: '22', model: 'Nissan March 2020', plate: 'TUV-9012', year: 2020, status: 'quitado', type: 'carro', client: 'Fernando Dias', archivedYear: 2024 },
  { id: '23', model: 'Honda City 2019', plate: 'WXY-3456', year: 2019, status: 'quitado', type: 'carro', client: 'Amanda Costa', archivedYear: 2024 },
  { id: '24', model: 'Volkswagen Voyage 2021', plate: 'ZAB-7890', year: 2021, status: 'quitado', type: 'carro', client: 'Ricardo Mendes', archivedYear: 2024 },
  { id: '25', model: 'Chevrolet Prisma 2020', plate: 'CDE-1234', year: 2020, status: 'quitado', type: 'carro', client: 'Camila Souza', archivedYear: 2024 },
  { id: '26', model: 'Honda Biz 125', plate: 'FGH-5678', year: 2019, status: 'quitado', type: 'moto', client: 'Marcos Silva', archivedYear: 2023 },
  { id: '27', model: 'Yamaha Factor 150', plate: 'IJK-9012', year: 2020, status: 'quitado', type: 'moto', client: 'Sandra Lima', archivedYear: 2024 },
]

export default function ArquivoMortoPage() {
  // Group vehicles by archived year
  const vehiclesByYear = vehicles.reduce((acc, vehicle) => {
    const year = vehicle.archivedYear
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(vehicle)
    return acc
  }, {} as Record<number, typeof vehicles>)

  // Sort years in descending order
  const sortedYears = Object.keys(vehiclesByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <main className="ml-16 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{'Arquivo Morto'}</h1>
            <p className="mt-2 text-muted-foreground">{'Contratos quitados organizados por ano'}</p>
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

          {/* Columns by Year */}
          <div className="grid gap-6 lg:grid-cols-3">
            {sortedYears.map((year) => (
              <div key={year} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-foreground">
                    {year}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      {`(${vehiclesByYear[year].length})`}
                    </span>
                  </h2>
                </div>
                
                <div className="space-y-3 opacity-80">
                  {vehiclesByYear[year].map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      showClient
                      href={`/veiculo/${vehicle.id}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Info Note */}
          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{'Arquivo: '}</span>
              {'Veículos nesta seção são somente leitura. Todos os contratos foram quitados.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
