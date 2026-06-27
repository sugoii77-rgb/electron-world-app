import { useState } from 'react'

const NAV_ITEMS = [
  { id: 'map', label: '지도' },
  { id: 'module1', label: '1. 원자' },
  { id: 'module2', label: '2. 수소' },
  { id: 'module3', label: '3. 산성' },
  { id: 'module4', label: '4. 비타민C' },
  { id: 'module5', label: '5. 생체분자' },
  { id: 'module6', label: '6. 광합성' },
  { id: 'module7', label: '7. 오존' },
  { id: 'module8', label: '8. 금속' },
  { id: 'module9', label: '9. 부식' },
  { id: 'quiz', label: '퀴즈' },
  { id: 'summary', label: '요약' },
]

export default function NavBar({ currentPage, completed, navigate, analogyMode, setAnalogyMode, progress }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#0d0d24]/90 backdrop-blur border-b border-cyan-900/40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => navigate('home')}
          className="text-cyan-400 font-bold text-sm whitespace-nowrap hover:text-cyan-300 transition-colors"
        >
          ⚡ 전자와 결합
        </button>

        {/* Progress bar */}
        <div className="flex-1 hidden sm:flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-400 whitespace-nowrap">{progress}%</span>
        </div>

        {/* Analogy toggle */}
        <button
          onClick={() => setAnalogyMode(m => !m)}
          className={`text-xs px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
            analogyMode
              ? 'border-cyan-500 text-cyan-400 bg-cyan-950/50'
              : 'border-purple-500 text-purple-400 bg-purple-950/50'
          }`}
        >
          {analogyMode ? '🌟 비유 모드' : '🔬 정확 모드'}
        </button>

        {/* Mobile menu */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="text-slate-400 hover:text-white p-1"
          aria-label="메뉴"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute right-0 top-14 w-56 bg-[#0d0d24] border border-cyan-900/40 rounded-bl-xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isDone = completed.includes(item.id)
            const isCurrent = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => { navigate(item.id); setMenuOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                  isCurrent ? 'bg-cyan-900/30 text-cyan-300' :
                  'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  isDone ? 'bg-green-500 text-white' : 'border border-slate-600'
                }`}>
                  {isDone ? '✓' : ''}
                </span>
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </nav>
  )
}
