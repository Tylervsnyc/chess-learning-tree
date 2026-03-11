'use client'

import { useState, useEffect, useCallback } from 'react'
import type { OpeningBuildItem, BuildStatus, BuildPriority } from '@/types/build-queue'

// --- Status Badge ---
const STATUS_COLORS: Record<BuildStatus, { bg: string; text: string; label: string }> = {
  pending:        { bg: 'bg-gray-600',   text: 'text-gray-200',   label: 'Pending' },
  building:       { bg: 'bg-blue-600',   text: 'text-blue-100',   label: 'Building' },
  'needs-review': { bg: 'bg-yellow-600', text: 'text-yellow-100', label: 'Review' },
  completed:      { bg: 'bg-green-600',  text: 'text-green-100',  label: 'Done' },
  failed:         { bg: 'bg-red-600',    text: 'text-red-100',    label: 'Failed' },
}

function StatusBadge({ status }: { status: BuildStatus }) {
  const style = STATUS_COLORS[status]
  return (
    <span className={`${style.bg} ${style.text} text-xs font-bold px-2 py-1 rounded-full ${status === 'building' ? 'animate-pulse' : ''}`}>
      {style.label}
    </span>
  )
}

// --- Priority Badge ---
function PriorityBadge({ priority }: { priority: BuildPriority }) {
  const colors = {
    1: 'text-red-400',
    2: 'text-yellow-400',
    3: 'text-blue-400',
    4: 'text-gray-400',
  }
  return <span className={`${colors[priority]} font-mono text-sm font-bold`}>P{priority}</span>
}

// --- Stats ---
interface QueueStats {
  total: number
  pending: number
  building: number
  needsReview: number
  completed: number
  failed: number
  verified: number
}

// --- Capacity Meter ---
function CapacityMeter({ stats }: { stats: QueueStats }) {
  const done = stats.completed + stats.failed
  const progress = stats.total > 0 ? (done / stats.total) * 100 : 0

  return (
    <div className="bg-[#1A2C35] rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-bold text-lg">Build Capacity</h2>
        <span className="text-gray-400 text-sm">{done} of {stats.total} builds processed</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#0D1B22] rounded-full h-4 mb-4 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-[#58CC02] to-[#76d530] transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Stat chips */}
      <div className="flex gap-3 flex-wrap">
        <StatChip label="Pending" count={stats.pending} color="text-gray-400" />
        <StatChip label="Building" count={stats.building} color="text-blue-400" />
        <StatChip label="Review" count={stats.needsReview} color="text-yellow-400" />
        <StatChip label="Done" count={stats.completed} color="text-green-400" />
        <StatChip label="Failed" count={stats.failed} color="text-red-400" />
        <StatChip label="Verified" count={stats.verified} color="text-emerald-400" />
      </div>
    </div>
  )
}

function StatChip({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="bg-[#0D1B22] px-3 py-1.5 rounded-lg flex items-center gap-2">
      <span className={`${color} font-bold text-sm`}>{count}</span>
      <span className="text-gray-500 text-xs">{label}</span>
    </div>
  )
}

