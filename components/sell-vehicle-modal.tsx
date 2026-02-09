'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Vehicle } from './vehicle-card'

interface SellVehicleModalProps {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SellVehicleModal({
  vehicle,
  open,
  onOpenChange,
}: SellVehicleModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    maritalStatus: '',
    phone: '',
    profession: '',
    address: '',
    birthDate: '',
    cpf: '',
    financedValue: '',
    sellDate: '',
    installments: '',
    notes: '',
    dueDateInstallment: '',
    installmentValue: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Sell vehicle data:', { vehicle, ...formData })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Vender Veículo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informações do Cliente</h3>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Estado Civil
                </label>
                <Input
                  type="text"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  placeholder="Solteiro"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Telefone
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 98765-4321"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Profissão
                </label>
                <Input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="Engenheiro"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Endereço
                </label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rua das Flores, 123 - São Paulo, SP"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Nascimento
                </label>
                <Input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  CPF
                </label>
                <Input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="123.456.789-00"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Documentos
                </label>
                <div className="flex items-center justify-center w-full p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13.5 16a3 3 0 1 1-6 0"></path>
                    <path d="M18.5 8a2.5 2.5 0 1 1-5 0"></path>
                    <path d="M2 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Contract Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">GERAR CONTRATO E PLANILHA</h3>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Valor Financiado
                </label>
                <Input
                  type="text"
                  name="financedValue"
                  value={formData.financedValue}
                  onChange={handleChange}
                  placeholder="R$ 30.000,00"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Data da Venda
                </label>
                <Input
                  type="date"
                  name="sellDate"
                  value={formData.sellDate}
                  onChange={handleChange}
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Parcelas
                </label>
                <Input
                  type="number"
                  name="installments"
                  value={formData.installments}
                  onChange={handleChange}
                  placeholder="12"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Observações
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Adicione observações..."
                  rows={4}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Vencimento
                </label>
                <Input
                  type="date"
                  name="dueDateInstallment"
                  value={formData.dueDateInstallment}
                  onChange={handleChange}
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Valor Da Parcela
                </label>
                <Input
                  type="text"
                  name="installmentValue"
                  value={formData.installmentValue}
                  onChange={handleChange}
                  placeholder="R$ 2.500,00"
                  className="bg-card border-border"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              VENDER
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
