import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Mock data - in a real app, fetch based on id
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
    contract: {
      date: '15/01/2024',
      value: 85000,
      downPayment: 25000,
      installments: 48,
      installmentValue: 1250,
    },
    payments: [
      { id: 1, dueDate: '15/02/2024', paidDate: '14/02/2024', value: 1250, status: 'paid' },
      { id: 2, dueDate: '15/03/2024', paidDate: '15/03/2024', value: 1250, status: 'paid' },
      { id: 3, dueDate: '15/04/2024', paidDate: null, value: 1250, status: 'pending' },
      { id: 4, dueDate: '15/05/2024', paidDate: null, value: 1250, status: 'pending' },
    ],
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <main className="ml-16 flex-1 p-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/vendidos" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              {'Voltar'}
            </Link>
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{vehicle.model}</h1>
                <p className="mt-2 text-muted-foreground">{`${vehicle.plate} • ${vehicle.year}`}</p>
              </div>
              <Badge variant="secondary" className="bg-[var(--status-em-dia)] text-white">
                {'Em dia'}
              </Badge>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="veiculo" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="veiculo">{'Veículo'}</TabsTrigger>
              <TabsTrigger value="cliente">{'Cliente'}</TabsTrigger>
              <TabsTrigger value="planilha">{'Planilha'}</TabsTrigger>
              <TabsTrigger value="contrato">{'Contrato'}</TabsTrigger>
              <TabsTrigger value="documentos">{'Documentos'}</TabsTrigger>
            </TabsList>

            {/* Vehicle Tab */}
            <TabsContent value="veiculo" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{'Informações do Veículo'}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
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
            </TabsContent>

            {/* Client Tab */}
            <TabsContent value="cliente" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{'Informações do Cliente'}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
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
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">{'Endereço'}</p>
                    <p className="mt-1 text-base text-foreground">{vehicle.client.address}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Schedule Tab */}
            <TabsContent value="planilha" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{'Planilha de Pagamentos'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">{'Valor Total'}</p>
                      <p className="mt-1 text-xl font-bold">{`R$ ${vehicle.contract.value.toLocaleString('pt-BR')}`}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">{'Entrada'}</p>
                      <p className="mt-1 text-xl font-bold">{`R$ ${vehicle.contract.downPayment.toLocaleString('pt-BR')}`}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">{'Parcelas'}</p>
                      <p className="mt-1 text-xl font-bold">{`${vehicle.contract.installments}x R$ ${vehicle.contract.installmentValue}`}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {vehicle.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              payment.status === 'paid'
                                ? 'bg-[var(--status-em-dia)]'
                                : 'bg-muted-foreground'
                            }`}
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {`Parcela ${payment.id} de ${vehicle.contract.installments}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {`Vencimento: ${payment.dueDate}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{`R$ ${payment.value}`}</p>
                          {payment.paidDate && (
                            <p className="text-xs text-muted-foreground">
                              {`Pago em ${payment.paidDate}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contract Tab */}
            <TabsContent value="contrato" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{'Contrato de Venda'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{'Data do Contrato'}</p>
                        <p className="mt-1 text-base text-foreground">{vehicle.contract.date}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{'Valor Total'}</p>
                        <p className="mt-1 text-base text-foreground">{`R$ ${vehicle.contract.value.toLocaleString('pt-BR')}`}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-6">
                    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`}</span>
                    </div>
                    <Button className="gap-2">
                      <Download className="h-4 w-4" />
                      {'Baixar Contrato (PDF)'}
                    </Button>
                    <p className="mt-4 text-xs text-muted-foreground">
                      {'O documento será gerado com os dados atualizados no momento do download.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documentos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{'Documentos'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Contrato de Compra e Venda', type: 'PDF' },
                      { name: 'Planilha de Pagamentos', type: 'PDF' },
                      { name: 'Comprovante de Transferência', type: 'PDF' },
                      { name: 'Documento do Veículo (CRLV)', type: 'PDF' },
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
                  <div className="mt-6 rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{'Documentos Dinâmicos: '}</span>
                      {'Todos os documentos são gerados em tempo real com dados atualizados.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
