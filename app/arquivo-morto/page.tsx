'use client'

import * as React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { VehicleCard, type Vehicle } from '@/components/vehicle-card'
import { ModalVisualizarVeiculo } from '@/components/modals/modal-visualizar-veiculo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, SlidersHorizontal, Trash2, X } from 'lucide-react'
import { KEYS, loadList, persistList } from '@/lib/storage'

type Phase = { id: string; title: string }

type ArchivedVehicle = Vehicle & {
  phaseId: string
  archivedYear?: number
  // detalhes (mantém tudo)
  cpf?: string
  phone?: string
  valorTotal?: string
  entrada?: string
  comissao?: string
  contractText?: string
  specialConditions?: string
  payments?: any[]
}

const initialPhases: Phase[] = [
  { id: 'ano-2024', title: 'Quitado • 2024' },
  { id: 'ano-2023', title: 'Quitado • 2023' },
]

// Mock base (depois liga no backend)
const PHASES_KEY = 'mgm_archived_phases_v1'

const initialVehicles: ArchivedVehicle[] = [
  {
    id: '20',
    model: 'Ford Ka 2019',
    plate: 'NOP-1234',
    year: 2019,
    status: 'quitado',
    type: 'carro',
    client: 'Lucas Ferreira',
    cpf: '000.000.000-00',
    phone: '(31) 90000-0000',
    valorTotal: 'R$ 32.900,00',
    entrada: 'R$ 5.000,00',
    comissao: 'R$ 0,00',
    notes: 'Cliente já comprou com a gente antes. Preferência por contato no WhatsApp.',
    specialConditions: 'Entrega do veículo após vistoria. Transferência por conta do comprador.',
    contractText: `Contrato (exemplo):

1) As partes declaram...
2) Valor e forma de pagamento...
3) Cláusulas gerais...

(Aqui entra o texto completo do contrato.)`,
    documents: [],
    payments: [],
    archivedYear: 2023,
    phaseId: 'ano-2023',
  },
  {
    id: '24',
    model: 'Volkswagen Voyage 2021',
    plate: 'ZAB-7890',
    year: 2021,
    status: 'quitado',
    type: 'carro',
    client: 'Ricardo Mendes',
    cpf: '000.000.000-00',
    phone: '(31) 90000-0000',
    valorTotal: 'R$ 58.000,00',
    entrada: 'R$ 10.000,00',
    comissao: 'R$ 0,00',
    notes: 'Quitado sem atrasos.',
    specialConditions: 'Nenhuma.',
    contractText: 'Contrato (exemplo) — texto completo aqui.',
    documents: [],
    payments: [],
    archivedYear: 2024,
    phaseId: 'ano-2024',
  },
  {
    id: '27',
    model: 'Yamaha Factor 150',
    plate: 'IJK-9012',
    year: 2020,
    status: 'quitado',
    type: 'moto',
    client: 'Sandra Lima',
    cpf: '000.000.000-00',
    phone: '(31) 90000-0000',
    valorTotal: 'R$ 13.900,00',
    entrada: 'R$ 2.000,00',
    comissao: 'R$ 0,00',
    notes: 'Documentação ok.',
    specialConditions: 'Somente retirada com documento original.',
    contractText: 'Contrato (exemplo) — texto completo aqui.',
    documents: [],
    payments: [],
    archivedYear: 2024,
    phaseId: 'ano-2024',
  },
]

type FilterKey = 'none' | 'type' | 'year' | 'phase'

