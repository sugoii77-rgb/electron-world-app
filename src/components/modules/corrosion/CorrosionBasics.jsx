import { useState, useEffect } from 'react'

const STEPS = [
  {
    id: 'anode',
    label: '①  양극 반응',
    eq: 'Fe → Fe²⁺ + 2e⁻',
    desc_analogy: '철 표면 일부가 "전자 내놓는 쪽" 역할을 해. 철 원자가 전자 2개를 떼어 내고 이온(Fe²⁺)이 돼서 물속으로 녹아 나가.',
    desc_science: '양극(anode)에서 철이 산화된다. 전자를 잃은 Fe²⁺ 이온이 전해질(물)로 용출된다.',
    color: '#f97316',
  },
  {
    id: 'electron',
    label: '②  전자 이동',
    eq: '2e⁻  →  (금속 표면을 따라 이동)',
    desc_analogy: '방출된 전자들이 철 표면을 따라 "음극 쪽"으로 달려가. 이게 작은 전기 흐름이야.',
    desc_science: '산화에서 생성된 전자는 금속 내부를 통해 음극(cathode) 영역으로 이동한다.',
    color: '#22d3ee',
  },
  {
    id: 'cathode',
    label: '③  음극 반응',
    eq: 'O₂ + 2H₂O + 4e⁻ → 4OH⁻',
    desc_analogy: '음극 쪽에서는 산소가 물과 전자를 같이 받아서 OH⁻(수산화 이온)을 만들어. 산소와 물이 없으면 이 반응이 안 일어나!',
    desc_science: '중성/습윤 환경의 음극 반응. 산소가 환원되며 OH⁻가 생성된다. 산소와 물이 모두 필요한 이유.',
    color: '#06b6d4',
  },
  {
    id: 'rust',
    label: '④  녹 생성',
    eq: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂  →  FeOOH / Fe₂O₃·xH₂O',
    desc_analogy: 'Fe²⁺와 OH⁻가 만나 수산화철이 생기고, 산화가 더 진행되면 우리가 보는 붉은 녹(Fe₂O₃·xH₂O)이 돼!',
    desc_science: 'Fe²⁺와 OH⁻가 결합해 Fe(OH)₂를 형성, 이후 산화 과정을 거쳐 FeOOH, Fe₂O₃·xH₂O 같은 수화 산화물로 변환된다.',
    color: '#b45309',
  },
]

