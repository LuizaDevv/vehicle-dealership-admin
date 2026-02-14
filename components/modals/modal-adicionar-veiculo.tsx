'use client'

import * as React from 'react'
import { ModalBase } from '@/components/modals/modal-base'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Attachments, type AttachmentItem } from '@/components/attachments'
import { digitsOnly, formatBRLFromDigits } from '@/lib/formatters'

export type VehicleDraft = {
  type: 'carro' | 'moto'
  plate: string
  brand: string
  model: string
  year: string
  renavam: string
  color: string
  chassis: string
  crlvNumber: string
  price: string
  notes: string
  documents: AttachmentItem[]
}

export function ModalAdicionarVeiculo({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (draft: VehicleDraft) => void
}) {
  const [type, setType] = React.useState<'carro' | 'moto'>('carro')
  const [plate, setPlate] = React.useState('')
  const [brand, setBrand] = React.useState('')
  const [model, setModel] = React.useState('')
  const [year, setYear] = React.useState('')
  const [renavam, setRenavam] = React.useState('')
  const [color, setColor] = React.useState('')
  const [chassis, setChassis] = React.useState('')
  const [crlvNumber, setCrlvNumber] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [documents, setDocuments] = React.useState<AttachmentItem[]>([])

  React.useEffect(() => {
    if (!open) return
    setType('carro')
    setPlate('')
    setBrand('')
    setModel('')
    setYear('')
    setRenavam('')
    setColor('')
    setChassis('')
    setCrlvNumber('')
    setPrice('')
    setNotes('')
    setDocuments([])
  }, [open])

  function submit() {
    onSubmit({
      type,
      plate,
      brand,
      model,
      year,
      renavam,
      color,
      chassis,
      crlvNumber,
      price,
      notes,
      documents,
    })
    onClose()
  }

  return (
    <ModalBase open={open} onClose={onClose} title="Adicionar veículo">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/60 border-border/60 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Informações do Veículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Tipo</Label>
                <Select value={type} onValueChange={(v) => setType(v as 'carro' | 'moto')}>
                  <SelectTrigger className="border-border/60 bg-background/20 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b0920] border-border/60 text-foreground">
                    <SelectItem value="carro">Carro</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">RENAVAM</Label>
                <Input value={renavam} onChange={(e) => setRenavam(digitsOnly(e.target.value))} inputMode="numeric" className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Placa</Label>
                <Input value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Cor</Label>
                <Input value={color} onChange={(e) => setColor(e.target.value)} className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Marca</Label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Modelo</Label>
                <Input value={model} onChange={(e) => setModel(e.target.value)} className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Ano fabricação / modelo</Label>
                <Input value={year} onChange={(e) => setYear(digitsOnly(e.target.value).slice(0, 4))} inputMode="numeric" className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" placeholder="2023" />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Chassi</Label>
                <Input value={chassis} onChange={(e) => setChassis(e.target.value)} className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Número do CRLV</Label>
                <Input value={crlvNumber} onChange={(e) => setCrlvNumber(digitsOnly(e.target.value))} inputMode="numeric" className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Preço</Label>
                <Input
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(formatBRLFromDigits(e.target.value))}
                  className="border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40"
                  placeholder="R$ 0,00"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground">Observações</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-28 border-border/60 bg-background/20 text-foreground placeholder:text-foreground/40" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border/60 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">Documentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Attachments value={documents} onChange={setDocuments} />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={onClose} className="rounded-xl bg-secondary/40 text-foreground hover:bg-secondary/60 border border-border/60">
                Cancelar
              </Button>
              <Button onClick={submit} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModalBase>
  )
}
