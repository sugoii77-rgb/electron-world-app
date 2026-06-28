const MODULES = [
  { id: 'module1',  num: 1,  icon: '⚛️', label: '원자와 전자',          color: 'cyan'   },
  { id: 'module2',  num: 2,  icon: '⚡', label: '수소 H, H⁺, H⁻',      color: 'blue'   },
  { id: 'module3',  num: 3,  icon: '🧪', label: '산성과 -COOH',          color: 'green'  },
  { id: 'module4',  num: 4,  icon: '🍊', label: '비타민 C와 항산화',      color: 'yellow' },
  { id: 'module5',  num: 5,  icon: '🧬', label: '탄수화물·지방·아미노산', color: 'orange' },
  { id: 'module6',  num: 6,  icon: '🌿', label: '광합성과 탄소 포집',     color: 'green'  },
  { id: 'module7',  num: 7,  icon: '☁️', label: '오존과 활성산소',        color: 'blue'   },
  { id: 'module8',  num: 8,  icon: '⚙️', label: '금속 결합',             color: 'purple' },
  { id: 'module9',  num: 9,  icon: '🔴', label: '녹·산화·보호막',         color: 'red'    },
  { id: 'module10', num: 10, icon: '🍺', label: '술이 취하고 깨는 화학',  color: 'blue'   },
]

const colorMap = {
  cyan:   'border-cyan-500/50 text-cyan-400 bg-cyan-950/40',
  blue:   'border-blue-500/50 text-blue-400 bg-blue-950/40',
  green:  'border-green-500/50 text-green-400 bg-green-950/40',
  yellow: 'border-yellow-500/50 text-yellow-400 bg-yellow-950/40',
  orange: 'border-orange-500/50 text-orange-400 bg-orange-950/40',
  purple: 'border-purple-500/50 text-purple-400 bg-purple-950/40',
  red:    'border-red-500/50 text-red-400 bg-red-950/40',
}

const FLOW = ['전자', '이온', '산성', '항산화', '생체분자', '광합성', '산화', '금속/부식', '에탄올 대사']

export default function LearningMap({ completed, navigate }) {
  const total = MODULES.length + 2 // +퀴즈+요약
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-cyan-400 mb-2">학습 지도</h1>
      <p className="text-center text-slate-400 text-sm mb-6">모듈을 클릭해서 시작하세요</p>

      {/* Flow */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {FLOW.map((f, i) => (
          <span key={f} className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{f}</span>
            {i < FLOW.length - 1 && <span className="text-cyan-600 text-xs">→</span>}
          </span>
        ))}
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {MODULES.map(m => {
          const isDone = completed.includes(m.id)
          const cls = colorMap[m.color]
          return (
            <button
              key={m.id}
              onClick={() => navigate(m.id)}
              className={`relative border rounded-2xl p-4 text-left transition-all hover:scale-[1.03] hover:shadow-lg ${cls}`}
            >
              {isDone && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
              )}
              <div className="text-3xl mb-2">{m.icon}</div>
              <div className="text-xs text-slate-500 mb-0.5">모듈 {m.num}</div>
              <div className="font-semibold text-sm leading-tight">{m.label}</div>
            </button>
          )
        })}
      </div>

      {/* Quiz & Summary */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {[
          { id: 'quiz',    icon: '🏆', label: '퀴즈 / 미션',   color: 'border-yellow-500/50 text-yellow-400 bg-yellow-950/30' },
          { id: 'summary', icon: '📋', label: '전체 요약 카드', color: 'border-slate-500/50 text-slate-300 bg-slate-800/40'    },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`border rounded-2xl p-4 text-left transition-all hover:scale-[1.03] ${item.color}`}
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="font-semibold text-sm">{item.label}</div>
            {completed.includes(item.id) && <span className="text-xs text-green-400">✓ 완료</span>}
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-slate-400">
          <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
          완료: {completed.length}개 / {total}개
        </div>
      </div>
    </div>
  )
}
