'use client'

import { useState, useEffect, useCallback } from 'react'

// --- Types ---
type AgentType = 'content' | 'feature' | 'bugfix' | 'style' | 'data' | 'qa'
type TaskStatus = 'queued' | 'in_progress' | 'done'

interface AgentTask {
  id: string
  agentType: AgentType
  description: string
  branch: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

// --- Agent Definitions ---
const agents: {
  type: AgentType
  name: string
  color: string
  role: string
  ownedFiles: string[]
  setupCommand: string
}[] = [
  {
    type: 'content',
    name: 'Content',
    color: '#58CC02',
    role: 'Curriculum data, puzzles, quips, lesson definitions',
    ownedFiles: ['data/staging/', 'data/lesson-pools/', 'data/clean-puzzles-v2/', 'lib/curriculum-registry.ts'],
    setupCommand: 'Read .claude/agents/content-agent.md and follow those instructions.',
  },
  {
    type: 'feature',
    name: 'Feature',
    color: '#1CB0F6',
    role: 'New features end-to-end (assigned per task)',
    ownedFiles: ['Declared per task'],
    setupCommand: 'Read .claude/agents/feature-agent.md and follow those instructions.',
  },
  {
    type: 'bugfix',
    name: 'Bugfix',
    color: '#FF4B4B',
    role: 'Bug investigation and root-cause fixes',
    ownedFiles: ['Declared after investigation'],
    setupCommand: 'Read .claude/agents/bugfix-agent.md and follow those instructions.',
  },
  {
    type: 'style',
    name: 'Style',
    color: '#CE82FF',
    role: 'UI design, styling, animations, visual polish',
    ownedFiles: ['components/', 'app/globals.css', 'public/brand/'],
    setupCommand: 'Read .claude/agents/style-agent.md and follow those instructions.',
  },
  {
    type: 'data',
    name: 'Data',
    color: '#FF9500',
    role: 'Database schema, API routes, sync logic, scripts',
    ownedFiles: ['supabase/', 'scripts/', 'app/api/', 'lib/progress-sync.ts'],
    setupCommand: 'Read .claude/agents/data-agent.md and follow those instructions.',
  },
  {
    type: 'qa',
    name: 'QA',
    color: '#FFC800',
    role: 'Testing, verification, build checks (read-only)',
    ownedFiles: ['e2e/', 'scripts/test-*'],
    setupCommand: 'Read .claude/agents/qa-agent.md and follow those instructions.',
  },
]

const AGENT_COLORS: Record<AgentType, string> = {
  content: '#58CC02',
  feature: '#1CB0F6',
  bugfix: '#FF4B4B',
  style: '#CE82FF',
  data: '#FF9500',
  qa: '#FFC800',
}

// --- Conflict Matrix ---
type Safety = 'safe' | 'warn' | 'self'
const AGENT_TYPES: AgentType[] = ['content', 'feature', 'bugfix', 'style', 'data', 'qa']

const conflictMatrix: Record<string, Safety> = {
  'content-content': 'self',
  'content-feature': 'safe',
  'content-bugfix': 'safe',
  'content-style': 'safe',
  'content-data': 'warn',
  'content-qa': 'safe',
  'feature-feature': 'self',
  'feature-bugfix': 'warn',
  'feature-style': 'warn',
  'feature-data': 'warn',
  'feature-qa': 'safe',
  'bugfix-bugfix': 'self',
  'bugfix-style': 'warn',
  'bugfix-data': 'warn',
  'bugfix-qa': 'safe',
  'style-style': 'self',
  'style-data': 'safe',
  'style-qa': 'safe',
  'data-data': 'self',
  'data-qa': 'safe',
  'qa-qa': 'self',
}

function getConflict(a: AgentType, b: AgentType): Safety {
  const key1 = `${a}-${b}`
  const key2 = `${b}-${a}`
  return conflictMatrix[key1] || conflictMatrix[key2] || 'safe'
}

// --- File Ownership Tree ---
const fileTree: { path: string; agent: AgentType; indent: number }[] = [
  { path: 'app/api/', agent: 'data', indent: 1 },
  { path: 'app/admin/', agent: 'feature', indent: 1 },
  { path: 'app/globals.css', agent: 'style', indent: 1 },
  { path: 'app/layout.tsx', agent: 'style', indent: 1 },
  { path: 'app/learn/', agent: 'feature', indent: 1 },
  { path: 'app/lesson/', agent: 'feature', indent: 1 },
  { path: 'app/run/', agent: 'feature', indent: 1 },
  { path: 'components/', agent: 'style', indent: 0 },
  { path: 'data/staging/', agent: 'content', indent: 1 },
  { path: 'data/lesson-pools/', agent: 'content', indent: 1 },
  { path: 'data/clean-puzzles-v2/', agent: 'content', indent: 1 },
  { path: 'hooks/', agent: 'feature', indent: 0 },
  { path: 'lib/curriculum-registry.ts', agent: 'content', indent: 1 },
  { path: 'lib/progress-sync.ts', agent: 'data', indent: 1 },
  { path: 'lib/sounds.ts', agent: 'feature', indent: 1 },
  { path: 'lib/config/', agent: 'feature', indent: 1 },
  { path: 'supabase/', agent: 'data', indent: 0 },
  { path: 'scripts/', agent: 'data', indent: 0 },
  { path: 'e2e/', agent: 'qa', indent: 0 },
  { path: 'public/brand/', agent: 'style', indent: 0 },
]

// --- localStorage Task Manager ---
const STORAGE_KEY = 'chesspath-agent-tasks'

function loadTasks(): AgentTask[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTasks(tasks: AgentTask[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

// --- Components ---

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
    >
      {copied ? 'Copied' : 'Copy setup'}
    </button>
  )
}

function AgentCards() {
  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-4">Agent Types</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.type}
            className="bg-chess-bg-light rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: agent.color }}
                />
                <h3 className="font-bold text-white">{agent.name}</h3>
              </div>
              <CopyButton text={agent.setupCommand} />
            </div>
            <p className="text-sm text-gray-400 mb-3">{agent.role}</p>
            <div className="space-y-1">
              {agent.ownedFiles.map((f) => (
                <div key={f} className="text-xs font-mono text-gray-500 bg-chess-bg px-2 py-1 rounded">
                  {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ConflictMatrix() {
  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-4">Conflict Matrix</h2>
      <div className="overflow-x-auto">
        <div className="bg-chess-bg-light rounded-xl p-4 border border-gray-700/50 inline-block min-w-full">
          <table className="w-auto">
            <thead>
              <tr>
                <th className="p-2" />
                {AGENT_TYPES.map((t) => (
                  <th key={t} className="p-2 text-xs font-medium text-center" style={{ color: AGENT_COLORS[t] }}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AGENT_TYPES.map((row) => (
                <tr key={row}>
                  <td className="p-2 text-xs font-medium text-right pr-3" style={{ color: AGENT_COLORS[row] }}>
                    {row.charAt(0).toUpperCase() + row.slice(1)}
                  </td>
                  {AGENT_TYPES.map((col) => {
                    const safety = getConflict(row, col)
                    const bg =
                      safety === 'self'
                        ? 'bg-gray-700/50'
                        : safety === 'warn'
                          ? 'bg-orange-500/20'
                          : 'bg-green-500/20'
                    const text =
                      safety === 'self'
                        ? 'text-gray-500'
                        : safety === 'warn'
                          ? 'text-orange-400'
                          : 'text-green-400'
                    const label = safety === 'self' ? '--' : safety === 'warn' ? 'WARN' : 'SAFE'
                    return (
                      <td key={col} className={`p-2 text-center rounded ${bg}`}>
                        <span className={`text-xs font-bold ${text}`}>{label}</span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function FileOwnershipMap() {
  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-4">File Ownership</h2>
      <div className="bg-chess-bg-light rounded-xl p-4 border border-gray-700/50">
        <div className="space-y-1 font-mono text-sm">
          {fileTree.map((entry) => (
            <div key={entry.path} className="flex items-center gap-3" style={{ paddingLeft: `${entry.indent * 16}px` }}>
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: AGENT_COLORS[entry.agent] }}
              />
              <span className="text-gray-300">{entry.path}</span>
              <span className="text-xs px-1.5 py-0.5 rounded" style={{
                color: AGENT_COLORS[entry.agent],
                backgroundColor: `${AGENT_COLORS[entry.agent]}15`,
              }}>
                {entry.agent}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TaskTracker() {
  const [tasks, setTasks] = useState<AgentTask[]>([])
  const [newType, setNewType] = useState<AgentType>('feature')
  const [newDesc, setNewDesc] = useState('')
  const [newBranch, setNewBranch] = useState('')

  useEffect(() => {
    setTasks(loadTasks())
  }, [])

  const persist = useCallback((updated: AgentTask[]) => {
    setTasks(updated)
    saveTasks(updated)
  }, [])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDesc.trim()) return
    const task: AgentTask = {
      id: Date.now().toString(),
      agentType: newType,
      description: newDesc.trim(),
      branch: newBranch.trim() || `agent/${newType}/${newDesc.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`,
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    persist([...tasks, task])
    setNewDesc('')
    setNewBranch('')
  }

  const updateStatus = (id: string, status: TaskStatus) => {
    persist(tasks.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)))
  }

  const deleteTask = (id: string) => {
    persist(tasks.filter((t) => t.id !== id))
  }

  const columns: { status: TaskStatus; label: string }[] = [
    { status: 'queued', label: 'Queued' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'done', label: 'Done' },
  ]

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-4">Task Tracker</h2>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="bg-chess-bg-light rounded-xl p-4 border border-gray-700/50 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as AgentType)}
            className="bg-chess-bg border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            {AGENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Task description..."
            rows={1}
            className="flex-1 bg-chess-bg border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
          />
          <input
            value={newBranch}
            onChange={(e) => setNewBranch(e.target.value)}
            placeholder="Branch (optional)"
            className="bg-chess-bg border border-gray-600 rounded-lg px-3 py-2 text-white text-sm sm:w-48"
          />
          <button
            type="submit"
            className="bg-chess-green text-white font-bold text-sm px-4 py-2 rounded-lg whitespace-nowrap hover:bg-chess-green-dark transition-colors"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status)
          return (
            <div key={col.status} className="bg-chess-bg-light rounded-xl p-3 border border-gray-700/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                  {col.label}
                </h3>
                <span className="text-xs text-gray-500 bg-chess-bg px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>
              <div className="space-y-2">
                {colTasks.length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-4">No tasks</p>
                )}
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-chess-bg rounded-lg p-3 border border-gray-700/30"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
                        style={{ backgroundColor: AGENT_COLORS[task.agentType] }}
                      />
                      <p className="text-sm text-gray-200 leading-snug">{task.description}</p>
                    </div>
                    <div className="text-xs font-mono text-gray-500 mb-2 truncate">
                      {task.branch}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {formatTime(task.updatedAt)}
                      </span>
                      <div className="flex gap-1">
                        {task.status === 'queued' && (
                          <button
                            onClick={() => updateStatus(task.id, 'in_progress')}
                            className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                          >
                            Start
                          </button>
                        )}
                        {task.status === 'in_progress' && (
                          <button
                            onClick={() => updateStatus(task.id, 'done')}
                            className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          >
                            Done
                          </button>
                        )}
                        {task.status === 'done' && (
                          <button
                            onClick={() => updateStatus(task.id, 'queued')}
                            className="text-xs px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
                          >
                            Requeue
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// --- Main Page ---

function AgentDashboardContent() {
  return (
    <div className="min-h-screen bg-chess-bg text-white">
      {/* Header */}
      <div className="bg-chess-bg-light border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-xl font-bold text-white">Agent Dashboard</h1>
                <p className="text-sm text-gray-400">Parallel development coordination</p>
              </div>
              <a
                href="/admin"
                className="text-sm text-gray-400 hover:text-chess-blue transition-colors"
              >
                Back to Admin
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <AgentCards />
        <ConflictMatrix />
        <FileOwnershipMap />
        <TaskTracker />
      </div>
    </div>
  )
}

export default function AgentDashboardPage() {
  return <AgentDashboardContent />
}
