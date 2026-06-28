import { useState, useEffect } from 'react'

export default function SuperpositionSection({ analogyMode }) {
  const [state, setState]     = useState('superposition') // 'superposition' | 'collapsing' | 'result'
  const [result, setResult]   = useState(null)
  const [history, setHistory] = useState([])

  const measure = () => {
    if (state !== 'superposition') return
    setState('collapsing')
    setTimeout(() => {
      const r = Math.random() < 0.5 ? 0 : 1
      setResult(r)
      setState('result')
      setHistory(h => [...h, r].slice(-12))
    }, 700)
  }

  const reset = () => {
    setState('superposition')
    setResult(null)
  }

  const zeros = history.filter(v => v === 0).length
  const ones  = history.filter(v => v === 1).length

  return (
    <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
      <h2 className="text-purple-400 font-bold text-lg mb-1">🌀 양자 중첩</h2>
      <p className="text-slate-400 text-xs mb-1">
        {analogyMode
          ? '도는 동전은 앞면/뒷면이 섞여 보이지만, 손바닥으로 탁 치면 하나의 면으로 결정돼. 양자 입자도 측정 전에는 여러 가능성이 공존해!'
          : '중첩 상태는 가능한 양자 상태들의 선형 결합이며, 측정 결과는 확률적으로 하나의 고유상태로 나타난다. (|ψ⟩ = α|0⟩ + β|1⟩)'}
      </p>
      <div className="text-[10px] text-yellow-600 mb-4">
        ⚠️ 주의: 양자 중첩은 단순히 우리가 결과를 모른다는 뜻과 다르다. 실제 양자 상태가 여러 가능성의 조합으로 표현된다는 뜻이다.
      </div>

      {/* Coin visual */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-36 h-36 mb-4">
          {state === 'superposition' && (
            <div className="w-full h-full rounded-full border-4 flex items-center justify-center"
              style={{
                borderColor: '#a78bfa',
                boxShadow: '0 0 30px #a78bfa60, 0 0 60px #7c3aed30',
                animation: 'spin-slow 2s linear infinite',
                background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
              }}>
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-purple-300 opacity-60">0</div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-black text-cyan-300 opacity-60"
                  style={{ animation: 'flicker 1.5s ease-in-out infinite alternate' }}>1</div>
              </div>
            </div>
          )}

          {state === 'collapsing' && (
            <div className="w-full h-full rounded-full border-4 flex items-center justify-center"
              style={{ borderColor: '#fbbf24', boxShadow: '0 0 40px #fbbf2480', background: 'linear-gradient(135deg, #451a03, #78350f)', animation: 'pulse 0.3s ease-in-out infinite' }}>
              <div className="text-3xl animate-spin">⚡</div>
            </div>
          )}

          {state === 'result' && (
            <div className="w-full h-full rounded-full border-4 flex items-center justify-center transition-all duration-500"
              style={{
                borderColor: result === 0 ? '#22d3ee' : '#a78bfa',
                boxShadow: `0 0 40px ${result === 0 ? '#22d3ee' : '#a78bfa'}80`,
                background: result === 0
                  ? 'linear-gradient(135deg, #0c4a6e, #075985)'
                  : 'linear-gradient(135deg, #3b0764, #4c1d95)',
              }}>
              <div className="text-6xl font-black" style={{ color: result === 0 ? '#22d3ee' : '#a78bfa' }}>
                {result}
              </div>
            </div>
          )}
        </div>

        {/* State label */}
        <div className={`text-sm font-bold px-4 py-1.5 rounded-full border transition-all ${
          state === 'superposition' ? 'border-purple-500/60 text-purple-300 bg-purple-950/30' :
          state === 'collapsing'   ? 'border-yellow-500/60 text-yellow-300 bg-yellow-950/30' :
          'border-cyan-500/60 text-cyan-300 bg-cyan-950/30'
        }`}>
          {state === 'superposition' && '측정 전: |0⟩과 |1⟩의 중첩 상태'}
          {state === 'collapsing'    && '⚡ 파동함수 붕괴 중...'}
          {state === 'result'        && `측정 결과: ${result} (확정)`}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mb-5 justify-center">
        <button onClick={measure} disabled={state !== 'superposition'}
          className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.03] disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 20px #7c3aed40' }}>
          🔭 측정하기
        </button>
        <button onClick={reset} disabled={state === 'collapsing'}
          className="px-6 py-3 rounded-xl border border-purple-700/50 text-purple-300 font-bold text-sm hover:border-purple-500 transition-all disabled:opacity-40">
          🔄 다시 준비
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-slate-500 mb-2">측정 기록 (최근 {history.length}회)</div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {history.map((v, i) => (
              <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border"
                style={{ borderColor: v === 0 ? '#22d3ee60' : '#a78bfa60', color: v === 0 ? '#22d3ee' : '#a78bfa', background: v === 0 ? '#0c4a6e30' : '#3b076430' }}>
                {v}
              </div>
            ))}
          </div>
          <div className="text-xs text-slate-500">
            0: {zeros}회 ({Math.round(zeros/history.length*100)}%) &nbsp;|&nbsp; 1: {ones}회 ({Math.round(ones/history.length*100)}%)
            &nbsp;— 많이 측정할수록 50%에 수렴
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="p-3 bg-purple-950/20 border border-purple-700/30 rounded-xl text-xs text-slate-300 leading-relaxed">
        <div className="text-purple-300 font-bold mb-1">🔑 양자 중첩 vs 단순한 무지</div>
        고전적 동전은 실제로 앞면/뒷면 중 하나이고 우리가 모를 뿐이다.
        하지만 양자 입자는 측정 전까지 실제로 두 상태가 공존하는 것처럼 행동한다 —
        이는 실험적으로 검증된 양자역학의 핵심 성질이다.
        측정은 단순히 결과를 "확인"하는 것이 아니라, 상태를 결정하는 과정이다.
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes flicker { 0% { opacity: 0.3; } 100% { opacity: 0.9; } }
      `}</style>
    </div>
  )
}
