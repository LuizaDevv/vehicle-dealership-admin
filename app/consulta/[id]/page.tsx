import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Calendar, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function ConsultaVehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Mock data
  const vehicle = {
    id,
    model: 'Honda Civic 2023',
    plate: 'ABC-1234',
    year: 2023,
    brand: 'Honda',
    color: 'Prata',
    chassi: '9BWZZZ377VT004251',
    renavam: '00123456789',
    status: 'em-dia',
    client: {
      name: 'João Silva',
      cpf: '123.456.789-00',
      phone: '(11) 98765-4321',
      email: 'joao.silva@email.com',
      address: 'Rua das Flores, 123 - São Paulo, SP',
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Simple Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">{'G'}</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{'Sistema de Consulta'}</h1>
              <p className="text-xs text-muted-foreground">{'Modo somente leitura'}</p>
            </div>
          </div>
          
          <Badge variant="secondary" className="gap-2">
            <Eye className="h-3 w-3" />
            {'Consulta'}
          </Badge>
        </div>
      </header>
      
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-5xl">
          {/* Back Link */}
          <Link href="/consulta" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {'Voltar para Consulta'}
          </Link>

          {/* Header */}
          <div className="mb-8 mt-4 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{vehicle.model}</h1>
              <p className="mt-2 text-muted-foreground">{`${vehicle.plate} • ${vehicle.year}`}</p>
            </div>
            <Badge variant="secondary" className="bg-[var(--status-em-dia)] text-white">
              {'Em dia'}
            </Badge>
          </div>

          {/* Info Banner */}
          <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{'Acesso Limitado: '}</span>
              {'Informações financeiras e de pagamento não estão disponíveis neste modo.'}
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Vehicle Info */}
            <Card>
              <CardHeader>
                <CardTitle>{'Informações do Veículo'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'Modelo'}</p>
                  <p className="mt-1 text-base text-foreground">{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'Placa'}</p>
                  <p className="mt-1 font-mono text-base text-foreground">{vehicle.plate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'Ano'}</p>
                  <p className="mt-1 text-base text-foreground">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'Marca'}</p>
                  <p className="mt-1 text-base text-foreground">{vehicle.brand}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'Cor'}</p>
                  <p className="mt-1 text-base text-foreground">{vehicle.color}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'Chassi'}</p>
                  <p className="mt-1 font-mono text-base text-foreground">{vehicle.chassi}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'RENAVAM'}</p>
                  <p className="mt-1 font-mono text-base text-foreground">{vehicle.renavam}</p>
                </div>
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle>{'Informações do Cliente'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'Nome Completo'}</p>
                  <p className="mt-1 text-base text-foreground">{vehicle.client.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'CPF'}</p>
                  <p className="mt-1 font-mono text-base text-foreground">{vehicle.client.cpf}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'Telefone'}</p>
                  <p className="mt-1 text-base text-foreground">{vehicle.client.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'E-mail'}</p>
                  <p className="mt-1 text-base text-foreground">{vehicle.client.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{'Endereço'}</p>
                  <p className="mt-1 text-base text-foreground">{vehicle.client.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{'Documentos Disponíveis'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Contrato de Compra e Venda', type: 'PDF' },
                  { name: 'Documento do Veículo (CRLV)', type: 'PDF' },
                  { name: 'Comprovante de Transferência', type: 'PDF' },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      {'Baixar'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4">
        <div className="mx-auto max-w-7xl px-8">
          <p className="text-center text-xs text-muted-foreground">
            {'Sistema de Gestão de Concessionária - Modo de Consulta'}
          </p>
        </div>
      </footer>
    </div>
  )
}