// --- Add Form ---
function AddBuildForm({ onAdd }: { onAdd: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    id: '',
    name: '',
    slug: '',
    type: 'variation' as 'level' | 'variation',
    level: 2,
    variationName: '',
    side: 'white' as 'white' | 'black',
    category: '1.e4' as '1.e4' | '1.d4' | '1.c4',
    mainLine: '',
    extendsFrom: '',
    priority: 2 as BuildPriority,
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const body = {
      ...form,
      level: form.type === 'level' ? form.level : undefined,
      variationName: form.type === 'variation' ? form.variationName : undefined,
      extendsFrom: form.type === 'level' ? form.extendsFrom : undefined,
    }

    try {
      const res = await fetch('/api/build-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to add')
        return
      }
      setForm({ id: '', name: '', slug: '', type: 'variation', level: 2, variationName: '', side: 'white', category: '1.e4', mainLine: '', extendsFrom: '', priority: 2 })
      setOpen(false)
      onAdd()
    } catch {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="bg-[#1A2C35] text-[#58CC02] border border-[#58CC02]/30 px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#58CC02]/10 transition-colors">
        + Add Build
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#1A2C35] rounded-xl p-5 mb-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white font-bold text-lg">Add Build</h2>
        <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-sm">Cancel</button>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <Input label="ID" value={form.id} onChange={v => setForm(f => ({ ...f, id: v }))} placeholder="italian-l2" />
        <Input label="Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Italian Game Level 2" />
        <Select label="Slug" value={form.slug} onChange={v => setForm(f => ({ ...f, slug: v }))} options={['italian', 'pirc-defense', 'ruy-lopez', 'sicilian', 'french', 'london', 'scotch', 'caro-kann', 'kings-gambit', 'kings-indian']} />
        <Select label="Type" value={form.type} onChange={v => setForm(f => ({ ...f, type: v as 'level' | 'variation' }))} options={['level', 'variation']} />
        <Select label="Side" value={form.side} onChange={v => setForm(f => ({ ...f, side: v as 'white' | 'black' }))} options={['white', 'black']} />
        <Select label="Category" value={form.category} onChange={v => setForm(f => ({ ...f, category: v as '1.e4' | '1.d4' | '1.c4' }))} options={['1.e4', '1.d4', '1.c4']} />
        <Select label="Priority" value={String(form.priority)} onChange={v => setForm(f => ({ ...f, priority: Number(v) as BuildPriority }))} options={['1', '2', '3', '4']} />
        {form.type === 'level' && (
          <>
            <Select label="Level" value={String(form.level)} onChange={v => setForm(f => ({ ...f, level: Number(v) }))} options={['2', '3']} />
            <Input label="Extends From" value={form.extendsFrom} onChange={v => setForm(f => ({ ...f, extendsFrom: v }))} placeholder="it-test-1" />
          </>
        )}
        {form.type === 'variation' && (
          <Input label="Variation" value={form.variationName} onChange={v => setForm(f => ({ ...f, variationName: v }))} placeholder="Evans Gambit" />
        )}
      </div>

      <Input label="Main Line" value={form.mainLine} onChange={v => setForm(f => ({ ...f, mainLine: v }))} placeholder="1.e4 e5 2.Nf3 Nc6 3.Bc4" />

      <button type="submit" disabled={submitting} className="w-full py-2 bg-[#58CC02] text-white font-bold rounded-lg disabled:opacity-50">
        {submitting ? 'Adding...' : 'Add to Queue'}
      </button>
    </form>
  )
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-gray-400 text-xs mb-1 block">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 bg-[#0D1B22] border border-gray-700 rounded-lg text-white text-sm" />
    </div>
  )
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-gray-400 text-xs mb-1 block">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 bg-[#0D1B22] border border-gray-700 rounded-lg text-white text-sm">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

