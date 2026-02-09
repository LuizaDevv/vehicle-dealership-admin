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
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]">
      <div className="flex h-full flex-col items-center py-4 space-y-4">
        {/* Logo */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#A78BFA]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#C4B5FD]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#C4B5FD]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#A78BFA]" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href === '/a-venda' && pathname.startsWith('/veiculo'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all',
                  isActive
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-[var(--sidebar-foreground)] hover:bg-white/10 hover:text-white'
                )}
                title={item.label}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Avatar */}
        <div className="p-1">
          <Avatar className="h-10 w-10 border border-white/20">
            <AvatarFallback className="bg-primary text-white text-xs font-semibold">CM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </aside>
  )
}
