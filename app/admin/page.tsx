'use client'

import { useState } from 'react'
import Link from 'next/link'

const mvpPages = [
  { name: 'Landing', path: '/admin/landing-preview', description: 'Journey path landing with auto-animation' },
  { name: 'Login', path: '/auth/login', description: 'User authentication' },
  { name: 'Signup', path: '/auth/signup', description: 'User registration' },
  { name: 'Learning Tree', path: '/learn', description: 'Main curriculum - 25 lessons by ELO' },
  { name: 'Lesson Player', path: '/lesson/1.1', description: 'Solve 6 puzzles per lesson' },
]

const pantryPages = [
  { name: 'Landing', path: '/', description: 'Public marketing page' },
  { name: 'Home Dashboard', path: '/home', description: 'Feature card navigation' },
  { name: 'Daily Challenge', path: '/daily-challenge', description: '5-min timed mode with lives' },
  { name: 'Workout', path: '/workout', description: 'Unlimited puzzle practice' },
  { name: 'Profile', path: '/profile', description: 'Stats with bubble chart' },
  { name: 'Puzzle Viewer', path: '/puzzle/fork', description: 'Browse puzzles by theme' },
  { name: 'Review Tool', path: '/review', description: 'Admin: approve/reject puzzles' },
  { name: 'Flagged Puzzles', path: '/flagged', description: 'Admin: problematic puzzles' },
]

const testPages = [
  { name: 'Color Palettes', path: '/test-color-palettes', description: '10 palettes × 5 neon intensities' },
  { name: 'Neon Buttons', path: '/test-neon-buttons', description: '10 neon button styles to compare' },
  { name: 'Animated Landing', path: '/test-animated-landing', description: '6 designs with animated puzzles by ELO' },
  { name: 'Unified Design', path: '/test-unified-design', description: 'Balanced design with Landing, Home, Learn tabs' },
  { name: 'Landing Designs', path: '/test-landing-designs', description: '5 landing page variations with JourneyPath' },
  { name: 'Test Home', path: '/test-home', description: 'Alternative home design' },
  { name: 'Test Landing', path: '/test-landing', description: 'Alternative landing design' },
  { name: 'Test Profile', path: '/test-profile', description: 'Alternative profile design' },
  { name: 'Test Progress', path: '/test-progress', description: 'Progress tracking test' },
  { name: 'Test Sounds', path: '/test-sounds', description: 'Audio system testing' },
  { name: 'Test Themes', path: '/test-themes', description: 'Theme display testing' },
]

type Page = { name: string; path: string; description: string }

