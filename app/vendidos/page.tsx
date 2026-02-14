'use client'

import * as React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { VehicleCard, type Vehicle } from '@/components/vehicle-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Search, Filter } from 'lucide-react'
import { parseISO } from 'date-fns'
import { ModalVisualizarVeiculo } from '@/components/modals/modal-visualizar-veiculo'
import { ModalEditarVeiculo } from '@/components/modals/modal-editar-veiculo'
import { toast } from 'sonner'
import { KEYS, loadList, persistList } from '@/lib/storage'

type PaymentStatus = 'em-dia' | 'inadimplente' | 'quitado'

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: '10',
    model: 'Fiat Argo 2022',
    plate: 'STU-9012',
    year: 2022,
    status: 'em-dia',
    type: 'carro',
    client: 'João Silva',
    price: 'R$ 54.900,00',
    soldDate: '2025-11-12',
    nextDueDate: '2026-02-10',
  },
  {
    id: '11',
    model: 'Chevrolet Onix 2021',
    plate: 'VWX-3456',
    year: 2021,
    status: 'inadimplente',
    type: 'carro',
    client: 'Maria Santos',
    price: 'R$ 49.900,00',
    soldDate: '2025-08-03',
    nextDueDate: '2025-12-10', // ~2 meses
  },
  {
    id: '12',
    model: 'Honda Fit 2020',
    plate: 'BCD-1234',
    year: 2020,
    status: 'inadimplente',
    type: 'carro',
    client: 'Ana Costa',
    price: 'R$ 46.000,00',
    soldDate: '2025-05-22',
    nextDueDate: '2025-10-10', // >=3 meses
  },
]

function monthsLate(nextDueDateIso?: string) {
  if (!nextDueDateIso) return 0
  const due = parseISO(nextDueDateIso)
  const now = new Date()
  if (now <= due) return 0
  // cálculo em meses (parcelas mensais): arredonda para cima
  const months = (now.getFullYear() - due.getFullYear()) * 12 + (now.getMonth() - due.getMonth())
  // se passou do dia do mês do vencimento, conta como mais um mês (parcela mensal)
  const extra = now.getDate() > due.getDate() ? 1 : 0
  return Math.max(1, months + extra)
}

function matchesText(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.toLowerCase())
}

export default function VendidosPage() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>(() => {
    const stored = loadList<Vehicle>(KEYS.sold, INITIAL_VEHICLES.filter(v => v.status !== 'quitado'))
    return stored.filter(v => v.status !== 'quitado')
  })


  const [draggingId, setDraggingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    persistList(KEYS.sold, vehicles)
  }, [vehicles])

  // Filtros (aqui pode combinar vários ao mesmo tempo)
  const [query, setQuery] = React.useState('')
  const [plate, setPlate] = React.useState('')
  const [model, setModel] = React.useState('')
  const [client, setClient] = React.useState('')
  const [from, setFrom] = React.useState('') // YYYY-MM-DD
  const [to, setTo] = React.useState('') // YYYY-MM-DD
  const [showFilters, setShowFilters] = React.useState(false)

  const activeFiltersCount = React.useMemo(() => {
    return [plate, model, client, from, to].filter(v => (v ?? '').toString().trim().length > 0).length
  }, [plate, model, client, from, to])

  // Modais (começando igual À venda)
  const [openView, setOpenView] = React.useState(false)
  const [selected, setSelected] = React.useState<Vehicle | null>(null)

  const [openEdit, setOpenEdit] = React.useState(false)
  const [selectedEdit, setSelectedEdit] = React.useState<Vehicle | null>(null)

  const filteredVehicles = React.useMemo(() => {
    return vehicles.filter(v => {
      const q = query.trim()
      if (q) {
        const blob = `${v.model} ${v.plate} ${v.year} ${v.client ?? ''}`
        if (!matchesText(blob, q)) return false
      }
      if (plate.trim() && !matchesText(v.plate, plate.trim())) return false
      if (model.trim() && !matchesText(v.model, model.trim())) return false
      if (client.trim() && !matchesText(v.client ?? '', client.trim())) return false

      if (from) {
        if (!v.soldDate) return false
        if (v.soldDate < from) return false
      }
      if (to) {
        if (!v.soldDate) return false
        if (v.soldDate > to) return false
      }

      return true
    })
  }, [vehicles, query, plate, model, client, from, to])

  const byStatus = React.useMemo(() => {
    const emDia = filteredVehicles.filter(v => v.status === 'em-dia')
    const inad = filteredVehicles.filter(v => v.status === 'inadimplente')
    // Quitado não fica na aba (coluna só serve como "drop target")
    const quitado: Vehicle[] = []
    return { emDia, inad, quitado }
  }, [filteredVehicles])

  function handleOpen(vehicle: Vehicle) {
    setSelected(vehicle)
    setOpenView(true)
  }

  function handleEdit(vehicle: Vehicle) {
    setSelectedEdit(vehicle)
    setOpenEdit(true)
  }

  function handleReport(vehicle: Vehicle) {
    toast('Relatório ainda sem backend', {
      description: `Vamos ligar esse botão quando o backend estiver pronto: ${vehicle.model}`,
    })
  }

  function updateStatus(vehicleId: string, status: PaymentStatus) {
    setVehicles(prev => prev.map(v => (v.id === vehicleId ? { ...v, status } : v)))
  }

  function updateVehicle(vehicleId: string, patch: Partial<Vehicle>) {
    setVehicles(prev => prev.map(v => (v.id === vehicleId ? { ...v, ...patch } : v)))
  }

  function archiveVehicle(v: Vehicle) {
    setVehicles(prev => prev.filter(x => x.id !== v.id))
    try {
      const key = KEYS.archived
      const existing = JSON.parse(localStorage.getItem(key) ?? '[]')
      localStorage.setItem(key, JSON.stringify([...existing, { ...v, status: 'quitado' }]))
    } catch {
      toast.error('Erro ao mover para o Arquivo Morto', {
        description: 'Não foi possível salvar localmente (localStorage).',
      })
    }
  }

