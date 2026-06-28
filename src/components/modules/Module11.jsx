import { useState } from 'react'
import ModuleLayout from '../ModuleLayout'
import BohrSection           from './quantum/BohrSection'
import DoubleSlitSection     from './quantum/DoubleSlitSection'
import UncertaintySection    from './quantum/UncertaintySection'
import SuperpositionSection  from './quantum/SuperpositionSection'
import EntanglementSection   from './quantum/EntanglementSection'
import QuantumComputerSection from './quantum/QuantumComputerSection'
import QuantumQuiz           from './quantum/QuantumQuiz'

const TABS = [
  { id: 'bohr',     icon: '⚛️', label: '보어 모형',    sub: '에너지 준위·광자', color: '#22d3ee' },
  { id: 'slit',     icon: '〰', label: '이중 슬릿',    sub: '파동-입자 이중성', color: '#3b82f6' },
  { id: 'uncert',   icon: '🌀', label: '불확정성',     sub: 'Δx·Δp ≥ ħ/2',   color: '#eab308' },
  { id: 'super',    icon: '🔮', label: '양자 중첩',    sub: '|0⟩ + |1⟩',      color: '#a78bfa' },
  { id: 'entangle', icon: '🔗', label: '양자 얽힘',    sub: '비국소 상관관계', color: '#ec4899' },
  { id: 'qc',       icon: '💻', label: '양자 컴퓨터',  sub: '중첩·간섭 연산', color: '#06b6d4' },
]

const SUMMARY_POINTS = [
  '전자는 정해진 에너지 준위 사이에서 빛을 흡수·방출하며 상태를 바꿀 수 있다.',
  '전자는 입자처럼 검출되지만, 많은 전자를 모으면 파동의 간섭 무늬가 나타난다.',
  '위치와 운동량은 동시에 무한히 정확하게 알 수 없다 (불확정성 원리).',
  '중첩은 측정 전 여러 가능한 상태가 양자적으로 함께 표현되는 상태다.',
  '측정은 중첩 상태를 하나의 결과로 나타나게 한다 (파동함수 붕괴).',
  '얽힘은 멀리 떨어진 입자 사이의 강한 양자 상관관계다.',
  '양자컴퓨터는 중첩과 간섭을 이용해 정답 확률을 키우는 방식으로 계산한다.',
  '양자역학은 전자, 결합, 빛, 물질의 성질을 이해하는 더 깊은 규칙이다.',
]

export default function Module11({ analogyMode, onNext }) {
  const [tab, setTab] = useState('bohr')
  const activeTab = TABS.find(t => t.id === tab)

  return (
    <ModuleLayout number={11} title="양자역학 인터랙티브 랩" icon="⚛️" color="purple" onNext={onNext} currentId="module11">

      {/* Header card */}
      <section className="relative rounded-2xl border border-purple-700/40 p-5 mb-5 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0a2a 0%, #0c1a2e 50%, #0a0a1a 100%)', boxShadow: '0 0 30px #7c3aed20' }}>
        {/* Background glow dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[{x:10,y:20,c:'#22d3ee'},{x:80,y:10,c:'#a78bfa'},{x:50,y:80,c:'#ec4899'},{x:90,y:70,c:'#3b82f6'}].map((dot,i) => (
            <div key={i} className="absolute rounded-full opacity-20 animate-pulse"
              style={{ left:`${dot.x}%`, top:`${dot.y}%`, width:80, height:80, background:dot.c, filter:'blur(30px)', animationDelay:`${i*0.7}s` }} />
          ))}
        </div>

        <div className="relative z-10">
          <div className="text-purple-400 font-bold text-lg mb-2">⚛️ 양자역학 인터랙티브 랩</div>
          <p className="text-slate-300 text-sm leading-relaxed mb-2">
            우리가 앞에서 배운 전자, 결합, 산화/환원은 사실 더 깊이 들어가면
            <strong className="text-purple-300"> 양자역학의 규칙 위에서 움직인다.</strong>
            양자역학은 아주 작은 세계에서 입자들이 어떻게 존재하고, 움직이고, 측정되는지를 설명하는 물리학이다.
          </p>
          <div className="p-3 bg-purple-950/30 border border-purple-700/30 rounded-xl text-xs text-purple-200 leading-relaxed">
            💡 전자 세계는 작은 당구공처럼 움직이지 않는다. 전자는
            <strong> 에너지 준위, 파동성, 확률, 중첩, 측정</strong>이라는 낯선 규칙을 따른다.
          </div>
        </div>
      </section>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              tab === t.id ? 'scale-[1.03]' : 'hover:scale-[1.01] border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            style={tab === t.id ? {
              borderColor: t.color + '80',
              background:  t.color + '15',
              color:        t.color,
              boxShadow:   `0 0 12px ${t.color}30`,
            } : {}}>
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.split(' ')[0]}</span>
            {tab === t.id && <span className="hidden md:inline opacity-60">— {t.sub}</span>}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'bohr'     && <BohrSection            analogyMode={analogyMode} />}
      {tab === 'slit'     && <DoubleSlitSection       analogyMode={analogyMode} />}
      {tab === 'uncert'   && <UncertaintySection      analogyMode={analogyMode} />}
      {tab === 'super'    && <SuperpositionSection    analogyMode={analogyMode} />}
      {tab === 'entangle' && <EntanglementSection     analogyMode={analogyMode} />}
      {tab === 'qc'       && <QuantumComputerSection  analogyMode={analogyMode} />}

      {/* Quiz */}
      <div className="mt-6">
        <QuantumQuiz />
      </div>

      {/* Summary card */}
      <div className="mt-6 rounded-2xl p-5 border"
        style={{
          background: 'linear-gradient(135deg, #0f0a2a 0%, #0a0a1a 50%, #0c1a2e 100%)',
          borderColor: '#7c3aed50',
          boxShadow: '0 0 20px #7c3aed18',
        }}>
        <h3 className="text-purple-400 font-bold text-base mb-3">📌 핵심 정리 — 양자역학 8가지</h3>
        <div className="space-y-2">
          {SUMMARY_POINTS.map((pt, i) => (
            <div key={i} className="flex gap-2 text-sm text-slate-300">
              <span className="text-purple-500 font-bold shrink-0">{'①②③④⑤⑥⑦⑧'[i]}</span>
              <span className="leading-relaxed">{pt}</span>
            </div>
          ))}
        </div>
      </div>
    </ModuleLayout>
  )
}
