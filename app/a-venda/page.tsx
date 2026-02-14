'use client'

import * as React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { VehicleCard, type Vehicle } from '@/components/vehicle-card'
import { ModalAdicionarVeiculo, type VehicleDraft } from '@/components/modals/modal-adicionar-veiculo'
import { ModalVisualizarVeiculo } from '@/components/modals/modal-visualizar-veiculo'
import { ModalEditarVeiculo } from '@/components/modals/modal-editar-veiculo'
import { ModalVenderVeiculo } from '@/components/modals/modal-vender-veiculo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, SlidersHorizontal, Car, Bike, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KEYS, loadList, persistList, addCommissionForSale } from '@/lib/storage'

// Mock data (depois a gente troca por backend)
const initialVehicles: Vehicle[] = [
  { id: '1', model: 'Toyota Corolla 2022', plate: 'PZZ8E53', year: 2022, status: 'a-venda', type: 'carro', price: 'R$ 30.000,00' },
  { id: '2', model: 'Ford Ranger 2020', plate: 'XY21G56', year: 2020, status: 'a-venda', type: 'carro', price: 'R$ 85.000,00' },
  { id: '3', model: 'VW Gol 2018', plate: 'ABC-1234', year: 2018, status: 'a-venda', type: 'carro', price: 'R$ 28.000,00' },
  { id: '4', model: 'Honda Civic 2023', plate: 'DEF-9876', year: 2023, status: 'a-venda', type: 'carro', price: 'R$ 145.000,00' },
  { id: '5', model: 'Honda Biz 2021', plate: 'GHI-4321', year: 2021, status: 'a-venda', type: 'moto', price: 'R$ 12.500,00' },
  { id: '6', model: 'Yamaha Fazer 2022', plate: 'JKL-5555', year: 2022, status: 'a-venda', type: 'moto', price: 'R$ 19.900,00' },
]

type ModalKey = null | 'add' | 'view' | 'edit' | 'sell'

type FilterKey = 'none' | 'year' | 'type'