function onDrop(targetStatus: PaymentStatus) {
    if (!draggingId) return
    if (targetStatus === 'quitado') {
      const v = vehicles.find(x => x.id === draggingId)
      if (v) archiveVehicle(v)
      toast.success('Mudou para Quitado', {
        description: 'Movido automaticamente para o Arquivo Morto.',
      })
    } else {
      updateStatus(draggingId, targetStatus)
      toast.success(`Mudou para ${targetStatus === 'em-dia' ? 'Em dia' : 'Inadimplente'}`)
    }
    setDraggingId(null)
  }

  function Column({
    title,
    count,
    status,
    dotClass,
    children,
  }: {
    title: string
    count: number
    status: PaymentStatus
    dotClass: string
    children: React.ReactNode
  }) {
    return (
      <section
        className="rounded-3xl border border-border/80 bg-card/60 p-4 transition-colors duration-200"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => onDrop(status)}
      >
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${dotClass}`} />
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
          <span className="rounded-full border border-border/70 bg-background/30 px-3 py-1 text-sm text-foreground">
            {count}
          </span>
        </header>

        <div className={count === 0 ? 'min-h-[120px]' : 'space-y-3'}>
          {count === 0 ? (
            <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/20 text-sm text-muted-foreground">
              Arraste um veículo aqui
            </div>
          ) : (
            <div className="space-y-3">{children}</div>
          )}
        </div>
      </section>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-16 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Vendidos</h1>
              <p className="mt-2 text-muted-foreground">Veículos vendidos organizados por status de pagamento</p>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="rounded-xl border border-border/80 bg-[var(--btn-info)]/20 text-card-foreground hover:bg-[var(--btn-info)]/30"
              onClick={() => setShowFilters(v => !v)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? 'Encolher filtros' : 'Mostrar filtros'}
            </Button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por modelo, placa, cliente..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Filters */}
          <Accordion type="single" collapsible value={showFilters ? 'filters' : ''}>
            <AccordionItem value="filters" className="border-none">
              <AccordionTrigger
                onClick={() => setShowFilters(v => !v)}
                className="mb-3 rounded-2xl border border-border/80 bg-card/60 px-4 py-3 text-left hover:no-underline"
              >
                <div className="flex w-full items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-card-foreground">Filtros avançados</div>
                    <div className="text-xs text-muted-foreground">Abra/feche para não poluir a tela</div>
                  </div>

                  {activeFiltersCount > 0 ? (
                    <div className="rounded-full border border-border/80 bg-background/30 px-3 py-1 text-xs text-card-foreground">
                      {activeFiltersCount} filtro{activeFiltersCount === 1 ? '' : 's'} ativo{activeFiltersCount === 1 ? '' : 's'}
                    </div>
                  ) : null}
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="mb-6 grid gap-3 rounded-2xl border border-border/80 bg-card/60 p-4 md:grid-cols-2 lg:grid-cols-3">
                  <Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Filtrar por placa" />
                  <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Filtrar por modelo" />
                  <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Filtrar por cliente" />

                  <div className="grid grid-cols-2 gap-3 md:col-span-2 lg:col-span-3">
                    <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="De" />
                    <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Até" />
                  </div>

                  <div className="flex flex-wrap gap-2 md:col-span-2 lg:col-span-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="rounded-xl border border-border/80 bg-[var(--btn-warning)]/20 text-card-foreground hover:bg-[var(--btn-warning)]/30"
                      onClick={() => {
                        setPlate('')
                        setModel('')
                        setClient('')
                        setFrom('')
                        setTo('')
                        toast('Filtros limpos')
                      }}
                    >
                      Limpar filtros
                    </Button>
                    <p className="self-center text-sm text-muted-foreground">
                      Aqui você pode combinar vários filtros ao mesmo tempo.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Kanban */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Column
              title="Em dia"
              count={byStatus.emDia.length}
              status="em-dia"
              dotClass="bg-[var(--status-em-dia)]"
            >
              {byStatus.emDia.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  showClient
                  clientInline
                  showSell={false}
                  showReport
                  lateMonths={monthsLate(vehicle.nextDueDate)}
                  onOpen={handleOpen}
                  onEdit={handleEdit}
                  onReport={handleReport}
                  draggable
                  onDragStart={setDraggingId}
                />
              ))}
              {byStatus.emDia.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Nenhum veículo nesta categoria</p>
              ) : null}
            </Column>

            <Column
              title="Inadimplente"
              count={byStatus.inad.length}
              status="inadimplente"
              dotClass="bg-[var(--status-inadimplente)]"
            >
              {byStatus.inad.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  showClient
                  clientInline
                  showSell={false}
                  showReport
                  lateMonths={monthsLate(vehicle.nextDueDate)}
                  onOpen={handleOpen}
                  onEdit={handleEdit}
                  onReport={handleReport}
                  draggable
                  onDragStart={setDraggingId}
                />
              ))}
              {byStatus.inad.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Nenhum veículo nesta categoria</p>
              ) : null}
            </Column>

            <Column
              title="Quitado"
              count={0}
              status="quitado"
              dotClass="bg-[var(--status-quitado)]"
            >
              <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-4 text-sm text-muted-foreground">
                Arraste um veículo para cá para marcar como <span className="font-semibold text-card-foreground">Quitado</span>.
                <div className="mt-2">Quitados são movidos automaticamente para o <span className="font-semibold text-card-foreground">Arquivo Morto</span>.</div>
              </div>
            </Column>
          </div>

          {/* Nota */}
          <div className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Atrasos (mensal): </span>
              0–1 mês (verde), 2–3 meses (amarelo) e acima de 4 meses (vermelho).
            </p>
          </div>
        </div>
      </main>

      {/* Modal de visualizar (reaproveitado) */}
      <ModalVisualizarVeiculo
        open={openView}
        onClose={() => setOpenView(false)}
        vehicle={selected}
        fullScreen
        onEdit={() => {
          if (!selected) return
          setSelectedEdit(selected)
          setOpenEdit(true)
        }}
        onUpdate={(patch) => {
          if (!selected) return
          updateVehicle(selected.id, patch as any)
          setSelected((prev) => (prev && prev.id === selected.id ? ({ ...prev, ...(patch as any) } as any) : prev))
        }}
      />

      {/* Modal de editar (corrige botão Editar na aba Vendidos) */}
      <ModalEditarVeiculo
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        vehicle={selectedEdit}
        onSubmit={(next) => {
          if (!selectedEdit) return
          updateVehicle(selectedEdit.id, next as any)
          toast.success('Veículo atualizado', { description: 'Alterações salvas localmente.' })
        }}
      />
    </div>
  )
}
