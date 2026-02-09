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

interface AddVehicleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddVehicleModal({
  open,
  onOpenChange,
}: AddVehicleModalProps) {
  const [formData, setFormData] = useState({
    type: '',
    renavam: '',
    plate: '',
    color: '',
    brand: '',
    chassis: '',
    model: '',
    crv: '',
    yearModel: '',
    price: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Add vehicle data:', formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Adicionar Veículo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informações do Veículo</h3>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Tipo
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Selecione</option>
                  <option value="carro">Carro</option>
                  <option value="moto">Moto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  RENAVAM
                </label>
                <Input
                  type="text"
                  name="renavam"
                  value={formData.renavam}
                  onChange={handleChange}
                  placeholder="12345678901"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Placa
                </label>
                <Input
                  type="text"
                  name="plate"
                  value={formData.plate}
                  onChange={handleChange}
                  placeholder="ABC-1234"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Cor
                </label>
                <Input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Preto"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Marca
                </label>
                <Input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Honda"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Chassi
                </label>
                <Input
                  type="text"
                  name="chassis"
                  value={formData.chassis}
                  onChange={handleChange}
                  placeholder="9BWZZZ377VT004251"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Modelo
                </label>
                <Input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Civic 2023"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Número do CRLV
                </label>
                <Input
                  type="text"
                  name="crv"
                  value={formData.crv}
                  onChange={handleChange}
                  placeholder="12345678"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Ano Fabricação/ Ano Modelo
                </label>
                <Input
                  type="text"
                  name="yearModel"
                  value={formData.yearModel}
                  onChange={handleChange}
                  placeholder="2023/2023"
                  className="bg-card border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Preço
                </label>
                <Input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="R$ 30.000,00"
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
                  rows={3}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Documentos</h3>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Documentos
                </label>
                <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition">
                  <svg className="w-12 h-12 text-primary mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v20"></path>
                    <path d="M7 12h10"></path>
                    <path d="M19 12a7 7 0 1 1-14 0"></path>
                  </svg>
                  <span className="text-sm text-muted-foreground">Clique para adicionar documentos</span>
                </div>
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
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