export default function AdminPage() {
  const [selectedPage, setSelectedPage] = useState<Page>(mvpPages[0]) // Start with Landing
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'mvp' | 'pantry' | 'test'>('mvp')

  const getPageCategory = (page: Page) => {
    if (mvpPages.some(p => p.path === page.path)) return 'mvp'
    if (pantryPages.some(p => p.path === page.path)) return 'pantry'
    return 'test'
  }

  const currentCategory = getPageCategory(selectedPage)

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Admin Header */}
      <div className="bg-[#1A2C35] border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-xl font-bold text-white">The Chess Path</h1>
                <p className="text-sm text-gray-400">Admin Dashboard</p>
              </div>
              <Link
                href="/admin/puzzle-process"
                className="text-sm text-gray-400 hover:text-[#1CB0F6] transition-colors"
              >
                Puzzle Pipeline Docs
              </Link>
              <Link
                href="/admin/difficulty-analyzer"
                className="text-sm text-gray-400 hover:text-[#58CC02] transition-colors"
              >
                Difficulty Analyzer
              </Link>
            </div>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-[#131F24] border border-gray-600 rounded-lg px-4 py-2 hover:border-[#58CC02] transition-colors min-w-[220px] justify-between"
              >
                <div className="flex items-center gap-2">
                  {currentCategory === 'mvp' && (
                    <span className="w-2 h-2 rounded-full bg-[#58CC02]"></span>
                  )}
                  {currentCategory === 'pantry' && (
                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                  )}
                  {currentCategory === 'test' && (
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  )}
                  <span>{selectedPage.name}</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-[#1A2C35] border border-gray-600 rounded-lg shadow-xl overflow-hidden z-50">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-700">
                    <button
                      onClick={() => setActiveTab('mvp')}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'mvp'
                          ? 'bg-[#58CC02]/20 text-[#58CC02] border-b-2 border-[#58CC02]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      MVP ({mvpPages.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('pantry')}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'pantry'
                          ? 'bg-gray-500/20 text-white border-b-2 border-gray-500'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Pantry ({pantryPages.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('test')}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'test'
                          ? 'bg-yellow-500/20 text-yellow-500 border-b-2 border-yellow-500'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Test ({testPages.length})
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {activeTab === 'mvp' && (
                      <>
                        <div className="px-4 py-2 bg-[#58CC02]/10 text-xs text-[#58CC02]">
                          Ship these first - core product
                        </div>
                        {mvpPages.map((page) => (
                          <button
                            key={page.path}
                            onClick={() => {
                              setSelectedPage(page)
                              setIsDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-[#131F24] transition-colors border-b border-gray-700/50 ${
                              selectedPage.path === page.path ? 'bg-[#131F24] border-l-2 border-l-[#58CC02]' : ''
                            }`}
                          >
                            <div className="font-medium">{page.name}</div>
                            <div className="text-xs text-gray-400">{page.description}</div>
                          </button>
                        ))}
                      </>
                    )}

                    {activeTab === 'pantry' && (
                      <>
                        <div className="px-4 py-2 bg-gray-500/10 text-xs text-gray-400">
                          Built but not MVP - save for later
                        </div>
                        {pantryPages.map((page) => (
                          <button
                            key={page.path}
                            onClick={() => {
                              setSelectedPage(page)
                              setIsDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-[#131F24] transition-colors border-b border-gray-700/50 ${
                              selectedPage.path === page.path ? 'bg-[#131F24] border-l-2 border-l-gray-500' : ''
                            }`}
                          >
                            <div className="font-medium text-gray-300">{page.name}</div>
                            <div className="text-xs text-gray-500">{page.description}</div>
                          </button>
                        ))}
                      </>
                    )}

                    {activeTab === 'test' && (
                      <>
                        <div className="px-4 py-2 bg-yellow-500/10 text-xs text-yellow-500">
                          Experiments - development only
                        </div>
                        {testPages.map((page) => (
                          <button
                            key={page.path}
                            onClick={() => {
                              setSelectedPage(page)
                              setIsDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-[#131F24] transition-colors border-b border-gray-700/50 ${
                              selectedPage.path === page.path ? 'bg-[#131F24] border-l-2 border-l-yellow-500' : ''
                            }`}
                          >
                            <div className="font-medium text-gray-300">{page.name}</div>
                            <div className="text-xs text-gray-500">{page.description}</div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Info Bar */}
      <div className="bg-[#1A2C35]/50 border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentCategory === 'mvp' && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#58CC02]/20 text-[#58CC02]">
                MVP
              </span>
            )}
            {currentCategory === 'pantry' && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-500/20 text-gray-400">
                PANTRY
              </span>
            )}
            {currentCategory === 'test' && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-500">
                TEST
              </span>
            )}
            <span className="font-semibold">{selectedPage.name}</span>
            <span className="text-gray-500">•</span>
            <code className="text-sm bg-[#131F24] px-2 py-1 rounded text-gray-300">{selectedPage.path}</code>
          </div>
          <Link
            href={selectedPage.path}
            target="_blank"
            className="flex items-center gap-2 text-sm text-[#1CB0F6] hover:text-[#58CC02] transition-colors"
          >
            Open in new tab
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Page Preview */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-[#1A2C35] rounded-xl overflow-hidden border border-gray-700">
          {/* Browser Chrome */}
          <div className="bg-[#131F24] px-4 py-2 flex items-center gap-2 border-b border-gray-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 ml-4">
              <div className="bg-[#1A2C35] rounded px-3 py-1 text-sm text-gray-400 max-w-md">
                localhost:3000{selectedPage.path}
              </div>
            </div>
          </div>

          {/* iframe Preview */}
          <iframe
            key={selectedPage.path}
            src={selectedPage.path}
            className="w-full h-[calc(100vh-220px)] bg-[#131F24]"
            title={`Preview of ${selectedPage.name}`}
          />
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
}
