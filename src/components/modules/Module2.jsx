import { useState } from 'react'
import ModuleLayout from '../ModuleLayout'
import MiniQuiz from '../MiniQuiz'

const STATES = {
  neutral: {
    label: 'H (중성)',
    electrons: 1,
    chargeColor: 'text-slate-300',
    chargeBg: 'bg-slate-700',
    chargeText: '0',
    desc: '양성자 1개 + 전자 1개. 완전한 중성 수소.',
    glowColor: 'shadow-[0_0_15px_#64748b]',
    borderColor: 'border-slate-500',
  },
  positive: {
    label: 'H⁺ (양성자)',
    electrons: 0,
    chargeColor: 'text-red-300',
    chargeBg: 'bg-red-800',
    chargeText: '+',
    desc: '전자를 잃은 수소. 사실상 양성자만 남은 상태. 산에서 내놓는 이온!',
    glowColor: 'shadow-[0_0_25px_#ef4444]',
    borderColor: 'border-red-500',
    pulse: true,
  },
  negative: {
    label: 'H⁻ (수소화 이온)',
    electrons: 2,
    chargeColor: 'text-blue-300',
    chargeBg: 'bg-blue-800',
    chargeText: '−',
    desc: '전자를 하나 더 얻은 수소. 전자 2개를 가진 상태. 강한 환원제!',
    glowColor: 'shadow-[0_0_25px_#3b82f6]',
    borderColor: 'border-blue-500',
  },
}

export default function Module2({ analogyMode, onNext }) {
  const [state, setState] = useState('neutral')
  const s = STATES[state]

  return (
    <ModuleLayout number={2} title="수소 H, H⁺, H⁻" icon="⚡" color="blue" onNext={onNext} currentId="module2">
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-blue-400 font-bold text-lg mb-3">📖 핵심 개념</h2>
        {analogyMode ? (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>⚡ 수소는 가장 단순한 원소야. 양성자 1개, 전자 1개가 전부야.</p>
            <p>🪙 전자를 잃으면 H⁺ — 마치 껍데기를 벗은 수소, 그냥 양성자야.</p>
            <p>🛡️ 전자를 하나 더 얻으면 H⁻ — 전자 2개를 껴안은 수소야. 강한 전자 공여체야.</p>
            <p className="text-yellow-300">💡 "수소가 없어졌다"는 게 아니야! 전자를 잃었을 뿐이야.</p>
          </div>
        ) : (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p><strong className="text-slate-100">H</strong>: 양성자 1개, 전자 1개. 기저상태에서 1s 오비탈에 전자 1개.</p>
            <p><strong className="text-red-300">H⁺</strong>: 전자 0개, 양성자만 남은 상태. 수용액에서는 H₃O⁺(하이드로늄 이온)로 존재한다. 산-염기 반응의 핵심 입자.</p>
            <p><strong className="text-blue-300">H⁻</strong>: 전자 2개. 헬륨과 같은 전자 배치(1s²). 강한 환원제로 NaH, LiAlH₄ 등에 존재한다.</p>
          </div>
        )}
      </section>

      {/* Interactive */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-blue-400 font-bold text-lg mb-4">🎮 수소 변환기</h2>

        <div className="flex gap-3 justify-center mb-6">
          {Object.entries(STATES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setState(key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                state === key
                  ? `${val.borderColor} text-white bg-slate-700`
                  : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Atom display */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Orbital rings — diameter = 2 × translateX = 100px */}
            {s.electrons > 0 && <div className="absolute rounded-full border border-cyan-500/30" style={{ width: 100, height: 100 }} />}
            {s.electrons > 1 && <div className="absolute rounded-full border border-cyan-400/15" style={{ width: 115, height: 115 }} />}

            {/* Nucleus */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl z-10 transition-all duration-500 ${s.chargeBg} ${s.glowColor} ${s.pulse ? 'animate-pulse-glow' : ''}`}>
              <span className={s.chargeColor}>{s.chargeText}</span>
            </div>

            {/* Electrons — zero-size wrapper at center */}
            {s.electrons >= 1 && (
              <div className="absolute top-1/2 left-1/2 animate-orbit">
                <div className="w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
              </div>
            )}
            {s.electrons >= 2 && (
              <div className="absolute top-1/2 left-1/2 animate-orbit2" style={{ animationDelay: '-1.75s' }}>
                <div className="w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-cyan-300 rounded-full shadow-[0_0_10px_#67e8f9]" />
              </div>
            )}

            {/* No electron message */}
            {s.electrons === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-red-500/30 animate-pulse-glow" />
              </div>
            )}
          </div>

          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${s.chargeColor}`}>{s.label}</div>
            <div className="text-sm text-slate-400">전자 수: {s.electrons}개</div>
          </div>

          <div className="max-w-xs text-center p-3 rounded-xl bg-slate-800/60 text-sm text-slate-300">
            {s.desc}
          </div>
        </div>
      </section>

      {/* Key insight */}
      <div className="bg-yellow-950/40 border border-yellow-700/40 rounded-xl p-4 mb-4">
        <p className="text-yellow-300 text-sm font-medium">
          💡 "H⁺는 수소가 사라진 게 아니라, 수소가 전자를 잃은 상태다. 양성자가 그대로 남아있어!"
        </p>
      </div>

      {/* Comparison table */}
      <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs">
        {[
          { label: 'H', e: 1, p: 1, charge: '0', bg: 'bg-slate-800' },
          { label: 'H⁺', e: 0, p: 1, charge: '+1', bg: 'bg-red-950/50' },
          { label: 'H⁻', e: 2, p: 1, charge: '−1', bg: 'bg-blue-950/50' },
        ].map(row => (
          <div key={row.label} className={`${row.bg} border border-slate-700/40 rounded-xl p-3`}>
            <div className="font-bold text-lg text-white mb-2">{row.label}</div>
            <div className="text-slate-400">양성자: {row.p}</div>
            <div className="text-slate-400">전자: {row.e}</div>
            <div className={`font-bold mt-1 ${row.charge.startsWith('+') ? 'text-red-400' : row.charge.startsWith('−') ? 'text-blue-400' : 'text-green-400'}`}>
              전하 {row.charge}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-4 mb-2">
        <p className="text-blue-300 text-sm font-medium">
          💡 한 줄 요약: H⁺는 전자 없는 양성자, H⁻는 전자 두 개짜리 수소. 전자 하나의 차이가 성질을 완전히 바꾼다.
        </p>
      </div>

      <MiniQuiz
        question="H⁺는 수소가 전자를 잃은 상태(사실상 양성자)다."
        answer="O"
        explanation="H⁺는 양성자 1개만 남은 상태다. 수용액에서는 H₃O⁺로 존재하며 산의 핵심 이온이다."
      />
    </ModuleLayout>
  )
}
