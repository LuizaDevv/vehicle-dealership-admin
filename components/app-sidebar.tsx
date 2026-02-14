'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Tag, CheckCircle2, Archive as ArchiveIcon, Settings, BadgeDollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'À Venda', href: '/a-venda', icon: Tag },
  { label: 'Vendidos', href: '/vendidos', icon: CheckCircle2 },
  { label: 'Arquivo', href: '/arquivo-morto', icon: ArchiveIcon },
  { label: 'Comissões', href: '/comissoes', icon: BadgeDollarSign },
  { label: 'Configurações', href: '/config', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 border-r border-border bg-card">
      <div className="flex h-full flex-col items-center py-4">
        {/* Logo (sem imagem) */}
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <span className="text-sm font-bold">VP</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-2xl transition-colors',
                  active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                title={item.label}
                aria-label={item.label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            )
          })}
        </nav>

        {/* Admin */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">WP</AvatarFallback>
          </Avatar>
          <span className="sr-only">Warlen Paz</span>
        </div>
      </div>
    </aside>
  )
}