export default function CorrosionBasics({ analogyMode }) {
  const [step, setStep] = useState(-1)
  const [running, setRunning] = useState(false)

  const start = () => { setStep(-1); setRunning(true) }

  useEffect(() => {
    if (!running) return
    if (step >= STEPS.length - 1) { setRunning(false); return }
    const t = setTimeout(() => setStep(s => s + 1), step === -1 ? 300 : 900)
    return () => clearTimeout(t)
  }, [running, step])

  const rustPct = step >= 3 ? 80 : step >= 2 ? 20 : 0

  return (
    <div className="space-y-5">
      <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
        <h2 className="text-orange-400 font-bold text-lg mb-1">⚡ 철 부식의 전기화학 메커니즘</h2>
        <p className="text-slate-400 text-xs mb-4">
          {analogyMode
            ? '철이 녹스는 건 단순히 "갈색 칠이 되는 것"이 아냐. 작은 전기 배터리처럼 철 표면에서 전기화학 반응이 일어나는 거야.'
            : '철 부식은 전기화학적 산화-환원 반응이다. 동일 금속 표면에 형성된 양극/음극 구역 사이에서 전자가 이동하며 반응이 진행된다.'}
        </p>

        {/* Cross-section visual */}
        <div className="relative rounded-xl overflow-hidden border border-slate-700/50 mb-4" style={{ height: 180 }}>
          {/* Background: electrolyte (water) */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0c1a2e 0%, #0f2744 100%)' }}>
            {/* Water label */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] text-blue-400/60">← 물 / 전해질 →</div>

            {/* O2 molecules floating */}
            {[15, 35, 55, 75, 90].map((x, i) => (
              <div key={i} className={`absolute text-[11px] text-blue-300/50 transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-30'}`}
                style={{ left: `${x}%`, top: `${8 + (i % 3) * 12}%` }}>O₂</div>
            ))}

            {/* OH- ions appearing */}
            {step >= 2 && [65, 78, 85].map((x, i) => (
              <div key={i} className="absolute text-[11px] text-cyan-400 animate-float" style={{ left: `${x}%`, top: `${30 + i * 10}%`, animationDelay: `${i * 0.3}s` }}>OH⁻</div>
            ))}

            {/* Fe2+ ions dissolving */}
            {step >= 0 && [10, 22, 8].map((x, i) => (
              <div key={i} className="absolute text-[11px] text-orange-400 animate-float" style={{ left: `${x}%`, top: `${20 + i * 12}%`, animationDelay: `${i * 0.4}s` }}>Fe²⁺</div>
            ))}
          </div>

          {/* Iron surface */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 55 }}>
            {/* Anode zone (left) */}
            <div className="absolute left-0 bottom-0 w-2/5 h-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: step >= 0 ? '#431407' : '#1e293b', borderTop: `2px solid ${step >= 0 ? '#f97316' : '#475569'}`, transition: 'all 0.5s' }}>
              <div className="text-center">
                <div style={{ color: step >= 0 ? '#f97316' : '#64748b' }}>양극 (Anode)</div>
                <div className="text-[10px] mt-0.5" style={{ color: step >= 0 ? '#fdba74' : '#475569' }}>Fe → Fe²⁺</div>
              </div>
            </div>

            {/* Electron flow */}
            {step >= 1 && (
              <div className="absolute bottom-0 left-2/5 right-2/5 h-1/2 flex items-center justify-center">
                <div className="w-full h-0.5 bg-cyan-500 relative overflow-hidden" style={{ boxShadow: '0 0 8px #22d3ee' }}>
                  <div className="absolute inset-0 animate-electron-flow-r" style={{ background: 'linear-gradient(to right, transparent, #22d3ee, transparent)', width: '40%' }} />
                </div>
                <div className="absolute text-[9px] text-cyan-400 -top-4">e⁻ →</div>
              </div>
            )}

            {/* Cathode zone (right) */}
            <div className="absolute right-0 bottom-0 w-2/5 h-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: step >= 2 ? '#052e16' : '#1e293b', borderTop: `2px solid ${step >= 2 ? '#22c55e' : '#475569'}`, transition: 'all 0.5s' }}>
              <div className="text-center">
                <div style={{ color: step >= 2 ? '#22c55e' : '#64748b' }}>음극 (Cathode)</div>
                <div className="text-[10px] mt-0.5" style={{ color: step >= 2 ? '#86efac' : '#475569' }}>O₂ + H₂O → OH⁻</div>
              </div>
            </div>

            {/* Rust spreading on anode */}
            <div className="absolute left-0 top-0 transition-all duration-700 overflow-hidden"
              style={{ width: `${rustPct}%`, height: 8, background: 'linear-gradient(to right, #92400e, #b45309)', opacity: 0.9 }} />
          </div>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setStep(i)}
              className={`rounded-xl border p-2.5 text-left text-xs transition-all ${step >= i ? 'scale-[1.02]' : 'opacity-40'}`}
              style={{ borderColor: step >= i ? s.color : '#334155', backgroundColor: step >= i ? s.color + '18' : 'transparent', boxShadow: step === i ? `0 0 12px ${s.color}50` : 'none' }}>
              <div className="font-bold mb-1" style={{ color: step >= i ? s.color : '#64748b' }}>{s.label}</div>
              <div className="font-mono text-[10px] leading-tight" style={{ color: step >= i ? s.color + 'bb' : '#475569' }}>{s.eq}</div>
            </button>
          ))}
        </div>

        {/* Current step description */}
        {step >= 0 && step < STEPS.length && (
          <div className="p-3 rounded-xl border text-sm transition-all" style={{ borderColor: STEPS[step].color + '50', background: STEPS[step].color + '10' }}>
            <div className="font-bold mb-1" style={{ color: STEPS[step].color }}>{STEPS[step].label}</div>
            <div className="font-mono text-[11px] px-2 py-1 bg-slate-900/60 rounded mb-2" style={{ color: STEPS[step].color + 'cc' }}>{STEPS[step].eq}</div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {analogyMode ? STEPS[step].desc_analogy : STEPS[step].desc_science}
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button onClick={start} disabled={running}
            className="flex-1 py-2.5 bg-gradient-to-r from-orange-800 to-red-900 hover:from-orange-700 hover:to-red-800 disabled:opacity-50 rounded-xl font-bold text-sm transition-all">
            {running ? '⏳ 반응 진행 중...' : step >= 0 ? '🔄 다시 보기' : '▶ 반응 시작'}
          </button>
          <button onClick={() => { setStep(-1); setRunning(false) }}
            className="px-4 py-2 border border-slate-700 text-slate-400 rounded-xl text-sm hover:border-slate-500 hover:text-white transition-colors">
            초기화
          </button>
        </div>

        <div className="mt-4 p-3 bg-orange-950/30 border border-orange-800/40 rounded-xl text-xs text-orange-300">
          💡 한 줄 요약: 녹은 철이 전자를 잃고 산소·물이 그 전자를 받아 생기는 전기화학 반응의 결과다.
          <span className="text-orange-400 font-bold"> 산소와 물이 동시에 있어야 빠르게 진행된다.</span>
        </div>
      </div>
    </div>
  )
}
