import { useState } from 'react'

const MATERIALS = {
  mild: {
    label: '일반강',
    grade: '(저탄소강)',
    structure: 'BCC',
    cr: '~0%',
    ni: '0%',
    mo: '0%',
    color: '#6b7280',
    film: 0,
    scores: { general: 1, pitting: 1, scc: 4, cost: 5 },
  },
  ferritic: {
    label: 'Ferritic SS',
    grade: '(430계열)',
    structure: 'BCC',
    cr: '16~18%',
    ni: '≈0%',
    mo: '0%',
    color: '#94a3b8',
    film: 60,
    scores: { general: 3, pitting: 3, scc: 5, cost: 4 },
  },
  austenitic_304: {
    label: 'Austenitic SS',
    grade: '(304)',
    structure: 'FCC',
    cr: '18~20%',
    ni: '8~10%',
    mo: '0%',
    color: '#22d3ee',
    film: 85,
    scores: { general: 5, pitting: 4, scc: 2, cost: 3 },
  },
  austenitic_316: {
    label: 'Austenitic SS',
    grade: '(316)',
    structure: 'FCC',
    cr: '16~18%',
    ni: '10~14%',
    mo: '2~3%',
    color: '#a78bfa',
    film: 95,
    scores: { general: 5, pitting: 5, scc: 2, cost: 2 },
  },
}

const ENVS = {
  dry:      { label: '실내 건조 🏠',   scores: { mild: 2, ferritic: 5, austenitic_304: 5, austenitic_316: 5 } },
  humid:    { label: '일반 습윤 💧',   scores: { mild: 1, ferritic: 4, austenitic_304: 5, austenitic_316: 5 } },
  marine:   { label: '해안/염분 🌊',   scores: { mild: 0, ferritic: 2, austenitic_304: 3, austenitic_316: 5 } },
  cleaning: { label: '세정제 환경 🧴', scores: { mild: 0, ferritic: 3, austenitic_304: 4, austenitic_316: 5 } },
  scratch:  { label: '스크래치+습기 ✂️', scores: { mild: 0, ferritic: 3, austenitic_304: 4, austenitic_316: 4 } },
}

const SCORE_LABELS = ['매우 나쁨','나쁨','보통','양호','우수','최고']
const SCORE_COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#a78bfa']

