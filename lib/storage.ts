'use client'

import type { Vehicle } from '@/components/vehicle-card'

export const KEYS = {
  forSale: 'mgm_vehicles_for_sale_v1',
  sold: 'mgm_vehicles_sold_v1',
  archived: 'mgm_vehicles_archived_v1',
  commissions: 'mgm_commissions_v1',
  commissionRates: 'mgm_commission_rates_v1',
} as const

export function loadList<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : fallback
  } catch {
    return fallback
  }
}

export function persistList<T>(key: string, list: T[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(list))
  } catch {
    // ignore
  }
}

export function loadRates(): { carro: number; moto: number } {
  if (typeof window === 'undefined') return { carro: 200, moto: 100 }
  try {
    const raw = window.localStorage.getItem(KEYS.commissionRates)
    if (!raw) return { carro: 200, moto: 100 }
    const parsed = JSON.parse(raw)
    return { carro: Number(parsed?.carro ?? 200), moto: Number(parsed?.moto ?? 100) }
  } catch {
    return { carro: 200, moto: 100 }
  }
}

export function addCommissionForSale(args: {
  type: 'carro' | 'moto'
  client: string
  vehicle: string
  plate: string
  date: string
}) {
  const rates = loadRates()
  const amount = args.type === 'moto' ? rates.moto : rates.carro
  const next = {
    id: `cm-${Date.now()}`,
    type: args.type,
    client: args.client,
    vehicle: args.vehicle,
    plate: args.plate,
    date: args.date,
    amount,
    status: 'a-receber' as const,
  }
  const existing = loadList<any>(KEYS.commissions, [])
  persistList(KEYS.commissions, [next, ...existing])
  return next
}

export function loadAllVehicles(): Vehicle[] {
  const forSale = loadList<Vehicle>(KEYS.forSale, [])
  const sold = loadList<Vehicle>(KEYS.sold, [])
  const archived = loadList<Vehicle>(KEYS.archived, [])
  return [...forSale, ...sold, ...archived]
}