// --- Queue Table ---
function QueueTable({ items, onAction }: { items: OpeningBuildItem[]; onAction: () => void }) {
  const [filter, setFilter] = useState<BuildStatus | 'all'>('all')

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)

  const handleAction = async (id: string, action: 'requeue' | 'verify' | 'delete') => {
    if (action === 'delete') {
      await fetch(`/api/build-queue/${id}`, { method: 'DELETE' })
    } else if (action === 'requeue') {
      await fetch(`/api/build-queue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' }),
      })
    } else if (action === 'verify') {
      await fetch(`/api/build-queue/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', verified: true }),
      })
    }
    onAction()
  }

  return (
    <div className="bg-[#1A2C35] rounded-xl overflow-hidden">
      {/* Filter bar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-700/50">
        <h2 className="text-white font-bold text-lg mr-auto">Queue</h2>
        {(['all', 'pending', 'building', 'needs-review', 'completed', 'failed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${filter === f ? 'bg-[#58CC02] text-white' : 'bg-[#0D1B22] text-gray-400 hover:text-white'}`}
          >
            {f === 'all' ? 'All' : f === 'needs-review' ? 'Review' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-700/30">
              <th className="text-left px-5 py-2">Priority</th>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Type</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Duration</th>
              <th className="text-right px-5 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b border-gray-700/20 hover:bg-[#0D1B22]/50 transition-colors">
                <td className="px-5 py-3"><PriorityBadge priority={item.priority} /></td>
                <td className="px-3 py-3">
                  <div className="text-white font-medium">{item.name}</div>
                  <div className="text-gray-500 text-xs">{item.side} · {item.category}</div>
                </td>
                <td className="px-3 py-3 text-gray-400">
                  {item.type === 'level' ? `Level ${item.level}` : 'Variation'}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status} />
                    {item.verified && <span className="text-emerald-400 text-xs">✓</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-gray-400 text-xs">
                  {item.durationSeconds ? formatDuration(item.durationSeconds) : '—'}
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    {(item.status === 'failed' || item.status === 'needs-review') && (
                      <ActionBtn label="Requeue" onClick={() => handleAction(item.id, 'requeue')} color="text-blue-400" />
                    )}
                    {item.status === 'needs-review' && (
                      <ActionBtn label="Verify" onClick={() => handleAction(item.id, 'verify')} color="text-green-400" />
                    )}
                    {item.status === 'pending' && (
                      <ActionBtn label="Delete" onClick={() => handleAction(item.id, 'delete')} color="text-red-400" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-gray-500 text-center py-8">No items match this filter</div>
      )}
    </div>
  )
}

function ActionBtn({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
  return (
    <button onClick={onClick} className={`${color} text-xs px-2 py-1 rounded hover:bg-white/5 transition-colors`}>
      {label}
    </button>
  )
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

// --- Build History ---
function BuildHistory({ items }: { items: OpeningBuildItem[] }) {
  const completed = items
    .filter(i => i.completedAt)
    .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''))
    .slice(0, 10)

  if (completed.length === 0) return null

  return (
    <div className="bg-[#1A2C35] rounded-xl p-5 mt-6">
      <h2 className="text-white font-bold text-lg mb-3">Recent Builds</h2>
      <div className="space-y-2">
        {completed.map(item => (
          <div key={item.id + item.completedAt} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <StatusBadge status={item.status} />
              <span className="text-white">{item.name}</span>
            </div>
            <div className="flex items-center gap-4">
              {item.durationSeconds && <span className="text-gray-500 text-xs">{formatDuration(item.durationSeconds)}</span>}
              <span className="text-gray-500 text-xs">{item.completedAt ? new Date(item.completedAt).toLocaleDateString() : ''}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Main Page ---
function BuildSchedulerPage() {
  const [items, setItems] = useState<OpeningBuildItem[]>([])
  const [stats, setStats] = useState<QueueStats>({ total: 0, pending: 0, building: 0, needsReview: 0, completed: 0, failed: 0, verified: 0 })
  const [loading, setLoading] = useState(true)

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/build-queue')
      const data = await res.json()
      setItems(data.queue.items)
      setStats(data.stats)
    } catch {
      console.error('Failed to fetch queue')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchQueue() }, [fetchQueue])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
        <div className="text-gray-400">Loading queue...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#131F24] p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <a href="/admin" className="text-gray-500 text-sm hover:text-gray-300 mb-1 block">&larr; Admin</a>
          <h1 className="text-2xl font-bold text-white">Build Scheduler</h1>
        </div>
        <div className="flex items-center gap-3">
          <AddBuildForm onAdd={fetchQueue} />
          <button onClick={fetchQueue} className="text-gray-400 hover:text-white text-sm px-3 py-2 bg-[#1A2C35] rounded-lg">
            Refresh
          </button>
        </div>
      </div>

      <CapacityMeter stats={stats} />
      <QueueTable items={items} onAction={fetchQueue} />
      <BuildHistory items={items} />

      {/* CLI hint */}
      <div className="mt-6 bg-[#0D1B22] rounded-xl p-4 text-gray-500 text-xs font-mono">
        <span className="text-gray-400">Run manually:</span> npm run build-openings -- -n 2
      </div>
    </div>
  )
}

export default function Page() {
  return <BuildSchedulerPage />
}
