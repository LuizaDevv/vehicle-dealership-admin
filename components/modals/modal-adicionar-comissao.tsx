'use client'

import * as React from 'react'
import { ModalBase } from '@/components/modals/modal-base'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type CommissionType = 'carro' | 'moto'

export type CommissionCreatePayload = {
  type: CommissionType
  client: string
  vehicle: string
  plate: string
  date: string
}

export function ModalAdicionarComissao({
  open,
  onClose,
  defaultType = 'carro',
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  defaultType?: CommissionType
  onConfirm?: (payload: CommissionCreatePayload) => void
}) {
  const [type, setType] = React.useState<CommissionType>(defaultType)
  const [client, setClient] = React.useState('')
  const [vehicle, setVehicle] = React.useState('')
  const [plate, setPlate] = React.useState('')
  const [date, setDate] = React.useState('')

  React.useEffect(() => {
    if (!open) return
    setType(defaultType)
    setClient('')
    setVehicle('')
    setPlate('')
    setDate(new Date().toISOString().slice(0, 10))
  }, [open, defaultType])

  function submit() {
    onConfirm?.({
      type,
      client: client.trim(),
      vehicle: vehicle.trim(),
      plate: plate.trim(),
      date,
    })
    onClose()
  }

  return (
    <ModalBase open={open} onClose={onClose} title="Adicionar comissão" full>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select value={type} onValueChange={(v) => setType(v as CommissionType)}>
            <SelectTrigger className="border-border/70 bg-background/20">
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/60">
              <SelectItem value="carro">Carro</SelectItem>
              <SelectItem value="moto">Moto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Data da venda</Label>
          <Input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="border-border/70 bg-background/20" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Cliente</Label>
          <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Nome do cliente" className="border-border/70 bg-background/20" />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Veículo</Label>
          <Input value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="Ex.: Volkswagen Voyage 2021" className="border-border/70 bg-background/20" />
        </div>

        <div className="space-y-2">
          <Label>Placa</Label>
          <Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="ABC-1234" className="border-border/70 bg-background/20" />
        </div>

        <div className="flex items-end justify-end gap-2 sm:col-span-2">
          <Button variant="secondary" className="rounded-2xl" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="rounded-2xl" onClick={submit}>
            Salvar
          </Button>
        </div>
      </div>
    </ModalBase>
  )
}
