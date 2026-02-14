'use client'

import * as React from 'react'
import type { Vehicle } from '@/components/vehicle-card'
import { ModalBase } from '@/components/modals/modal-base'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Attachments, type AttachmentItem } from '@/components/attachments'
import { Download, FileText, Pencil, Printer } from 'lucide-react'

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs uppercase tracking-wide text-foreground/50">{label}</p>
      <p className="text-base text-foreground break-words max-w-full">{value}</p>
    </div>
  )
}

function downloadFile(file: File, name: string) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = name || 'arquivo'
  a.rel = 'noreferrer'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

type PaymentStatus = 'Paga' | 'Não paga' | 'Atrasada' | 'Acordo'

type PaymentRow = {
  id: string
  numero: number
  vencimento: string // YYYY-MM-DD
  valor: string
  status: PaymentStatus
  observacao?: string
}

function defaultPayments(): PaymentRow[] {
  return [
    {
      id: '1',
      numero: 1,
      vencimento: new Date().toISOString().slice(0, 10),
      valor: 'R$ 0,00',
      status: 'Não paga',
      observacao: '',
    },
  ]
}

function printPlanilha(vehicle: Vehicle, payments: PaymentRow[]) {
  const title = `Planilha - ${vehicle.model} - ${vehicle.plate}`
  const rows = payments
    .map(
      (p) => `
        <tr>
          <td>${p.numero}</td>
          <td>${p.vencimento}</td>
          <td>${p.valor}</td>
          <td>${p.status}</td>
          <td>${(p.observacao ?? '').replace(/</g, '&lt;')}</td>
        </tr>`
    )
    .join('')

  const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif; padding:24px;}
        h1{font-size:18px; margin:0 0 4px 0;}
        p{margin:0 0 16px 0; color:#333;}
        table{width:100%; border-collapse:collapse;}
        th,td{border:1px solid #ddd; padding:8px; font-size:12px; text-align:left;}
        th{background:#f4f4f4;}
      </style>
    </head>
    <body>
      <h1>${vehicle.model}</h1>
      <p>Placa: ${vehicle.plate} • Ano: ${vehicle.year} • Cliente: ${(vehicle as any).client ?? '-'}</p>
      <table>
        <thead>
          <tr>
            <th>Nº</th>
            <th>Vencimento</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <script>window.onload = () => window.print();</script>
    </body>
  </html>`

  const w = window.open('', '_blank', 'noopener,noreferrer')
  if (!w) return
  w.document.open()
  w.document.write(html)
  w.document.close()
}

export function ModalVisualizarVeiculo({
  open,
  onClose,
  vehicle,
  onEdit,
  onUpdate,
  fullScreen,
  viewMode = 'default',
}: {
  open: boolean
  onClose: () => void
  vehicle: Vehicle | null
  onEdit?: () => void
  onUpdate?: (patch: Partial<Vehicle> & { documents?: AttachmentItem[] }) => void
  fullScreen?: boolean
  viewMode?: 'default' | 'a-venda' | 'consulta'
}) {
  const initialDocs = (((vehicle as any)?.documents ?? []) as any[]) as AttachmentItem[]
  const [docs, setDocs] = React.useState<AttachmentItem[]>(initialDocs)
  const isSold = !!vehicle && vehicle.status !== 'a-venda'
  const isForSaleView = viewMode === 'a-venda'
  const isConsulta = viewMode === 'consulta'
  const [tab, setTab] = React.useState<
    'resumo' | 'planilha' | 'contrato' | 'documentos' | 'observacoes' | 'condicoes'
  >('resumo')
  const [payments, setPayments] = React.useState<PaymentRow[]>(() => {
    const existing = ((vehicle as any)?.payments ?? null) as PaymentRow[] | null
    return existing && existing.length ? existing : defaultPayments()
  })

  const [notes, setNotes] = React.useState<string>(() => ((vehicle as any)?.notes ?? '') as string)
  const [specialConditions, setSpecialConditions] = React.useState<string>(() => ((vehicle as any)?.specialConditions ?? '') as string)

  React.useEffect(() => {
    // quando troca veículo selecionado, reinicia a visão
    setTab('resumo')
    const existing = ((vehicle as any)?.payments ?? null) as PaymentRow[] | null
    setPayments(existing && existing.length ? existing : defaultPayments())
    setDocs((((vehicle as any)?.documents ?? []) as any[]) as AttachmentItem[])
    setNotes(((vehicle as any)?.notes ?? '') as string)
    setSpecialConditions(((vehicle as any)?.specialConditions ?? '') as string)
  }, [vehicle?.id])

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      size={fullScreen ? 'full' : 'lg'}
      title={vehicle ? vehicle.model : 'Visualizar veículo'}
      description={
        vehicle
          ? `${(vehicle as any).client ?? 'Cliente'} • ${vehicle.plate} • ${vehicle.year} • ${vehicle.status}`
          : undefined
      }
    >
      {!vehicle ? null : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-secondary/40 text-foreground">{vehicle.type === 'carro' ? 'Carro' : 'Moto'}</Badge>
              <Badge className="bg-secondary/40 text-foreground">{vehicle.status}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isSold && !isForSaleView ? (
                <>
                  {!isConsulta ? (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-9 rounded-xl border border-border/80 bg-[var(--btn-contract)] text-white hover:bg-[var(--btn-contract)]/90"
                        onClick={() => setTab('contrato')}
                      >
                        Contrato
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-9 rounded-xl border border-border/80 bg-[var(--btn-sheet)] text-white hover:bg-[var(--btn-sheet)]/90"
                        onClick={() => setTab('planilha')}
                      >
                        Planilha
                      </Button>
                    </>
                  ) : null}

                  {!isConsulta ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-9 rounded-xl border border-border/80 bg-[var(--btn-sheet)] text-white hover:bg-[var(--btn-sheet)]/90"
                      onClick={() => printPlanilha(vehicle, payments)}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimir
                    </Button>
                  ) : null}
                </>
              ) : null}

              {onEdit ? (
                <Button
                  variant="secondary"
                  className="h-9 rounded-xl border border-border/80 bg-[var(--btn-edit)] text-white hover:bg-[var(--btn-edit)]/90"
                  onClick={onEdit}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              ) : null}
            </div>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mt-4">
            <TabsList className="w-full justify-start rounded-2xl border border-border/80 bg-card/60 flex flex-wrap">
              <TabsTrigger value="resumo" className="rounded-xl">Resumo</TabsTrigger>
              {!isForSaleView && !isConsulta ? (<TabsTrigger value="planilha" className="rounded-xl">Planilha</TabsTrigger>) : null}
              {isSold && !isForSaleView ? (
                <>
                  <TabsTrigger value="contrato" className="rounded-xl">Contrato</TabsTrigger>
                  <TabsTrigger value="documentos" className="rounded-xl">Documentos</TabsTrigger>
                  <TabsTrigger value="observacoes" className="rounded-xl">Observações</TabsTrigger>
                  <TabsTrigger value="condicoes" className="rounded-xl">Condições especiais</TabsTrigger>
                </>
              ) : null}
            </TabsList>

            <TabsContent value="resumo">
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {!isForSaleView && !isConsulta ? (
                <Card className="min-w-0 border border-border/80 bg-card/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground">Informações do Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Field label="Nome" value={(vehicle as any).client ?? '-'} />
                    <Field label="CPF" value={(vehicle as any).cpf ?? '-'} />
                    <Field label="Telefone" value={(vehicle as any).phone ?? '-'} />
                    <Field label="Endereço" value={(vehicle as any).endereco ?? '-'} />
                  </CardContent>
                </Card>
                ) : null}

                <Card className="min-w-0 border border-border/80 bg-card/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground">Informações do Veículo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Field label="Veículo" value={vehicle.model} />
                    <Field label="Placa" value={vehicle.plate} />
                    <Field label="Ano" value={vehicle.year} />
                    <Field label="Status" value={vehicle.status} />
                  </CardContent>
                </Card>

                {!isForSaleView && !isConsulta ? (
                <Card className="min-w-0 border border-border/80 bg-card/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground">Financeiro</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Field label="Valor Total" value={(vehicle as any).valorTotal ?? (vehicle as any).price ?? '-'} />
                    <Field label="Entrada" value={(vehicle as any).entrada ?? 'R$ 0,00'} />
                    <Field label="Comissão" value={(vehicle as any).comissao ?? 'R$ 0,00'} />
                    <Field label="Data da venda" value={(vehicle as any).soldDate ?? '-'} />
                  </CardContent>
                </Card>
                ) : null}
              </div>
            </TabsContent>

            {!isForSaleView && !isConsulta ? (
            <TabsContent value="planilha">
              <div className="mt-4 rounded-2xl border border-border/80 bg-card/60 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-card-foreground">Tabela de Pagamentos</div>
                    <div className="text-sm text-muted-foreground">Edite status e observações. A impressão usa exatamente esta tabela.</div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-border/80 bg-background/20">
                  <table className="w-full min-w-[920px] text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="px-4 py-3">Nº</th>
                        <th className="px-4 py-3">Vencimento</th>
                        <th className="px-4 py-3">Valor</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Observação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id} className="border-t border-border/70">
                          <td className="px-4 py-3 font-medium text-card-foreground">{p.numero}</td>
                          <td className="px-4 py-3">
                            <input
                              type="date"
                              value={p.vencimento}
                              onChange={(e) =>
                                setPayments((prev) => prev.map((x) => (x.id === p.id ? { ...x, vencimento: e.target.value } : x)))
                              }
                              className="h-9 w-full rounded-xl border border-border/80 bg-background/30 px-3 text-card-foreground"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              value={p.valor}
                              onChange={(e) =>
                                setPayments((prev) => prev.map((x) => (x.id === p.id ? { ...x, valor: e.target.value } : x)))
                              }
                              className="h-9 w-full rounded-xl border border-border/80 bg-background/30 px-3 text-card-foreground"
                              placeholder="R$ 0,00"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={p.status}
                              onChange={(e) =>
                                setPayments((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: e.target.value as PaymentStatus } : x)))
                              }
                              className="h-9 w-full rounded-xl border border-border/80 bg-background/30 px-3 text-card-foreground"
                            >
                              <option>Paga</option>
                              <option>Não paga</option>
                              <option>Atrasada</option>
                              <option>Acordo</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              value={p.observacao ?? ''}
                              onChange={(e) =>
                                setPayments((prev) => prev.map((x) => (x.id === p.id ? { ...x, observacao: e.target.value } : x)))
                              }
                              className="h-9 w-full rounded-xl border border-border/80 bg-background/30 px-3 text-card-foreground"
                              placeholder="Adicionar observação..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            ) : null}

            {isSold && !isForSaleView ? (
              <>
                <TabsContent value="contrato">
                  <div className="mt-4 rounded-2xl border border-border/80 bg-card/60 p-4">
                    <div className="mb-2 text-base font-semibold text-card-foreground">Contrato</div>
                    <div className="whitespace-pre-wrap rounded-2xl border border-border/80 bg-background/20 p-4 text-sm text-foreground">
                      {(vehicle as any).contractText ?? 'Nenhum contrato salvo.'}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documentos">
                  <div className="mt-4 rounded-2xl border border-border/80 bg-card/60 p-4">
                    <div className="mb-3 text-base font-semibold text-card-foreground">Documentos</div>

                    <Attachments
                      value={docs}
                      onChange={(next) => {
                        setDocs(next)
                        onUpdate?.({ documents: next })
                      }}
                      label={isConsulta ? 'Arquivos disponíveis' : 'Arquivos (você pode anexar aqui)'}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="observacoes">
                  <div className="mt-4 rounded-2xl border border-border/80 bg-card/60 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-base font-semibold text-card-foreground">Observações</div>
                      {!isConsulta ? (
                        <Button
                          type="button"
                          className="h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                          onClick={() => onUpdate?.({ notes } as any)}
                        >
                          Salvar
                        </Button>
                      ) : null}
                    </div>

                    {!isConsulta ? (
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-40 rounded-2xl border border-border/80 bg-background/20 text-foreground placeholder:text-foreground/40"
                        placeholder="Escreva suas observações aqui..."
                      />
                    ) : (
                      <div className="whitespace-pre-wrap rounded-2xl border border-border/80 bg-background/20 p-4 text-sm text-foreground">
                        {(vehicle as any).notes ?? 'Sem observações.'}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="condicoes">
                  <div className="mt-4 rounded-2xl border border-border/80 bg-card/60 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-base font-semibold text-card-foreground">Condições especiais</div>
                      {!isConsulta ? (
                        <Button
                          type="button"
                          className="h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                          onClick={() => onUpdate?.({ specialConditions } as any)}
                        >
                          Salvar
                        </Button>
                      ) : null}
                    </div>

                    {!isConsulta ? (
                      <Textarea
                        value={specialConditions}
                        onChange={(e) => setSpecialConditions(e.target.value)}
                        className="min-h-40 rounded-2xl border border-border/80 bg-background/20 text-foreground placeholder:text-foreground/40"
                        placeholder="Descreva condições especiais, acordos, detalhes..."
                      />
                    ) : (
                      <div className="whitespace-pre-wrap rounded-2xl border border-border/80 bg-background/20 p-4 text-sm text-foreground">
                        {(vehicle as any).specialConditions ?? 'Nenhuma condição especial.'}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </>
            ) : null}
          </Tabs>

        </>
      )}
    </ModalBase>
  )
}
