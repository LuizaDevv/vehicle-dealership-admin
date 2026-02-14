'use client'

import * as React from 'react'
import type { Vehicle } from '@/components/vehicle-card'
import { ModalBase } from '@/components/modals/modal-base'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Attachments, type AttachmentItem } from '@/components/attachments'
import { digitsOnly, formatCPF, formatPhoneBR, formatBRLFromDigits } from '@/lib/formatters'

type ClientRecord = {
  id: string
  nome: string
  telefone: string
  cpf: string
  rg: string
  estadoCivil: string
  profissao: string
  nascimento: string
  endereco: string
  observacoes: string
}

const CLIENTS_KEY = 'mgm_clients_db_v1'

function loadClients(): ClientRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CLIENTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ClientRecord[]) : []
  } catch {
    return []
  }
}

function persistClients(clients: ClientRecord[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients))
  } catch {
    // ignore
  }
}

export function ModalVenderVeiculo({
  open,
  onClose,
  vehicle,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  vehicle: Vehicle | null
  onConfirm?: (payload: {
    customer: {
      nome: string
      telefone: string
      cpf: string
      rg: string
      estadoCivil: string
      profissao: string
      nascimento: string
      endereco: string
      observacoes: string
      documentos: AttachmentItem[]
    }
    venda: {
      valorEntrada: string
      valorFinanciado: string
      dataVenda: string
      parcelas: string
      vencimento: string
      valorParcela: string
      observacoes: string
    }
  }) => void
}) {
  const [docs, setDocs] = React.useState<AttachmentItem[]>([])

  const [nome, setNome] = React.useState('')
  const [telefone, setTelefone] = React.useState('')
  const [endereco, setEndereco] = React.useState('')
  const [cpf, setCpf] = React.useState('')
  const [rg, setRg] = React.useState('')
  const [estadoCivil, setEstadoCivil] = React.useState<string>('')
  const [profissao, setProfissao] = React.useState('')
  const [nascimento, setNascimento] = React.useState('')

  const [obsCliente, setObsCliente] = React.useState('')

  const [valorEntrada, setValorEntrada] = React.useState('')
  const [valorFinanciado, setValorFinanciado] = React.useState('')
  const [dataVenda, setDataVenda] = React.useState('')
  const [parcelas, setParcelas] = React.useState('')
  const [vencimento, setVencimento] = React.useState('')
  const [valorParcela, setValorParcela] = React.useState('')
  const [obsVenda, setObsVenda] = React.useState('')

  const [clients, setClients] = React.useState<ClientRecord[]>([])
  const [selectedClientId, setSelectedClientId] = React.useState<string>('')
  const [saveClient, setSaveClient] = React.useState(true)

  React.useEffect(() => {
    if (!open) return
    setClients(loadClients())
    setSelectedClientId('')
    // reset leve quando abrir
    setDocs([])
    setNome('')
    setTelefone('')
    setEndereco('')
    setCpf('')
    setRg('')
    setEstadoCivil('')
    setProfissao('')
    setNascimento('')
    setObsCliente('')
    setValorEntrada('')
    setValorFinanciado('')
    setDataVenda('')
    setParcelas('')
    setVencimento('')
    setValorParcela('')
    setObsVenda('')
  }, [open, vehicle?.id])

  React.useEffect(() => {
    if (!selectedClientId) return
    const c = clients.find((x) => x.id === selectedClientId)
    if (!c) return
    setNome(c.nome)
    setTelefone(c.telefone)
    setCpf(c.cpf)
    setRg(c.rg)
    setEstadoCivil(c.estadoCivil)
    setProfissao(c.profissao)
    setNascimento(c.nascimento)
    setEndereco(c.endereco)
    setObsCliente(c.observacoes)
  }, [selectedClientId, clients])

  function submit() {
    if (!vehicle) return

    if (saveClient && (nome.trim() || cpf.trim() || telefone.trim())) {
      const next: ClientRecord = {
        id: selectedClientId || `c-${Date.now()}`,
        nome,
        telefone,
        cpf,
        rg,
        estadoCivil,
        profissao,
        nascimento,
        endereco,
        observacoes: obsCliente,
      }

      setClients((prev) => {
        const byCpf = (cpf || '').replace(/\D/g, '')
        const idx = prev.findIndex((x) => (byCpf ? x.cpf.replace(/\D/g, '') === byCpf : x.id === next.id))
        const updated = idx >= 0 ? prev.map((x, i) => (i === idx ? next : x)) : [next, ...prev]
        persistClients(updated)
        return updated
      })
    }

    onConfirm?.({
      customer: {
        nome,
        telefone,
        cpf,
        rg,
        estadoCivil,
        profissao,
        nascimento,
        endereco,
        observacoes: obsCliente,
        documentos: docs,
      },
      venda: {
        valorEntrada,
        valorFinanciado,
        dataVenda,
        parcelas,
        vencimento,
        valorParcela,
        observacoes: obsVenda,
      },
    })
    onClose()
  }

  return (
    <ModalBase open={open} onClose={onClose} title={vehicle ? `Vender: ${vehicle.model}` : 'Vender veículo'}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/60 border-border/60 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mini banco de clientes (localStorage) */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Cliente salvo (opcional)</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger className="border-border/60 bg-background/20 text-foreground">
                    <SelectValue placeholder={clients.length ? 'Selecionar cliente…' : 'Sem clientes salvos'} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/60 text-foreground">
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome || '(Sem nome)'} {c.cpf ? `• ${c.cpf}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted-foreground md:col-span-2">
                <input
                  type="checkbox"
                  checked={saveClient}
                  onChange={(e) => setSaveClient(e.target.checked)}
                  className="h-4 w-4 rounded border-border/60 bg-background/20"
                />
                Salvar/atualizar este cliente no banco
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Nome completo</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Telefone</Label>
                <Input
                  inputMode="numeric"
                  value={telefone}
                  onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
                  className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40"
                  placeholder="(99) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Estado civil</Label>
                <Select value={estadoCivil} onValueChange={setEstadoCivil}>
                  <SelectTrigger className="border-border/60 bg-background/20 text-foreground">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b0920] border-border/60 text-foreground">
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="uniao-estavel">União estável</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">CPF</Label>
                <Input
                  inputMode="numeric"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40"
                  placeholder="999.999.999-99"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">RG</Label>
                <Input value={rg} onChange={(e) => setRg(e.target.value)} className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Profissão</Label>
                <Input value={profissao} onChange={(e) => setProfissao(e.target.value)} className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Nascimento</Label>
                <Input type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)} className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Endereço</Label>
                <Input value={endereco} onChange={(e) => setEndereco(e.target.value)} className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>
            </div>

            <Attachments value={docs} onChange={setDocs} />

            <div className="space-y-2">
              <Label className="text-muted-foreground">Observações</Label>
              <Textarea value={obsCliente} onChange={(e) => setObsCliente(e.target.value)} className="min-h-24 border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/60 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Gerar contrato e planilha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Valor de entrada</Label>
                <Input
                  inputMode="numeric"
                  value={valorEntrada}
                  onChange={(e) => setValorEntrada(formatBRLFromDigits(e.target.value))}
                  className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40"
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Valor financiado</Label>
                <Input
                  inputMode="numeric"
                  value={valorFinanciado}
                  onChange={(e) => setValorFinanciado(formatBRLFromDigits(e.target.value))}
                  className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40"
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Data da venda</Label>
                <Input type="date" value={dataVenda} onChange={(e) => setDataVenda(e.target.value)} className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Parcelas</Label>
                <Input
                  inputMode="numeric"
                  value={parcelas}
                  onChange={(e) => setParcelas(digitsOnly(e.target.value))}
                  className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Vencimento</Label>
                <Input
                  inputMode="numeric"
                  value={vencimento}
                  onChange={(e) => setVencimento(digitsOnly(e.target.value))}
                  className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40"
                  placeholder="Dia do mês"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Valor da parcela</Label>
                <Input
                  inputMode="numeric"
                  value={valorParcela}
                  onChange={(e) => setValorParcela(formatBRLFromDigits(e.target.value))}
                  className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40"
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Observações</Label>
                <Textarea value={obsVenda} onChange={(e) => setObsVenda(e.target.value)} className="min-h-28 border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={onClose} className="rounded-xl bg-secondary/40 text-foreground hover:bg-secondary/60 border border-border/60">
                Cancelar
              </Button>
              <Button onClick={submit} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Vender
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModalBase>
  )
}