function ScoreBar({ score, max = 5 }) {
  const color = SCORE_COLORS[score]
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(score / max) * 100}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}80` }} />
      </div>
      <span className="text-[10px] w-16 shrink-0" style={{ color }}>{SCORE_LABELS[score]}</span>
    </div>
  )
}

const PROP_ROWS = [
  { key: 'general',  label: '🛡 일반 내식성' },
  { key: 'pitting',  label: '🎯 점부식 저항' },
  { key: 'scc',      label: '💥 응력부식균열 저항' },
  { key: 'cost',     label: '💰 상대적 경제성' },
]

export default function StainlessTypes({ analogyMode }) {
  const [env, setEnv] = useState('humid')
  const [selectedMat, setSelectedMat] = useState(null)

  const envData = ENVS[env]

  return (
    <div className="space-y-5">
      <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
        <h2 className="text-purple-400 font-bold text-lg mb-1">🔬 Ferritic vs Austenitic 스테인리스 비교</h2>
        <p className="text-slate-400 text-xs mb-2">
          {analogyMode
            ? '같은 스테인리스라도 종류가 달라. Cr만 있는 ferritic과, Cr+Ni(+Mo)가 있는 austenitic은 결정 구조부터 성질이 다르지!'
            : 'Ferritic(BCC, Cr기반)과 Austenitic(FCC, Cr+Ni기반)은 결정 구조, 합금 성분, 내식 특성이 모두 다르다. 환경에 따라 최적 선택이 다를 수 있다.'}
        </p>
        <div className="mb-4 p-2.5 bg-yellow-950/30 border border-yellow-800/40 rounded-xl text-[11px] text-yellow-400">
          ⚖️ 교육용 균형 주의: 모든 상황에서 austenitic이 절대 우위는 아니다. 예를 들어 일부 ferritic은 응력부식균열(SCC) 저항이 더 유리한 경우가 있다.
        </div>

        {/* Crystal structure cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {Object.entries(MATERIALS).map(([k, m]) => (
            <button key={k} onClick={() => setSelectedMat(selectedMat === k ? null : k)}
              className={`rounded-xl border p-3 text-left text-xs transition-all ${selectedMat === k ? 'scale-105' : 'hover:scale-[1.02]'}`}
              style={{ borderColor: selectedMat === k ? m.color : '#334155', backgroundColor: selectedMat === k ? m.color + '18' : '#0f172a', boxShadow: selectedMat === k ? `0 0 14px ${m.color}40` : 'none' }}>
              <div className="font-bold mb-1" style={{ color: m.color }}>{m.label}</div>
              <div className="text-slate-500 mb-2">{m.grade}</div>
              <div className="space-y-0.5 text-[10px]">
                <div style={{ color: m.color + 'aa' }}>구조: {m.structure}</div>
                <div style={{ color: m.color + 'aa' }}>Cr: {m.cr}</div>
                <div style={{ color: m.color + 'aa' }}>Ni: {m.ni}</div>
                <div style={{ color: m.color + 'aa' }}>Mo: {m.mo}</div>
              </div>
              {/* Film bar */}
              <div className="mt-2">
                <div className="text-[9px] text-slate-600 mb-0.5">수동피막 안정성</div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${m.film}%`, backgroundColor: m.color, boxShadow: `0 0 4px ${m.color}80` }} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected material detail */}
        {selectedMat && (() => {
          const m = MATERIALS[selectedMat]
          return (
            <div className="mb-5 p-4 rounded-xl border transition-all" style={{ borderColor: m.color + '50', backgroundColor: m.color + '08' }}>
              <div className="font-bold mb-3" style={{ color: m.color }}>{m.label} {m.grade} — 성능 프로필</div>
              <div className="space-y-2">
                {PROP_ROWS.map(r => (
                  <div key={r.key}>
                    <div className="text-[11px] text-slate-400 mb-1">{r.label}</div>
                    <ScoreBar score={m.scores[r.key]} />
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* Environment comparison */}
        <div className="mb-3">
          <div className="text-xs text-slate-400 mb-2">환경별 성능 비교</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ENVS).map(([k, v]) => (
              <button key={k} onClick={() => setEnv(k)}
                className={`px-3 py-1.5 rounded-xl border text-xs transition-all ${env === k ? 'border-blue-500 bg-blue-950/40 text-blue-300' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Environment result grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {Object.entries(MATERIALS).map(([k, m]) => {
            const score = envData.scores[k]
            const scoreColor = SCORE_COLORS[score]
            return (
              <div key={k} className="rounded-xl border p-3 text-xs" style={{ borderColor: scoreColor + '40', backgroundColor: scoreColor + '08' }}>
                <div className="font-bold mb-1" style={{ color: m.color }}>{m.label}</div>
                <div className="text-slate-500 text-[10px] mb-2">{m.grade}</div>
                <ScoreBar score={score} />
                <div className="mt-2 text-[10px]" style={{ color: scoreColor }}>
                  {score <= 1 ? '매우 불리 ✘' : score <= 2 ? '위험 ⚠️' : score <= 3 ? '보통' : score <= 4 ? '양호 ✔' : '우수 ✅'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Why austenitic better (in typical environments) */}
        <div className="bg-purple-950/20 border border-purple-700/40 rounded-xl p-4">
          <div className="font-bold text-purple-300 mb-3">🔍 왜 Austenitic이 보통 더 유리하다고 알려졌나?</div>
          <div className="space-y-2 text-xs text-slate-300">
            {[
              { title: '① Cr + Ni 조합', body: 'Ni는 FCC 구조를 안정화하고 전반적인 내식성, 인성, 가공성을 개선한다. Cr₂O₃ 피막 품질도 향상된다.' },
              { title: '② 더 치밀한 수동피막', body: 'Ni 첨가로 Cr₂O₃ 피막이 더 균일하고 치밀해지는 경향이 있어 다양한 환경에서 우수한 성능을 보인다.' },
              { title: '③ 316의 Mo 효과', body: 'Mo는 염화물 환경에서 피팅/틈부식 저항을 크게 높인다. 해안, 식품 가공, 의료 분야에서 316이 선택되는 이유.' },
              { title: '④ 더 넓은 검증 이력', body: '304/316은 전 세계적으로 가장 많이 쓰이는 스테인리스로, 다양한 산업 환경에서 데이터 축적이 풍부하다.' },
              { title: '⑤ Ferritic이 유리한 경우', body: '일부 Ferritic은 염화물 응력부식균열(SCC)에 더 강한 장점이 있다. Ni가 없어 SCC 감수성이 낮기 때문이다. 용도에 따라 Ferritic이 적합할 수 있다.' },
            ].map(item => (
              <div key={item.title} className="flex gap-2">
                <span className="text-purple-400 font-bold shrink-0">{item.title.split(' ')[0]}</span>
                <div>
                  <span className="text-purple-300 font-medium">{item.title.slice(item.title.indexOf(' ') + 1)} </span>
                  <span className="text-slate-400">{item.body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
