export type BuildType = 'level' | 'variation'
export type BuildStatus = 'pending' | 'building' | 'needs-review' | 'completed' | 'failed'
export type BuildPriority = 1 | 2 | 3 | 4

export interface OpeningBuildItem {
  id: string                          // "italian-l2", "sicilian-najdorf"
  name: string                        // "Italian Game Level 2"
  slug: string                        // "italian" (parent opening slug)
  type: BuildType                     // What kind of build
  level?: number                      // 2 or 3 (for level builds)
  variationName?: string              // "Najdorf" (for variation builds)
  side: 'white' | 'black'
  category: '1.e4' | '1.d4'
  mainLine: string                    // Key moves for the agent
  extendsFrom?: string                // Node ID to continue from (for levels)
  priority: BuildPriority
  status: BuildStatus
  addedAt: string
  startedAt?: string
  completedAt?: string
  durationSeconds?: number
  error?: string
  logFile?: string
  verified: boolean
}

export interface BuildQueueData {
  version: 1
  items: OpeningBuildItem[]
}

export interface BuildRun {
  id: string
  startedAt: string
  completedAt: string
  itemsProcessed: number
  successes: number
  failures: number
}