export default function AVendaPage() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>(() => loadList<Vehicle>(KEYS.forSale, initialVehicles))

  React.useEffect(() => {
    persistList(KEYS.forSale, vehicles)
  }, [vehicles])

  const [query, setQuery] = React.useState('')
  const [modal, setModal] = React.useState<ModalKey>(null)
  const [selected, setSelected] = React.useState<Vehicle | null>(null)

  // filtros (1 por vez)
  const [showFilters, setShowFilters] = React.useState(false)
  const [filterKey, setFilterKey] = React.useState<FilterKey>('none')
  const [filterValue, setFilterValue] = React.useState<string>('')

  // drag
  const [dragId, setDragId] = React.useState<string | null>(null)

  const years = React.useMemo(() => {
    const ys = Array.from(new Set(vehicles.map((v) => v.year))).sort((a, b) => b - a)
    return ys
  }, [vehicles])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = vehicles

    if (q) {
      list = list.filter((v) => v.model.toLowerCase().includes(q) || v.plate.toLowerCase().includes(q) || String(v.year).includes(q))
    }

    if (filterKey !== 'none' && filterValue) {
      if (filterKey === 'year') {
        const y = Number(filterValue)
        list = list.filter((v) => v.year === y)
      }
      if (filterKey === 'type') {
        list = list.filter((v) => v.type === (filterValue as any))
      }
    }

    return list
  }, [vehicles, query, filterKey, filterValue])

  const carros = filtered.filter((v) => v.type === 'carro')
  const motos = filtered.filter((v) => v.type === 'moto')

  function openModal(key: Exclude<ModalKey, null>, vehicle?: Vehicle) {
    if (vehicle) setSelected(vehicle)
    setModal(key)
  }

  function closeModal() {
    setModal(null)
  }

  function handleAdd(draft: VehicleDraft) {
    const id = String(Date.now())
    const next: Vehicle = {
      id,
      model: draft.model || '(Sem modelo)',
      plate: draft.plate || '—',
      year: Number(draft.year || new Date().getFullYear()),
      status: 'a-venda',
      type: draft.type,
      price: draft.price || '',
      notes: draft.notes,
      documents: draft.documents,
    }
    setVehicles((prev) => [next, ...prev])
  }

  function handleEdit(update: Partial<Vehicle> & { documents?: any[]; notes?: string; price?: string }) {
    if (!selected) return
    setVehicles((prev) => prev.map((v) => (v.id === selected.id ? { ...v, ...update } : v)))
  }

  function handleDelete(vehicle: Vehicle) {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id))
  }

  function handleDrop(targetType: 'carro' | 'moto') {
    if (!dragId) return
    setVehicles((prev) => prev.map((v) => (v.id === dragId ? { ...v, type: targetType } : v)))
    setDragId(null)
  }

  function clearFilters() {
    setFilterKey('none')
    setFilterValue('')
  }

  function setOnlyFilter(key: FilterKey, value: string) {
    // garante 1 filtro por vez
    setFilterKey(key)
    setFilterValue(value)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-16">
        {/* Top Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center gap-4 px-6">
            <div className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setShowFilters((v) => !v)} aria-label="Filtros">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>

              {showFilters ? (
                <div className="absolute left-0 top-12 w-72 rounded-2xl border border-white/10 bg-[#0b0920] p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Filtros</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-white/80 hover:bg-white/10" onClick={() => setShowFilters(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-3 space-y-3">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-white/50">Ano</p>
                      <Select
                        value={filterKey === 'year' ? filterValue : ''}
                        onValueChange={(v) => setOnlyFilter('year', v)}
                      >
                        <SelectTrigger className="border-white/15 bg-black/10 text-white">
                          <SelectValue placeholder="Selecionar ano" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0b0920] border-white/10 text-white">
                          {years.map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-white/50">Tipo</p>
                      <Select value={filterKey === 'type' ? filterValue : ''} onValueChange={(v) => setOnlyFilter('type', v)}>
                        <SelectTrigger className="border-white/15 bg-black/10 text-white">
                          <SelectValue placeholder="Carros ou motos" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0b0920] border-white/10 text-white">
                          <SelectItem value="carro">Carros</SelectItem>
                          <SelectItem value="moto">Motos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-9 rounded-xl bg-white/10 text-white hover:bg-white/15 border border-white/10 flex-1"
                        onClick={clearFilters}
                      >
                        Limpar
                      </Button>
                      <div className="text-xs text-white/50">1 filtro por vez</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-9 bg-background/50"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Button onClick={() => openModal('add')} className="rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Novo Veículo
              </Button>

              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">WP</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">A VENDA</h1>
            <div className="text-sm text-white/60">
              {filterKey !== 'none' && filterValue ? (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Filtro ativo • {filterKey}: {filterValue}
                </span>
              ) : (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Sem filtro</span>
              )}
            </div>
          </div>

          {/* Kanban */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section
              className="rounded-3xl border border-white/10 bg-card/40 p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('carro')}
            >
              <header className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-white/70" />
                  <h2 className="text-xl font-semibold text-white">Carros</h2>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">{carros.length}</span>
              </header>

              <div className={cn('space-y-3', carros.length === 0 && 'min-h-[120px]')}>
                {carros.length === 0 ? (
                  <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/10 text-sm text-white/50">
                    Arraste um veículo aqui
                  </div>
                ) : (
                  carros.map((v) => (
                    <VehicleCard
                      key={v.id}
                      vehicle={v}
                      onOpen={() => openModal('view', v)}
                      onEdit={() => openModal('edit', v)}
                      onSell={() => openModal('sell', v)}
                      onDelete={() => handleDelete(v)}
                      draggable
                      onDragStart={(id) => setDragId(id)}
                    />
                  ))
                )}
              </div>
            </section>

            <section
              className="rounded-3xl border border-white/10 bg-card/40 p-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('moto')}
            >
              <header className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bike className="h-5 w-5 text-white/70" />
                  <h2 className="text-xl font-semibold text-white">Motos</h2>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">{motos.length}</span>
              </header>

              <div className={cn('space-y-3', motos.length === 0 && 'min-h-[120px]')}>
                {motos.length === 0 ? (
                  <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/10 text-sm text-white/50">
                    Arraste um veículo aqui
                  </div>
                ) : (
                  motos.map((v) => (
                    <VehicleCard
                      key={v.id}
                      vehicle={v}
                      onOpen={() => openModal('view', v)}
                      onEdit={() => openModal('edit', v)}
                      onSell={() => openModal('sell', v)}
                      onDelete={() => handleDelete(v)}
                      draggable
                      onDragStart={(id) => setDragId(id)}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Modais */}
        <ModalAdicionarVeiculo open={modal === 'add'} onClose={closeModal} onSubmit={handleAdd} />
        <ModalVisualizarVeiculo
          open={modal === 'view'}
          onClose={closeModal}
          vehicle={selected}
          viewMode="a-venda"
          onEdit={() => {
            if (!selected) return
            setModal('edit')
          }}
        />
        <ModalEditarVeiculo open={modal === 'edit'} onClose={closeModal} vehicle={selected} onSubmit={handleEdit} />
        <ModalVenderVeiculo
          open={modal === 'sell'}
          onClose={closeModal}
          vehicle={selected}
          onConfirm={(payload) => {
            if (!selected) return
            const soldDate = payload.venda.dataVenda || new Date().toISOString().slice(0, 10)
            const soldVehicle: Vehicle = {
              ...selected,
              status: 'em-dia',
              client: payload.customer.nome || selected.client,
              soldDate,
              nextDueDate: payload.venda.vencimento || selected.nextDueDate,
              price: payload.venda.valorFinanciado || selected.price,
              // extras
              ...(payload.customer as any),
              entrada: (payload.venda as any).valorEntrada || '',
              payments: (payload.venda as any).payments || (selected as any).payments,
              contractText: (payload.venda as any).contractText || (selected as any).contractText,
              documents: [
                ...(((selected as any).documents ?? []) as any[]),
                ...((payload.customer.documentos ?? []) as any[]),
              ],
              notes: payload.venda.observacoes || (selected as any).notes,
            } as any

            // remove da lista À Venda
            setVehicles((prev) => prev.filter((v) => v.id !== selected.id))

            // adiciona em Vendidos (localStorage)
            const soldList = loadList<Vehicle>(KEYS.sold, [])
            const updatedSold = [soldVehicle, ...soldList]
            persistList(KEYS.sold, updatedSold)

            // comissão automática
            addCommissionForSale({
              type: selected.type,
              client: soldVehicle.client ?? '',
              vehicle: soldVehicle.model,
              plate: soldVehicle.plate,
              date: soldDate,
            })
          }}
        />
      </main>
    </div>
  )
}
