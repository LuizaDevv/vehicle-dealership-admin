'use client'

import * as React from 'react'
import { VehicleCard, type Vehicle } from '@/components/vehicle-card'
import { ModalVisualizarVeiculo } from '@/components/modals/modal-visualizar-veiculo'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { KEYS, loadList } from '@/lib/storage'

function matches(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.toLowerCase())
}

export default function ConsultaPaiPage() {
  const [query, setQuery] = React.useState('')
  const [selected, setSelected] = React.useState<Vehicle | null>(null)
  const [openView, setOpenView] = React.useState(false)

  const [vehicles, setVehicles] = React.useState<Vehicle[]>([])

  React.useEffect(() => {
    const forSale = loadList<Vehicle>(KEYS.forSale, [])
    const sold = loadList<Vehicle>(KEYS.sold, [])
    const archived = loadList<Vehicle>(KEYS.archived, [])
    setVehicles([...forSale, ...sold, ...archived])
  }, [])

  const filtered = React.useMemo(() => {
    const q = query.trim()
    if (!q) return vehicles
    return vehicles.filter((v) => matches(`${v.model} ${v.plate} ${v.year} ${v.client ?? ''}`, q))
  }, [vehicles, query])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-7xl p-6">
        <header className="mb-6 animate-in fade-in-0 slide-in-from-top-1">
          <h1 className="text-3xl font-bold">Consulta</h1>
          <p className="mt-2 text-muted-foreground">Buscar veículos e baixar documentos.</p>
        </header>

        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por modelo, placa, ano..."
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-border/80 bg-card/60 p-8 text-center text-muted-foreground">
            Nenhum veículo encontrado.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                showSell={false}
                showEdit={false}
                showDelete={false}
                showReport={false}
                showTypePill
                showClient
                clientInline
                onOpen={() => {
                  setSelected(v)
                  setOpenView(true)
                }}
              />
            ))}
          </div>
        )}
      </main>

      <ModalVisualizarVeiculo
        open={openView}
        onClose={() => setOpenView(false)}
        vehicle={selected}
        fullScreen
        viewMode="consulta"
      />
    </div>
  )
}
