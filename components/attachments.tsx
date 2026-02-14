'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Download, Paperclip, Trash2 } from 'lucide-react'

export type AttachmentItem = {
  id: string
  name: string
  size: number
  type: string
  file: File
}

function formatBytes(bytes: number) {
  if (!bytes && bytes !== 0) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let val = bytes
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024
    i++
  }
  return `${val.toFixed(val >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

export function Attachments({
  value,
  onChange,
  className,
  label = 'Documentos',
  accept,
  multiple = true,
}: {
  value: AttachmentItem[]
  onChange: (next: AttachmentItem[]) => void
  className?: string
  label?: string
  accept?: string
  multiple?: boolean
}) {
  const inputId = React.useId()

  function addFiles(files: FileList | null) {
    if (!files?.length) return
    const next: AttachmentItem[] = []
    for (const file of Array.from(files)) {
      next.push({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      })
    }
    onChange([...value, ...next])
  }

  function remove(id: string) {
    onChange(value.filter((f) => f.id !== id))
  }

  function download(item: AttachmentItem) {
    const url = URL.createObjectURL(item.file)
    const a = document.createElement('a')
    a.href = url
    a.download = item.name || 'arquivo'
    // tenta forçar download sem abrir outra aba
    a.rel = 'noreferrer'
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div>
          <input
            id={inputId}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={(e) => addFiles(e.target.files)}
          />
          <Button
            type="button"
            variant="secondary"
            className="h-9 rounded-xl bg-secondary/40 text-foreground hover:bg-secondary/60 border border-border/60"
            onClick={() => document.getElementById(inputId)?.click()}
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Anexar
          </Button>
        </div>
      </div>

      {value.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-background/20 p-6 text-center text-sm text-muted-foreground">
          Nenhum arquivo anexado.
        </div>
      ) : (
        <div className="space-y-2">
          {value.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/20 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{f.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-9 rounded-xl bg-secondary/40 text-foreground hover:bg-secondary/60 border border-border/60"
                  onClick={() => download(f)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-white/10"
                  onClick={() => remove(f.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