export default function ArquivoMortoPage() {
  const [phases, setPhases] = React.useState<Phase[]>(() => loadList<Phase>(PHASES_KEY, initialPhases))
  const [vehicles, setVehicles] = React.useState<ArchivedVehicle[]>(() => loadList<ArchivedVehicle>(KEYS.archived, initialVehicles))
  const [query, setQuery] = React.useState('')

  React.useEffect(() => {
    persistList(PHASES_KEY, phases)
  }, [phases])

  React.useEffect(() => {
    persistList(KEYS.archived, vehicles)
  }, [vehicles])

  const [showFilters, setShowFilters] = React.useState(false)
  const [filterKey, setFilterKey] = React.useState<FilterKey>('none')
  const [filterValue, setFilterValue] = React.useState('')

  const [dragId, setDragId] = React.useState<string | null>(null)

  const [openView, setOpenView] = React.useState(false)
  const [selected, setSelected] = React.useState<ArchivedVehicle | null>(null)

  const years = React.useMemo(() => {
    return Array.from(new Set(vehicles.map((v) => v.archivedYear).filter(Boolean) as number[])).sort((a, b) => b - a)
  }, [vehicles])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = vehicles

    if (q) {
      list = list.filter((v) => {
        const hay = [v.model, v.plate, v.client ?? '', String(v.year), String(v.archivedYear ?? '')].join(' ').toLowerCase()
        return hay.includes(q)
      })
    }

    if (filterKey !== 'none' && filterValue) {
      if (filterKey === 'type') list = list.filter((v) => v.type === (filterValue as any))
      if (filterKey === 'phase') list = list.filter((v) => v.phaseId === filterValue)
      if (filterKey === 'year') list = list.filter((v) => String(v.archivedYear ?? '') === filterValue)
    }

    return list
  }, [vehicles, query, filterKey, filterValue])

  const vehiclesByPhase = React.useMemo(() => {
    const map: Record<string, ArchivedVehicle[]> = {}
    for (const p of phases) map[p.id] = []
    for (const v of filtered) {
      if (!map[v.phaseId]) map[v.phaseId] = []
      map[v.phaseId].push(v)
    }
    return map
  }, [filtered, phases])

  function clearFilters() {
    setFilterKey('none')
    setFilterValue('')
  }

  function setOnlyFilter(key: FilterKey, value: string) {
    setFilterKey(key)
    setFilterValue(value)
  }

  function addPhase() {
    const title = window.prompt('Nome da nova fase (ex: Quitado • 2025, Cancelado, Distrato...)')
    const t = (title ?? '').trim()
    if (!t) return
    const id = `fase-${Date.now()}`
    setPhases((prev) => [{ id, title: t }, ...prev])
  }

  function deletePhase(phaseId: string) {
    if (phases.length <= 1) return
    const phase = phases.find((p) => p.id === phaseId)
    const ok = window.confirm(
      `Excluir a fase "${phase?.title ?? 'Fase'}"?\n\nOs veículos dessa fase serão movidos para outra fase.`
    )
    if (!ok) return

    const remaining = phases.filter((p) => p.id !== phaseId)
    const fallbackId = remaining[0]?.id ?? 'sem-fase'

    setPhases(remaining.length ? remaining : [{ id: 'sem-fase', title: 'Sem fase' }])
    setVehicles((prev) => prev.map((v) => (v.phaseId === phaseId ? { ...v, phaseId: fallbackId } : v)))

    // Se o filtro estava travado nessa fase, limpa
    if (filterKey === 'phase' && filterValue === phaseId) {
      setFilterKey('none')
      setFilterValue('')
    }
  }

  function openVehicle(vehicle: ArchivedVehicle) {
    setSelected(vehicle)
    setOpenView(true)
  }

  function handleDrop(phaseId: string) {
    if (!dragId) return
    setVehicles((prev) => prev.map((v) => (v.id === dragId ? { ...v, phaseId } : v)))
    setDragId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <main className="ml-16">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex h-16 items-center gap-4 px-6">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setShowFilters((v) => !v)}
                aria-label="Filtros"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>

              {showFilters ? (
                <div className="absolute left-0 top-12 w-80 rounded-2xl border border-border/70 bg-card p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Filtros</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-muted-foreground hover:bg-secondary/40"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-3 space-y-3">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Fase</p>
                      <Select value={filterKey === 'phase' ? filterValue : ''} onValueChange={(v) => setOnlyFilter('phase', v)}>
                        <SelectTrigger className="border-border/70 bg-background/30 text-foreground">
                          <SelectValue placeholder="Selecionar fase" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border/70 text-foreground">
                          {phases.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Ano</p>
                      <Select value={filterKey === 'year' ? filterValue : ''} onValueChange={(v) => setOnlyFilter('year', v)}>
                        <SelectTrigger className="border-border/70 bg-background/30 text-foreground">
                          <SelectValue placeholder="Selecionar ano" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border/70 text-foreground">
                          {years.map((y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Tipo</p>
                      <Select value={filterKey === 'type' ? filterValue : ''} onValueChange={(v) => setOnlyFilter('type', v)}>
                        <SelectTrigger className="border-border/70 bg-background/30 text-foreground">
                          <SelectValue placeholder="Carro ou moto" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border/70 text-foreground">
                          <SelectItem value="carro">Carro</SelectItem>
                          <SelectItem value="moto">Moto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-9 rounded-xl bg-secondary/40 text-foreground hover:bg-secondary/60 border border-border/70 flex-1"
                        onClick={clearFilters}
                      >
                        Limpar
                      </Button>
                      <div className="text-xs text-muted-foreground">1 filtro por vez</div>
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
                placeholder="Buscar por modelo, placa, cliente, ano..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-9 bg-background/40 border-border/70"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Button
                onClick={addPhase}
                className="rounded-xl bg-[var(--btn-edit)] text-white hover:bg-[var(--btn-edit)]/90 font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova fase
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">ARQUIVO MORTO</h1>
              <p className="mt-1 text-sm text-muted-foreground">Tudo fica salvo aqui (cliente, planilha, contrato, docs, observações e condições especiais).</p>
            </div>

            <div className="text-sm text-muted-foreground">
              {filterKey !== 'none' && filterValue ? (
                <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1">Filtro ativo • {filterKey}</span>
              ) : (
                <span className="rounded-full border border-border/70 bg-card/60 px-3 py-1">Sem filtro</span>
              )}
            </div>
          </div>

          {/* Kanban */}
          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            {phases.map((phase) => {
              const list = vehiclesByPhase[phase.id] ?? []
              return (
                <section
                  key={phase.id}
                  className="rounded-3xl border border-border/80 bg-card/60 p-4"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(phase.id)}
                >
                  <header className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">{phase.title}</h2>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-border/70 bg-background/30 px-3 py-1 text-sm text-foreground">{list.length}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-2xl text-muted-foreground hover:bg-white/10"
                        onClick={() => deletePhase(phase.id)}
                        aria-label="Excluir fase"
                        title="Excluir fase"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </header>

                  <div className={list.length === 0 ? 'min-h-[120px]' : 'space-y-3'}>
                    {list.length === 0 ? (
                      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/20 text-sm text-muted-foreground">
                        Arraste um veículo aqui
                      </div>
                    ) : (
                      list.map((v) => (
                        <VehicleCard
                          key={v.id}
                          vehicle={v}
                          showClient
                          clientInline
                          showTypePill
                          showSell={false}
                          showDelete={false}
                          onOpen={() => openVehicle(v)}
                          draggable
                          onDragStart={(id) => setDragId(id)}
                        />
                      ))
                    )}
                  </div>
                </section>
              )
            })}
          </div>
        </div>

        <ModalVisualizarVeiculo
          open={openView}
          onClose={() => setOpenView(false)}
          vehicle={selected}
          fullScreen
        />
      </main>
    </div>
  )
}
