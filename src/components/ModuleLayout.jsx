export default function ModuleLayout({ number, title, icon, color = 'cyan', children, onNext, currentId }) {
  const colors = {
    cyan: { border: 'border-cyan-500/30', title: 'text-cyan-400', badge: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50' },
    purple: { border: 'border-purple-500/30', title: 'text-purple-400', badge: 'bg-purple-900/40 text-purple-300 border-purple-700/50' },
    green: { border: 'border-green-500/30', title: 'text-green-400', badge: 'bg-green-900/40 text-green-300 border-green-700/50' },
    yellow: { border: 'border-yellow-500/30', title: 'text-yellow-400', badge: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50' },
    orange: { border: 'border-orange-500/30', title: 'text-orange-400', badge: 'bg-orange-900/40 text-orange-300 border-orange-700/50' },
    red: { border: 'border-red-500/30', title: 'text-red-400', badge: 'bg-red-900/40 text-red-300 border-red-700/50' },
    blue: { border: 'border-blue-500/30', title: 'text-blue-400', badge: 'bg-blue-900/40 text-blue-300 border-blue-700/50' },
  }
  const c = colors[color] || colors.cyan

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-16">
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs mb-4 ${c.badge}`}>
        <span>{icon}</span>
        <span>모듈 {number}</span>
      </div>
      <h1 className={`text-3xl font-bold mb-8 ${c.title}`}>{title}</h1>
      {children}
      {onNext && (
        <div className="mt-10 flex justify-end">
          <button
            onClick={() => onNext(currentId)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-xl font-semibold transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center gap-2"
          >
            다음으로 →
          </button>
        </div>
      )}
    </div>
  )
}
