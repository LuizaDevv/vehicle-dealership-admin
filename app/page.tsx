import { AppSidebar } from '@/components/app-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Tag, CheckCircle, Archive, TrendingUp, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      
      <main className="ml-16 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{'Dashboard'}</h1>
            <p className="mt-2 text-muted-foreground">{'Visão geral do sistema de gestão de veículos'}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {'Total de Veículos'}
                </CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{'124'}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {'Todos os veículos no sistema'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {'À Venda'}
                </CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{'32'}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {'24 carros, 8 motos'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {'Vendidos'}
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{'78'}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {'Em processo de pagamento'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {'Arquivo Morto'}
                </CardTitle>
                <Archive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{'14'}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {'Contratos quitados'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">
                  {'Resumo Financeiro'}
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{'Total Recebido no Mês'}</p>
                  <p className="text-2xl font-bold text-foreground">{'R$ 145.230,00'}</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-2 w-2 rounded-full bg-[var(--status-em-dia)]" />
                  <span className="text-sm">{'67 parcelas recebidas este mês'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">
                  {'Parcelas Vencidas'}
                </CardTitle>
                <AlertCircle className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{'Valor Total em Atraso'}</p>
                  <p className="text-2xl font-bold text-destructive">{'R$ 8.450,00'}</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-2 w-2 rounded-full bg-[var(--status-inadimplente)]" />
                  <span className="text-sm">{'5 veículos com parcelas atrasadas'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{'Atividades Recentes'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Novo veículo cadastrado', vehicle: 'Honda Civic 2023', time: 'Há 2 horas' },
                  { action: 'Parcela recebida', vehicle: 'Toyota Corolla 2022', time: 'Há 4 horas' },
                  { action: 'Contrato quitado', vehicle: 'Yamaha MT-03', time: 'Há 1 dia' },
                  { action: 'Documento gerado', vehicle: 'Ford Ka 2021', time: 'Há 1 dia' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.vehicle}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
