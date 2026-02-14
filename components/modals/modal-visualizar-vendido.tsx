'use client'

import * as React from 'react'
import type { Vehicle } from '@/components/vehicle-card'
import { ModalBase } from '@/components/modals/modal-base'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { FileText, Printer } from 'lucide-react'

function openPrintable(title: string, bodyHtml: string) {
  const w = window.open('', '_blank', 'noopener,noreferrer')
  if (!w) return
  w.document.open()
  w.document.write(`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${title}</title>
      <style>
        body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;padding:24px;}
        h1{margin:0 0 12px 0;font-size:22px;}
        .muted{color:#666;font-size:12px;margin-bottom:18px;}
        table{width:100%;border-collapse:collapse;margin-top:12px;}
        th,td{border:1px solid #ddd;padding:8px;font-size:12px;text-align:left;}
        th{background:#f5f5f5;}
      </style>
    </head>
    <body>
      ${bodyHtml}
      <script>
        window.onload = () => { try { window.print(); } catch(e) {} };
      </script>
    </body>
  </html>`)
  w.document.close()
}

export function ModalVisualizarVendido({
  open,
  onClose,
  vehicle,
}: {
  open: boolean
  onClose: () => void
  vehicle: Vehicle | null
}) {
  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={vehicle ? vehicle.model : 'Veículo'}
      description={vehicle ? `${vehicle.plate} • ${vehicle.year}` : undefined}
      size="xl"
    >
      {!vehicle ? null : (
        <div className="space-y-4">
          {/* Ações rápidas */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-xl border border-border/80 bg-[var(--btn-contract)] text-white hover:bg-[var(--btn-contract)]/90"
              onClick={() =>
                openPrintable(
                  `Contrato - ${vehicle.model}`,
                  `<h1>Contrato</h1><div class='muted'>Placeholder do contrato (backend depois).</div>
                   <p><b>Veículo:</b> ${vehicle.model}</p>
                   <p><b>Placa:</b> ${vehicle.plate}</p>
                   <p><b>Ano:</b> ${vehicle.year}</p>
                   <p><b>Cliente:</b> ${vehicle.client ?? '-'}</p>`
                )
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              Visualizar contrato
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="rounded-xl border border-border/80 bg-[var(--btn-sheet)] text-white hover:bg-[var(--btn-sheet)]/90"
              onClick={() =>
                openPrintable(
                  `Planilha - ${vehicle.model}`,
                  `<h1>Planilha de parcelas</h1><div class='muted'>Placeholder da planilha (dados do backend depois).</div>
                   <table>
                    <thead><tr><th>#</th><th>Valor</th><th>Status</th><th>Vencimento</th><th>Observações</th></tr></thead>
                    <tbody><tr><td>1</td><td>-</td><td>-</td><td>-</td><td>-</td></tr></tbody>
                   </table>`
                )
              }
            >
              <Printer className="mr-2 h-4 w-4" />
              Visualizar planilha
            </Button>
          </div>

          <Separator />

          {/* Conteúdo */}
          <Tabs defaultValue="resumo" className="w-full">
            <TabsList className="bg-white/5">
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>
            <TabsContent value="resumo" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Cliente</p>
                  <p className="mt-1 text-base font-semibold text-card-foreground">{vehicle.client ?? '—'}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Próximo vencimento</p>
                  <p className="mt-1 text-base font-semibold text-card-foreground">{vehicle.nextDueDate ?? '—'}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="documentos" className="mt-4">
              <div className="rounded-2xl border border-border/60 bg-white/5 p-4">
                <p className="text-sm text-muted-foreground">Aqui entram os documentos do cliente e do veículo (já conectados no backend depois).</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </ModalBase>
  )
}
