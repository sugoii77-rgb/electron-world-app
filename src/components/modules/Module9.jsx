import { useState } from 'react'
import ModuleLayout from '../ModuleLayout'
import CorrosionBasics from './corrosion/CorrosionBasics'
import SaltHumiditySimulator from './corrosion/SaltHumiditySimulator'
import GalvanicSimulator from './corrosion/GalvanicSimulator'
import SteelComparison from './corrosion/SteelComparison'
import StainlessTypes from './corrosion/StainlessTypes'
import CorrosionGallery from './corrosion/CorrosionGallery'
import CorrosionQuiz from './corrosion/CorrosionQuiz'

const TABS = [
  { id: 'basics',   icon: '⚡', label: '기본 부식',       sub: '철 + O₂ + H₂O' },
  { id: 'salt',     icon: '🧂', label: '습기·염분 가속',  sub: 'NaCl·전해질' },
  { id: 'galvanic', icon: '🔋', label: '갈바닉(전식)',    sub: '이종 금속 접촉' },
  { id: 'steel',    icon: '🔩', label: '일반강 vs SS',    sub: '수동피막 비교' },
  { id: 'sstype',   icon: '🔬', label: 'Ferritic vs Aus', sub: '결정 구조·조성' },
]

export default function Module9({ analogyMode, onNext }) {
  const [tab, setTab] = useState('basics')

  return (
    <ModuleLayout
      number={9}
      title="부식 메커니즘 랩"
      icon="🔴"
      color="red"
      onNext={onNext}
      currentId="module9"
    >
      {/* Header summary */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-5">
        <h2 className="text-red-400 font-bold text-lg mb-2">🔴 부식 메커니즘 랩</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          {analogyMode
            ? '녹은 그냥 갈색으로 변하는 게 아냐. 철 표면에서 작은 전기 배터리가 돌고, 습기와 소금이 반응을 빠르게 하고, 다른 금속이 옆에 있으면 전식이 생겨. 스테인리스가 더 잘 버티는 이유도 있고, 스테인리스 종류마다 성능도 달라!'
            : '금속 부식은 전기화학 산화-환원 반응이다. 환경 인자(습기, 염화물, 온도)와 재료 특성(조성, 결정 구조, 수동피막)이 부식 거동을 결정한다. 이 모듈에서는 5가지 핵심 메커니즘을 인터랙티브로 탐구한다.'}
        </p>
      </section>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              tab === t.id
                ? 'border-red-500/70 bg-red-950/40 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.split(' ')[0]}</span>
            {tab === t.id && <span className="hidden md:inline text-red-500/70">— {t.sub}</span>}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'basics'   && <CorrosionBasics        analogyMode={analogyMode} />}
      {tab === 'salt'     && <SaltHumiditySimulator  analogyMode={analogyMode} />}
      {tab === 'galvanic' && <GalvanicSimulator       analogyMode={analogyMode} />}
      {tab === 'steel'    && <SteelComparison         analogyMode={analogyMode} />}
      {tab === 'sstype'   && <StainlessTypes          analogyMode={analogyMode} />}

      {/* Gallery & Quiz always visible below */}
      <div className="mt-6 space-y-6">
        <CorrosionGallery />
        <CorrosionQuiz />

        {/* Summary card */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: 'linear-gradient(135deg, #1a0505 0%, #0f172a 50%, #0a0a1a 100%)',
            borderColor: '#ef444450',
            boxShadow: '0 0 20px #ef444418',
          }}
        >
          <h3 className="text-red-400 font-bold text-base mb-3">📌 핵심 정리</h3>
          <div className="text-sm text-slate-300 leading-relaxed space-y-1.5">
            <p><strong className="text-orange-300">① 기본 부식:</strong> 철 부식은 전기화학 반응 — 양극(Fe → Fe²⁺)과 음극(O₂ + H₂O → OH⁻) 쌍이 필요하다.</p>
            <p><strong className="text-blue-300">② 습기·염분:</strong> 물은 전해질 경로를 만들고, NaCl은 전도성을 높이며 Cl⁻는 피막을 손상시켜 부식을 가속한다.</p>
            <p><strong className="text-purple-300">③ 갈바닉:</strong> 이종 금속 + 전해질 + 전위차 → 활성 금속(양극)이 먼저 희생된다. 면적비도 중요하다.</p>
            <p><strong className="text-cyan-300">④ 일반강 vs SS:</strong> 스테인리스는 Cr₂O₃ 수동피막으로 보호된다. 하지만 Cl⁻ 환경에서는 점부식이 생길 수 있다.</p>
            <p><strong className="text-violet-300">⑤ Ferritic vs Austenitic:</strong> Austenitic은 FCC + Cr+Ni(+Mo) 덕분에 일반적 환경에서 우수하지만, Ferritic이 SCC 저항 등에서 유리한 경우도 있다. 환경별 선택이 중요하다.</p>
          </div>
        </div>
      </div>
    </ModuleLayout>
  )
}
