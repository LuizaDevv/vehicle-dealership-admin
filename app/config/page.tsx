'use client'

import * as React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

const RATES_KEY = 'mgm_commission_rates_v1'

type Rates = { carro: number; moto: number }

function loadRates(): Rates {
  if (typeof window === 'undefined') return { carro: 200, moto: 100 }
  try {
    const raw = window.localStorage.getItem(RATES_KEY)
    if (!raw) return { carro: 200, moto: 100 }
    const parsed = JSON.parse(raw)
    return {
      carro: Number(parsed?.carro ?? 200),
      moto: Number(parsed?.moto ?? 100),
    }
  } catch {
    return { carro: 200, moto: 100 }
  }
}

function persistRates(rates: Rates) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(RATES_KEY, JSON.stringify(rates))
}

export default function ConfigPage() {
  const [rates, setRates] = React.useState<Rates>({ carro: 200, moto: 100 })
  const [exportJson, setExportJson] = React.useState('')
  const [importJson, setImportJson] = React.useState('')

  React.useEffect(() => {
    setRates(loadRates())
  }, [])

  function saveRates() {
    const next: Rates = {
      carro: Math.max(0, Math.round(Number(rates.carro) || 0)),
      moto: Math.max(0, Math.round(Number(rates.moto) || 0)),
    }
    setRates(next)
    persistRates(next)
    toast.success('Configurações salvas')
  }

  function doExport() {
    try {
      const data: Record<string, any> = {}
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i)
        if (!k) continue
        if (!k.startsWith('mgm_') ) continue
        data[k] = window.localStorage.getItem(k)
      }
      setExportJson(JSON.stringify(data, null, 2))
      toast.success('Backup gerado')
    } catch {
      toast.error('Não foi possível gerar o backup')
    }
  }

  function doImport() {
    try {
      const parsed = JSON.parse(importJson || '{}')
      if (!parsed || typeof parsed !== 'object') throw new Error('invalid')
      Object.entries(parsed).forEach(([k, v]) => {
        if (typeof v !== 'string') return
        window.localStorage.setItem(k, v)
      })
      toast.success('Backup importado')
      setRates(loadRates())
    } catch {
      toast.error('JSON inválido para importar')
    }
  }

  function resetAll() {
    if (!confirm('Isso vai apagar os dados salvos deste navegador. Continuar?')) return
    try {
      const toDelete: string[] = []
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i)
        if (!k) continue
        if (k.startsWith('mgm_') ) toDelete.push(k)
      }
      toDelete.forEach((k) => window.localStorage.removeItem(k))
      persistRates({ carro: 200, moto: 100 })
      setRates(loadRates())
      toast.success('Dados apagados')
    } catch {
      toast.error('Não foi possível apagar')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />
      <main className="ml-16 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="animate-in fade-in-0 slide-in-from-top-1">
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">Ajustes do sistema e backup local.</p>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-3xl border-border/80 bg-card/60 shadow-sm shadow-black/20 animate-in fade-in-0 slide-in-from-bottom-1">
              <CardHeader>
                <CardTitle>Comissões</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Valor por carro vendido</Label>
                    <Input
                      value={String(rates.carro)}
                      onChange={(e) => setRates((p) => ({ ...p, carro: Number(e.target.value) }))}
                      inputMode="numeric"
                      className="border-border/70 bg-background/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor por moto vendida</Label>
                    <Input
                      value={String(rates.moto)}
                      onChange={(e) => setRates((p) => ({ ...p, moto: Number(e.target.value) }))}
                      inputMode="numeric"
                      className="border-border/70 bg-background/20"
                    />
                  </div>
                </div>
                <Button onClick={saveRates} className="rounded-2xl">Salvar</Button>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-border/80 bg-card/60 shadow-sm shadow-black/20 animate-in fade-in-0 slide-in-from-bottom-1">
              <CardHeader>
                <CardTitle>Modo Pai</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Link de consulta simples (somente ver e baixar documentos).
                </p>
                <a
                  href="/consulta-pai"
                  className="inline-flex w-fit items-center justify-center rounded-2xl border border-border/70 bg-background/20 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background/30"
                >
                  Abrir Consulta (Modo Pai)
                </a>
              </CardContent>
            </Card>


            <Card className="rounded-3xl border-border/80 bg-card/60 shadow-sm shadow-black/20 animate-in fade-in-0 slide-in-from-bottom-1">
              <CardHeader>
                <CardTitle>Backup local</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" className="rounded-2xl" onClick={doExport}>
                    Gerar backup
                  </Button>
                  <Button variant="secondary" className="rounded-2xl" onClick={doImport}>
                    Importar backup
                  </Button>
                  <Button variant="destructive" className="rounded-2xl" onClick={resetAll}>
                    Zerar dados
                  </Button>
                </div>

                <Separator className="bg-border/60" />

                <div className="space-y-2">
                  <Label>Export (copiar/colar)</Label>
                  <textarea
                    value={exportJson}
                    readOnly
                    rows={7}
                    className="w-full rounded-2xl border border-border/70 bg-background/20 p-3 font-mono text-xs text-foreground"
                    placeholder="Clique em 'Gerar backup'..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Import (colar JSON)</Label>
                  <textarea
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    rows={7}
                    className="w-full rounded-2xl border border-border/70 bg-background/20 p-3 font-mono text-xs text-foreground"
                    placeholder="Cole aqui o JSON do backup..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
