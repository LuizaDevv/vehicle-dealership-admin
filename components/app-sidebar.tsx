'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Tag, CheckCircle, Archive, Home, Search, PlusCircle, CheckCircle2, Archive as ArchiveIcon, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    label: 'Carros',
    href: '/a-venda',
    icon: Tag,
  },
  {
    label: 'Buscar',
    href: '/buscar',
    icon: Search,
  },
  {
    label: 'Adicionar',
    href: '/adicionar',
    icon: PlusCircle,
  },
  {
    label: 'Vendidos',
    href: '/vendidos',
    icon: CheckCircle2,
  },
  {
    label: 'Arquivo',
    href: '/arquivo-morto',
    icon: ArchiveIcon,
  },
  {
    label: 'Mais',
    href: '/mais',
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[180px] bg-[var(--sidebar)]">
      <div className="flex h-full flex-col items-center py-8">
        {/* Logo */}
        <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-1">
            <div className="h-2 w-2 rounded-full bg-[#A78BFA]" />
            <div className="h-2 w-2 rounded-full bg-[#C4B5FD]" />
            <div className="h-2 w-2 rounded-full bg-[#C4B5FD]" />
            <div className="h-2 w-2 rounded-full bg-[#A78BFA]" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href === '/a-venda' && pathname.startsWith('/veiculo'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all',
                  isActive
                    ? 'bg-white/15 text-white shadow-lg'
                    : 'text-[var(--sidebar-foreground)] hover:bg-white/10 hover:text-white'
                )}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Avatar */}
        <div className="mt-auto">
          <Avatar className="h-12 w-12 border-2 border-white/20">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Camila" alt="Camila" />
            <AvatarFallback className="bg-primary text-white">{'CM'}</AvatarFallback>
          </Avatar>
          <p className="mt-2 text-center text-xs text-[var(--sidebar-foreground)]">{'Camila'}</p>
          <p className="text-center text-[10px] text-[var(--sidebar-foreground)]/60">{'camila@email.com'}</p>
        </div>
      </div>
    </aside>
  )
}
