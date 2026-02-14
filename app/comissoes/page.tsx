'use client'

import * as React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ModalAdicionarComissao, type CommissionCreatePayload, type CommissionType } from '@/components/modals/modal-adicionar-comissao'
import { toast } from 'sonner'
import { Plus, Check, Wallet } from 'lucide-react'

type CommissionStatus = 'a-receber' | 'recebido'

type Commission = {
  id: string
  type: CommissionType
  client: string
  vehicle: string
  plate: string
  date: string // YYYY-MM-DD
  amount: number
  status: CommissionStatus
}

const COMMISSIONS_KEY = 'mgm_commissions_v1'
const RATES_KEY = 'mgm_commission_rates_v1'

function loadRates() {
  if (typeof window === 'undefined') return { carro: 200, moto: 100 }
  try {
    const raw = window.localStorage.getItem(RATES_KEY)
    if (!raw) return { carro: 200, moto: 100 }
    const parsed = JSON.parse(raw)
    return { carro: Number(parsed?.carro ?? 200), moto: Number(parsed?.moto ?? 100) }
  } catch {
    return { carro: 200, moto: 100 }
  }
}

function loadCommissions(): Commission[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(COMMISSIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Commission[]) : []
  } catch {
    return []
  }
}

function persistCommissions(list: Commission[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(list))
}

function statusLabel(s: CommissionStatus) {
  return s === 'recebido' ? 'Recebido' : 'A receber'
}

function statusBadgeClass(s: CommissionStatus) {
  return s === 'recebido'
    ? 'bg-[var(--status-em-dia)]/25 text-[var(--status-em-dia)] border-[var(--status-em-dia)]/60'
    : 'bg-[var(--status-inadimplente)]/15 text-[var(--status-inadimplente)] border-[var(--status-inadimplente)]/60'
}

export default function ComissoesPage() {
  const [openAdd, setOpenAdd] = React.useState(false)
  const [items, setItems] = React.useState<Commission[]>([])
  const [tab, setTab] = React.useState<'todas' | 'a-receber' | 'recebidas'>('todas')

  React.useEffect(() => {
    setItems(loadCommissions())
  }, [])

  const filtered = React.useMemo(() => {
    if (tab === 'todas') return items
    if (tab === 'recebidas') return items.filter((x) => x.status === 'recebido')
    return items.filter((x) => x.status === 'a-receber')
  }, [items, tab])

  const totals = React.useMemo(() => {
    const aReceber = items.filter((x) => x.status === 'a-receber').reduce((s, x) => s + x.amount, 0)
    const recebido = items.filter((x) => x.status === 'recebido').reduce((s, x) => s + x.amount, 0)
    return { aReceber, recebido, total: aReceber + recebido }
  }, [items])

  function addCommission(payload: CommissionCreatePayload) {
    const rates = loadRates()
    const amount = payload.type === 'moto' ? rates.moto : rates.carro
    const next: Commission = {
      id: `cm-${Date.now()}`,
      type: payload.type,
      client: payload.client,
      vehicle: payload.vehicle,
      plate: payload.plate,
      date: payload.date,
      amount,
      status: 'a-receber',
    }

    setItems((prev) => {
      const updated = [next, ...prev]
      persistCommissions(updated)
      return updated
    })
    toast.success('Comissão adicionada')
  }

  function markReceived(id: string) {
    setItems((prev) => {
      const updated = prev.map((x) => (x.id === id ? { ...x, status: 'recebido' } : x))
      persistCommissions(updated)
      return updated
    })
    toast.success('Marcado como recebido')
  }

  function remove(id: string) {
    if (!confirm('Excluir esta comissão?')) return
    setItems((prev) => {
      const updated = prev.filter((x) => x.id !== id)
      persistCommissions(updated)
      return updated
    })
    toast.success('Comissão removida')
  }

  function money(n: number) {
    try {
      return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    } catch {
      return `R$ ${n}`
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />
      <main className="ml-16 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-wrap items-start justify-between gap-4 animate-in fade-in-0 slide-in-from-top-1">
            <div>
              <h1 className="text-3xl font-bold">Minhas Comissões</h1>
              <p className="text-muted-foreground">Comissão por venda (carro/moto).</p>
            </div>
            <Button onClick={() => setOpenAdd(true)} className="rounded-2xl gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Comissão
            </Button>
          </header>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="rounded-3xl border-border/80 bg-card/60 shadow-sm shadow-black/20 animate-in fade-in-0 slide-in-from-bottom-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>A Receber</span>
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-[var(--status-inadimplente)]">{money(totals.aReceber)}</div>
                <p className="text-sm text-muted-foreground">{items.filter((x) => x.status === 'a-receber').length} comissão(ões) pendente(s)</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/80 bg-card/60 shadow-sm shadow-black/20 animate-in fade-in-0 slide-in-from-bottom-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recebido</span>
                  <Check className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-[var(--status-em-dia)]">{money(totals.recebido)}</div>
                <p className="text-sm text-muted-foreground">{items.filter((x) => x.status === 'recebido').length} comissão(ões) recebida(s)</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/80 bg-card/60 shadow-sm shadow-black/20 animate-in fade-in-0 slide-in-from-bottom-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="rounded-2xl border border-border/70 bg-background/20 p-2 text-muted-foreground">$</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold text-primary">{money(totals.total)}</div>
                <p className="text-sm text-muted-foreground">{items.length} comissão(ões) no total</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-1">
            <Button
              variant={tab === 'todas' ? 'default' : 'secondary'}
              className="rounded-2xl"
              onClick={() => setTab('todas')}
            >
              Todas ({items.length})
            </Button>
            <Button
              variant={tab === 'a-receber' ? 'default' : 'secondary'}
              className="rounded-2xl"
              onClick={() => setTab('a-receber')}
            >
              A Receber ({items.filter((x) => x.status === 'a-receber').length})
            </Button>
            <Button
              variant={tab === 'recebidas' ? 'default' : 'secondary'}
              className="rounded-2xl"
              onClick={() => setTab('recebidas')}
            >
              Recebidas ({items.filter((x) => x.status === 'recebido').length})
            </Button>
          </div>

          <Card className="rounded-3xl border-border/80 bg-card/60 shadow-sm shadow-black/20 animate-in fade-in-0 slide-in-from-bottom-1">
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="flex min-h-[120px] items-center justify-center text-muted-foreground">
                  Nenhuma comissão encontrada
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {filtered.map((c) => (
                    <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-background/20">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-border/70 bg-background/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {c.type === 'moto' ? 'MOTO' : 'CARRO'}
                          </span>
                          <Badge className={cn('border', statusBadgeClass(c.status))}>{statusLabel(c.status)}</Badge>
                        </div>
                        <p className="mt-2 truncate text-base font-semibold">{c.vehicle || '-'}</p>
                        <p className="text-sm text-muted-foreground">
                          {c.plate ? `${c.plate} • ` : ''}{c.client || 'Sem cliente'} • {c.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold">{money(c.amount)}</div>
                        {c.status !== 'recebido' ? (
                          <Button variant="secondary" className="rounded-2xl" onClick={() => markReceived(c.id)}>
                            Marcar recebido
                          </Button>
                        ) : null}
                        <Button variant="ghost" className="rounded-2xl" onClick={() => remove(c.id)}>
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <ModalAdicionarComissao open={openAdd} onClose={() => setOpenAdd(false)} onConfirm={addCommission} />
      </main>
    </div>
  )
}
