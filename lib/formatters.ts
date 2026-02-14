export function digitsOnly(input: string): string {
  return (input ?? '').replace(/\D+/g, '')
}

export function formatPhoneBR(raw: string): string {
  const d = digitsOnly(raw).slice(0, 11)
  if (!d) return ''
  const dd = d.slice(0, 2)
  const rest = d.slice(2)
  if (d.length <= 2) return `(${dd}`
  if (rest.length <= 4) return `(${dd}) ${rest}`
  if (rest.length <= 8) {
    // 10 dígitos total: (99) 9999-9999
    const p1 = rest.slice(0, 4)
    const p2 = rest.slice(4)
    return `(${dd}) ${p1}${p2 ? '-' + p2 : ''}`
  }
  // 11 dígitos total: (99) 99999-9999
  const p1 = rest.slice(0, 5)
  const p2 = rest.slice(5)
  return `(${dd}) ${p1}${p2 ? '-' + p2 : ''}`
}

export function formatCPF(raw: string): string {
  const d = digitsOnly(raw).slice(0, 11)
  const p1 = d.slice(0, 3)
  const p2 = d.slice(3, 6)
  const p3 = d.slice(6, 9)
  const p4 = d.slice(9, 11)
  let out = p1
  if (p2) out += `.${p2}`
  if (p3) out += `.${p3}`
  if (p4) out += `-${p4}`
  return out
}

export function formatBRLFromDigits(raw: string): string {
  const d = digitsOnly(raw)
  if (!d) return ''
  const cents = Number(d)
  const value = cents / 100
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
