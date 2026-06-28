import { useState, useEffect, useRef } from 'react'
import ModuleLayout from '../ModuleLayout'

// ── 데이터 ────────────────────────────────────────────────────
const STAGES = [
  {
    id: 'ethanol',
    label: '에탄올',
    formula: 'CH₃CH₂OH',
    color: '#3b82f6',
    glow: '#3b82f680',
    emoji: '🍺',
    desc: '술의 주성분',
    analogy: '뇌 신호 조절기를 살짝 엉키게 만드는 손님',
    science: '뇌에서 GABA 수용체 활성↑, NMDA 수용체 억제 → 진정, 판단력 저하',
    warning: null,
  },
  {
    id: 'enzyme1',
    label: 'ADH 효소',
    formula: 'Alcohol\nDehydrogenase',
    color: '#8b5cf6',
    glow: '#8b5cf640',
    emoji: '⚙️',
    isEnzyme: true,
    desc: '간에서 에탄올을 산화',
    reaction: 'CH₃CH₂OH + NAD⁺ → CH₃CHO + NADH + H⁺',
  },
  {
    id: 'acetaldehyde',
    label: '아세트알데하이드',
    formula: 'CH₃CHO',
    color: '#ef4444',
    glow: '#ef444480',
    emoji: '☠️',
    desc: '독성이 강하고 반응성이 큼',
    analogy: '술 대사 중간에 나오는 까칠한 중간보스',
    science: '단백질·DNA와 부가물 형성. 얼굴 붉어짐·두근거림·메스꺼움·숙취 원인',
    warning: '⚠️ 독성 중간체',
  },
  {
    id: 'enzyme2',
    label: 'ALDH 효소',
    formula: 'Aldehyde\nDehydrogenase',
    color: '#8b5cf6',
    glow: '#8b5cf640',
    emoji: '⚙️',
    isEnzyme: true,
    desc: '아세트알데하이드를 아세트산으로 산화',
    reaction: 'CH₃CHO + NAD⁺ + H₂O → CH₃COOH + NADH + H⁺',
  },
  {
    id: 'acetate',
    label: '아세트산',
    formula: 'CH₃COOH',
    color: '#22c55e',
    glow: '#22c55e80',
    emoji: '✅',
    desc: '카복실기(-COOH)를 가진 산',
    analogy: '처리 가능한 형태로 바뀐 순한 산',
    science: '식초의 주성분과 같다. 아세틸-CoA로 전환되어 TCA 회로에 진입 가능',
    warning: null,
    cooh: true,
  },
  {
    id: 'acetylcoa',
    label: '아세틸-CoA',
    formula: 'CH₃CO-SCoA',
    color: '#f59e0b',
    glow: '#f59e0b80',
    emoji: '🔋',
    isEnzyme: false,
    desc: '에너지 대사 진입',
    analogy: '에너지 공장 TCA 회로로 들어가는 연료',
    science: 'TCA 회로 → 전자전달계 → ATP 생산',
    warning: null,
  },
  {
    id: 'final',
    label: 'CO₂ + H₂O',
    formula: 'CO₂ + H₂O',
    color: '#64748b',
    glow: '#64748b60',
    emoji: '💨',
    desc: '최종 처리 결과',
    analogy: '완전히 태워진 뒤 나오는 배출물',
    science: '호기를 통해 CO₂ 배출, H₂O 소변/땀 등으로 배출',
    warning: null,
  },
]

// ── 술 대사 타임라인 ─────────────────────────────────────────
function AlcoholTimeline({ analogyMode }) {
  const [step, setStep] = useState(-1)
  const [running, setRunning] = useState(false)

  const start = () => {
    setStep(-1)
    setRunning(true)
  }

  useEffect(() => {
    if (!running) return
    if (step >= STAGES.length - 1) { setRunning(false); return }
    const t = setTimeout(() => setStep(s => s + 1), step === -1 ? 200 : 800)
    return () => clearTimeout(t)
  }, [running, step])

  const nadCount = [1, 3].filter(i => step >= i).length // stages where NAD+ is used

  return (
    <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
      <h2 className="text-blue-400 font-bold text-lg mb-1">🔬 술 대사 타임라인</h2>
      <p className="text-slate-500 text-xs mb-4">간이 에탄올을 처리하는 단계별 흐름</p>

      {/* NAD+ counter */}
      <div className="flex items-center gap-2 mb-4 text-xs">
        <span className="text-slate-400">NAD⁺ 소모:</span>
        {[0, 1].map(i => (
          <span key={i}
            className={`px-2 py-0.5 rounded-lg border font-mono font-bold transition-all duration-500 ${
              nadCount > i
                ? 'border-yellow-500 bg-yellow-950/50 text-yellow-300'
                : 'border-slate-700 text-slate-600'
            }`}>
            {nadCount > i ? 'NADH ✓' : 'NAD⁺'}
          </span>
        ))}
        {nadCount > 0 && <span className="text-yellow-400 text-[10px]">전자+수소 수거됨</span>}
      </div>

      {/* Flow */}
      <div className="flex flex-wrap gap-1 items-center justify-center mb-5">
        {STAGES.map((s, i) => {
          const active = step >= i
          const current = step === i
          return (
            <div key={s.id} className="flex items-center gap-1">
              <div
                className={`flex flex-col items-center rounded-xl border px-3 py-2 text-center transition-all duration-500 ${
                  s.isEnzyme ? 'min-w-[80px]' : 'min-w-[90px]'
                } ${active
                  ? current ? 'scale-110' : 'opacity-90'
                  : 'opacity-30 grayscale'
                }`}
                style={{
                  borderColor: active ? s.color : '#334155',
                  backgroundColor: active ? s.color + '18' : 'transparent',
                  boxShadow: current ? `0 0 16px ${s.glow}` : undefined,
                }}
              >
                <span className="text-lg mb-0.5">{s.emoji}</span>
                <div className="font-bold text-[11px] leading-tight" style={{ color: active ? s.color : '#475569' }}>
                  {s.label}
                </div>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: active ? s.color + 'cc' : '#334155' }}>
                  {s.formula}
                </div>
                {s.warning && active && (
                  <span className="text-[9px] text-red-400 mt-0.5">{s.warning}</span>
                )}
              </div>
              {i < STAGES.length - 1 && (
                <div className={`text-slate-600 text-sm transition-colors duration-500 ${active ? 'text-slate-400' : ''}`}>→</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Current stage info */}
      {step >= 0 && step < STAGES.length && (
        <div
          className="p-3 rounded-xl border text-sm transition-all duration-500 mb-4"
          style={{ borderColor: STAGES[step].color + '50', backgroundColor: STAGES[step].color + '10' }}
        >
          <div className="font-bold mb-1" style={{ color: STAGES[step].color }}>
            {STAGES[step].emoji} {STAGES[step].label} — {STAGES[step].formula}
          </div>
          <p className="text-slate-300 text-xs">
            {analogyMode ? STAGES[step].analogy : STAGES[step].science}
          </p>
          {STAGES[step].reaction && (
            <div className="mt-2 font-mono text-[11px] px-2 py-1 bg-slate-900/60 rounded text-purple-300">
              {STAGES[step].reaction}
            </div>
          )}
          {STAGES[step].cooh && (
            <div className="mt-2 text-[11px] text-green-400">
              💡 앞 모듈에서 배운 -COOH 카복실기가 여기 있어요!
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={start}
          disabled={running}
          className="flex-1 py-2.5 bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 rounded-xl font-bold text-sm transition-all"
        >
          {running ? '⏳ 대사 중...' : step >= 0 ? '🔄 다시 시작' : '▶ 대사 시작'}
        </button>
        <button
          onClick={() => { setStep(-1); setRunning(false) }}
          className="px-4 py-2 border border-slate-700 text-slate-400 rounded-xl text-sm hover:border-slate-500 hover:text-slate-200 transition-colors"
        >
          초기화
        </button>
      </div>
    </div>
  )
}

// ── NAD+ 전자 운반 게임 ──────────────────────────────────────
function NadCarrierGame() {
  const [phase, setPhase] = useState(0) // 0: idle, 1: oxidizing, 2: done
  const [step, setStep] = useState(0)   // 0,1 (두 번 산화)

  const handleOxidize = () => {
    if (phase === 2) return
    setPhase(1)
    setTimeout(() => {
      setStep(s => {
        const next = s + 1
        if (next >= 2) setPhase(2)
        else setPhase(0)
        return next
      })
    }, 900)
  }

  const reset = () => { setPhase(0); setStep(0) }

  const levels = [
    { label: '에탄올 → 아세트알데하이드', enzyme: 'ADH', eq: 'CH₃CH₂OH + NAD⁺ → CH₃CHO + NADH + H⁺' },
    { label: '아세트알데하이드 → 아세트산', enzyme: 'ALDH', eq: 'CH₃CHO + NAD⁺ + H₂O → CH₃COOH + NADH + H⁺' },
  ]

  return (
    <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
      <h2 className="text-yellow-400 font-bold text-lg mb-1">🔋 NAD⁺ 전자 운반 게임</h2>
      <p className="text-slate-400 text-xs mb-4">
        에탄올이 산화될 때마다 NAD⁺가 전자·수소를 받아 NADH가 된다.
        산화되는 쪽은 전자를 잃고, NAD⁺는 전자를 받아 NADH가 된다.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* NAD+ / NADH battery */}
        {[0, 1].map(i => {
          const charged = step > i || (phase === 1 && step === i)
          const charging = phase === 1 && step === i
          return (
            <div key={i} className={`rounded-xl border p-3 text-center transition-all duration-500 ${
              charged
                ? 'border-yellow-500/60 bg-yellow-950/30'
                : 'border-slate-700 bg-slate-900/40'
            }`}>
              <div className="text-xs text-slate-500 mb-2">반응 {i + 1}</div>
              {/* Battery icon */}
              <div className="relative w-16 h-8 mx-auto mb-2">
                <div className={`w-full h-full rounded border-2 transition-colors duration-500 ${charged ? 'border-yellow-400' : 'border-slate-600'}`} />
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-1.5 h-3 rounded-r bg-slate-600" />
                <div
                  className={`absolute top-0.5 left-0.5 bottom-0.5 rounded transition-all duration-700 ${charging ? 'animate-pulse' : ''}`}
                  style={{
                    width: charged ? 'calc(100% - 4px)' : '0%',
                    backgroundColor: charged ? '#eab308' : 'transparent',
                    boxShadow: charged ? '0 0 8px #eab308' : 'none',
                  }}
                />
              </div>
              <div className={`font-bold text-sm transition-all duration-500 ${charged ? 'text-yellow-300' : 'text-slate-500'}`}>
                {charged ? 'NADH ✓' : 'NAD⁺ (빈 배터리)'}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">{levels[i].enzyme}</div>
              {charged && (
                <div className="text-[10px] text-yellow-400 mt-1">e⁻ + H⁺ 수거 완료</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Current reaction */}
      {step < 2 && (
        <div className="mb-4 p-3 bg-slate-800/60 rounded-xl text-xs">
          <div className="text-slate-400 mb-1">다음 산화 반응:</div>
          <div className="font-mono text-purple-300">{levels[step].eq}</div>
          <div className="text-slate-500 mt-1">{levels[step].label}</div>
        </div>
      )}

      {phase === 2 ? (
        <div className="mb-4 p-3 bg-yellow-950/40 border border-yellow-700/40 rounded-xl text-sm text-yellow-300 text-center">
          🎉 NAD⁺ 2개가 NADH로 충전됐어요! 이 전자·수소는 미토콘드리아 전자전달계에서 ATP 생산에 쓰입니다.
        </div>
      ) : null}

      <div className="flex gap-3">
        <button
          onClick={handleOxidize}
          disabled={phase === 1 || step >= 2}
          className="flex-1 py-2.5 bg-yellow-800/50 border border-yellow-700 text-yellow-300 hover:bg-yellow-800/70 disabled:opacity-40 rounded-xl text-sm font-bold transition-all"
        >
          {phase === 1 ? '⚡ 산화 중...' : step >= 2 ? '완료' : `산화 반응 ${step + 1} 실행`}
        </button>
        <button onClick={reset} className="px-4 py-2 border border-slate-700 text-slate-400 rounded-xl text-sm hover:border-slate-500 hover:text-slate-200 transition-colors">
          초기화
        </button>
      </div>
    </div>
  )
}

// ── 왜 빨리 안 깨나 슬라이더 ────────────────────────────────
function HangoverSlider() {
  const [amount, setAmount]  = useState(3)   // 술 양 1-10
  const [speed, setSpeed]    = useState(5)   // 간 처리 1-10
  const [aldh, setAldh]      = useState(5)   // ALDH 활성 1-10
  const [food, setFood]      = useState(5)   // 공복=1, 식사=10
  const [sleep, setSleep]    = useState(5)   // 수면부족=1, 충분=10

  // 점수: 낮을수록 나쁨
  const ethanol = Math.round(Math.min(10, amount * 10 / speed) * 10) / 10
  const acetal  = Math.round(Math.min(10, (amount / Math.max(1, aldh)) * 6) * 10) / 10
  const hangover = Math.max(0, Math.round((ethanol * 0.4 + acetal * 0.6 - food * 0.3 - sleep * 0.2) * 10) / 10)
  const recovery = Math.max(1, Math.round(10 - speed * 0.5 - aldh * 0.3 + amount * 0.8 - food * 0.2))

  const bar = (val, max = 10, color) => (
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${(val / max) * 100}%`, backgroundColor: color }}
      />
    </div>
  )

  const SLIDERS = [
    { label: '🍺 마신 술의 양', val: amount, set: setAmount, lo: '적음', hi: '많음', color: '#3b82f6' },
    { label: '⚙️ 간 처리 속도', val: speed, set: setSpeed, lo: '느림', hi: '빠름', color: '#8b5cf6' },
    { label: '🧬 ALDH 효소 활성', val: aldh, set: setAldh, lo: '낮음', hi: '높음', color: '#a855f7' },
    { label: '🍚 공복/식사 여부', val: food, set: setFood, lo: '공복', hi: '식사 후', color: '#22c55e' },
    { label: '😴 수면 충분도', val: sleep, set: setSleep, lo: '부족', hi: '충분', color: '#06b6d4' },
  ]

  return (
    <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
      <h2 className="text-cyan-400 font-bold text-lg mb-1">🎚 왜 빨리 안 깨나요?</h2>
      <p className="text-slate-500 text-xs mb-4">⚠️ 교육용 시뮬레이션 — 실제 혈중 알코올 농도 계산이 아닙니다.</p>

      <div className="space-y-4 mb-5">
        {SLIDERS.map(s => (
          <div key={s.label}>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{s.label}</span>
              <span className="flex gap-2 text-slate-500"><span>{s.lo}</span><span>←→</span><span>{s.hi}</span></span>
            </div>
            <input
              type="range" min={1} max={10} value={s.val}
              onChange={e => s.set(Number(e.target.value))}
              className="w-full cursor-pointer"
              style={{ accentColor: s.color }}
            />
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="space-y-2">
        {[
          { label: '에탄올 부담', val: ethanol, max: 10, color: '#3b82f6', warn: ethanol > 6 },
          { label: '아세트알데하이드 누적', val: acetal, max: 10, color: '#ef4444', warn: acetal > 5 },
          { label: '숙취 위험도', val: hangover, max: 10, color: '#f97316', warn: hangover > 5 },
        ].map(item => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{item.label}</span>
              <span className={item.warn ? 'text-red-400 font-bold' : 'text-slate-400'}>
                {item.val.toFixed(1)} / 10 {item.warn ? '⚠️' : ''}
              </span>
            </div>
            {bar(item.val, 10, item.color)}
          </div>
        ))}
        <div className={`mt-3 p-3 rounded-xl text-sm text-center ${
          recovery > 7 ? 'bg-red-950/40 border border-red-700/40 text-red-300' :
          recovery > 4 ? 'bg-orange-950/40 border border-orange-700/40 text-orange-300' :
          'bg-green-950/40 border border-green-700/40 text-green-300'
        }`}>
          예상 회복 체감: <strong>
            {recovery > 7 ? '느림 🐢' : recovery > 4 ? '보통 🚶' : '비교적 빠름 🏃'}
          </strong>
          <div className="text-xs opacity-70 mt-1">간이 에탄올을 처리하는 시간은 줄일 수 없어요. 시간이 핵심입니다.</div>
        </div>
      </div>
    </div>
  )
}

// ── 취함 vs 숙취 비교 ────────────────────────────────────────
function HangoverComparison() {
  const rows = [
    { label: '주된 물질', drunk: '에탄올 (CH₃CH₂OH)', hang: '아세트알데하이드 + 염증 + 탈수 등' },
    { label: '주요 위치', drunk: '뇌', hang: '전신' },
    { label: '주요 느낌', drunk: '판단력↓ · 반응속도↓ · 말 많아짐 · 졸림', hang: '두통 · 메스꺼움 · 피로 · 갈증 · 심박↑' },
    { label: '핵심 원리', drunk: '신경 전달 균형 변화 (GABA↑, NMDA↓)', hang: '독성 중간체 + 탈수 + 수면 질 저하 + 염증' },
  ]
  return (
    <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6 overflow-x-auto">
      <h2 className="text-slate-100 font-bold text-lg mb-4">🆚 취한다 vs 숙취</h2>
      <table className="w-full text-xs border-collapse min-w-[500px]">
        <thead>
          <tr>
            <th className="text-left py-2 px-3 text-slate-500 border-b border-slate-700 w-24">항목</th>
            <th className="py-2 px-3 text-blue-400 border-b border-slate-700 text-center">취한 상태</th>
            <th className="py-2 px-3 text-orange-400 border-b border-slate-700 text-center">숙취</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.label} className="border-b border-slate-800/60">
              <td className="py-2.5 px-3 text-slate-500 font-medium">{r.label}</td>
              <td className="py-2.5 px-3 text-blue-300 text-center leading-relaxed">{r.drunk}</td>
              <td className="py-2.5 px-3 text-orange-300 text-center leading-relaxed">{r.hang}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── ALDH 정보 카드 ───────────────────────────────────────────
function AldhInfoCard({ analogyMode }) {
  return (
    <div className="bg-red-950/20 border border-red-700/40 rounded-2xl p-5 mb-6">
      <h2 className="text-red-400 font-bold text-lg mb-3">🧬 아시아인 얼굴 홍조와 ALDH</h2>
      <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
        {analogyMode ? (
          <>
            <p>😳 일부 사람들은 술을 조금만 마셔도 얼굴이 빨개지고 두근거려. 이건 주량 문제가 아니야.</p>
            <p>🧬 <strong className="text-red-300">ALDH2 효소</strong>의 활성이 유전적으로 낮은 거야. 그러면 까칠한 중간보스(아세트알데하이드)가 천천히 처리되어 몸에 쌓이는 거야.</p>
            <p>🚫 "훈련하면 강해진다"는 건 잘못된 생각이야. 효소 특성은 유전적으로 결정되어 있어서 훈련으로 바뀌지 않아.</p>
          </>
        ) : (
          <>
            <p><strong className="text-red-300">ALDH2*2 변이체</strong>: 동아시아인 약 35~40%에서 발견되는 ALDH2 유전자 변이. 효소 활성이 현저히 낮다.</p>
            <p>결과: 아세트알데하이드 축적 → 혈관 확장(얼굴 홍조), 빈맥, 메스꺼움, 두통 → 음주 후 불쾌감 강함.</p>
            <p>주의: ALDH2 변이를 가진 경우 아세트알데하이드 노출 누적으로 식도암 위험이 높아진다는 연구가 있다.</p>
          </>
        )}
        <div className="mt-3 p-3 bg-orange-950/40 border border-orange-700/40 rounded-xl text-orange-300 text-xs">
          💡 얼굴이 빨개지는 반응은 대사 효소 특성과 관련이 있으며, 훈련으로 해결되는 문제가 아닙니다.
          음주를 줄이거나 피하는 것이 건강에 좋습니다. (일반 교육 정보, 의학 진단 아님)
        </div>
      </div>
    </div>
  )
}

// ── 퀴즈 ────────────────────────────────────────────────────
const QUIZ_ITEMS = [
  { q: '술이 깨는 과정은 에탄올이 산화되는 과정이다.', a: 'O', exp: '에탄올 → 아세트알데하이드 → 아세트산 순서로 산화된다.' },
  { q: '에탄올은 간에서 바로 CO₂와 H₂O로 순간이동하듯 분해된다.', a: 'X', exp: '에탄올은 ADH(아세트알데하이드) → ALDH(아세트산) → 아세틸-CoA 순서를 거쳐 단계적으로 처리된다.' },
  { q: '아세트알데하이드는 숙취와 관련이 있다.', a: 'O', exp: '아세트알데하이드는 독성이 강한 중간체로, 얼굴 홍조·두근거림·메스꺼움 등 숙취의 주요 원인 중 하나다.' },
  { q: '아세트산 CH₃COOH에는 카복실기 -COOH가 있다.', a: 'O', exp: 'CH₃COOH의 끝 부분이 -COOH(카복실기)다. 식초의 주성분과 같은 구조.' },
  { q: 'NAD⁺는 전자와 수소를 받아 NADH가 될 수 있다.', a: 'O', exp: '에탄올 산화 반응에서 NAD⁺가 전자·수소를 수거해 NADH가 된다.' },
  { q: '얼굴이 빨개지는 사람은 술을 훈련하면 강해진다.', a: 'X', exp: 'ALDH2 효소 활성은 유전적으로 결정된다. 훈련으로 효소 활성이 바뀌지 않으며, 오히려 건강 위험이 증가할 수 있다.' },
  { q: '술을 빨리 깨게 하는 마법 같은 방법은 없다. 간 대사 시간이 필요하다.', a: 'O', exp: '간이 에탄올을 처리하는 속도는 개인차가 있지만 근본적으로 시간이 필요하다. 커피·냉수·운동은 도움이 제한적이다.' },
]

function AlcoholQuiz() {
  const [answers, setAnswers] = useState(Array(QUIZ_ITEMS.length).fill(null))
  const [revealed, setRevealed] = useState(Array(QUIZ_ITEMS.length).fill(false))

  const handle = (i, choice) => {
    if (answers[i] !== null) return
    const next = [...answers]; next[i] = choice; setAnswers(next)
    const rev = [...revealed]; rev[i] = true; setRevealed(rev)
  }

  return (
    <div className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
      <h2 className="text-yellow-400 font-bold text-lg mb-4">🧩 O/X 퀴즈</h2>
      <div className="space-y-4">
        {QUIZ_ITEMS.map((item, i) => {
          const ans = answers[i]
          const correct = ans === item.a
          return (
            <div key={i} className={`border rounded-xl p-4 transition-all ${
              ans === null ? 'border-slate-700' :
              correct ? 'border-green-600/60 bg-green-950/20' : 'border-red-600/40 bg-red-950/10'
            }`}>
              <div className="flex gap-2 mb-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <p className="text-sm text-slate-200 leading-relaxed">{item.q}</p>
              </div>
              <div className="flex gap-2">
                {['O', 'X'].map(opt => (
                  <button key={opt} onClick={() => handle(i, opt)}
                    className={`flex-1 py-2 rounded-lg font-bold text-lg border transition-all ${
                      ans === null
                        ? 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                        : opt === item.a
                          ? 'border-green-500 bg-green-900/40 text-green-300'
                          : opt === ans
                            ? 'border-red-500 bg-red-900/30 text-red-300'
                            : 'border-slate-800 text-slate-600'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
              {revealed[i] && (
                <div className={`mt-2 text-xs p-2 rounded-lg ${correct ? 'text-green-400 bg-green-950/30' : 'text-orange-300 bg-orange-950/30'}`}>
                  {correct ? '🎉 정답! ' : `💡 정답: ${item.a} — `}{item.exp}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-4 text-center text-xs text-slate-500">
        정답: {answers.filter((a, i) => a === QUIZ_ITEMS[i].a).length} / {QUIZ_ITEMS.length}
      </div>
    </div>
  )
}

// ── 메인 모듈 ────────────────────────────────────────────────
export default function Module10({ analogyMode, onNext }) {
  return (
    <ModuleLayout number={10} title="술이 취하고 깨는 화학" icon="🍺" color="blue" onNext={onNext} currentId="module10">

      {/* 핵심 개념 */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-blue-400 font-bold text-lg mb-3">📖 핵심 개념</h2>
        {analogyMode ? (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>🍺 술의 주성분은 <strong className="text-blue-300">에탄올(CH₃CH₂OH)</strong>이야. 이게 뇌에 작용해 신호 균형을 흔들면 취한 느낌이 나.</p>
            <p>⚙️ 술이 깨는 건 간이 에탄올을 하나씩 산화해서 처리하는 과정이야. 마법처럼 순간 사라지는 게 아니야!</p>
            <p>☠️ 중간에 <strong className="text-red-300">아세트알데하이드</strong>라는 독한 중간보스가 나오는데, 이게 숙취의 주요 원인 중 하나야.</p>
            <p>✅ 아세트알데하이드는 다시 <strong className="text-green-300">아세트산(CH₃COOH)</strong>으로 처리돼. 여기 -COOH 카복실기가 있어!</p>
            <p>🔋 이 과정에서 <strong className="text-yellow-300">NAD⁺가 전자·수소를 수거해 NADH</strong>가 돼. 배터리 충전이랑 비슷해.</p>
          </div>
        ) : (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p><strong className="text-blue-300">에탄올</strong>: GABA-A 수용체 양성 조절, NMDA 수용체 억제로 중추신경 억제 효과 발휘.</p>
            <p><strong className="text-red-300">1단계 (ADH)</strong>: CH₃CH₂OH + NAD⁺ → CH₃CHO + NADH + H⁺. 에탄올 산화, 아세트알데하이드 생성.</p>
            <p><strong className="text-red-300">아세트알데하이드</strong>: 단백질·DNA와 공유 부가물 형성. 혈관 확장, 미토콘드리아 손상, 염증 유발.</p>
            <p><strong className="text-green-300">2단계 (ALDH)</strong>: CH₃CHO + NAD⁺ + H₂O → CH₃COOH + NADH + H⁺. 아세트산 생성.</p>
            <p><strong className="text-yellow-300">3단계</strong>: 아세트산 → 아세틸-CoA → TCA 회로 → CO₂ + H₂O + ATP.</p>
          </div>
        )}
      </section>

      {/* 대사 타임라인 */}
      <AlcoholTimeline analogyMode={analogyMode} />

      {/* NAD+ 게임 */}
      <NadCarrierGame />

      {/* 슬라이더 */}
      <HangoverSlider />

      {/* 취함 vs 숙취 */}
      <HangoverComparison />

      {/* ALDH 카드 */}
      <AldhInfoCard analogyMode={analogyMode} />

      {/* 퀴즈 */}
      <AlcoholQuiz />

      {/* 핵심 정리 */}
      <div
        className="rounded-2xl p-5 border mb-2"
        style={{
          background: 'linear-gradient(135deg, #0c1a2e 0%, #0f172a 50%, #1a0a00 100%)',
          borderColor: '#3b82f660',
          boxShadow: '0 0 20px #3b82f620',
        }}
      >
        <h3 className="text-blue-400 font-bold text-base mb-3">📌 핵심 정리</h3>
        <div className="text-sm text-slate-300 leading-relaxed space-y-1">
          <p>술이 취하는 것은 <strong className="text-blue-300">에탄올</strong>이 뇌 신호를 흔드는 현상이고,</p>
          <p>술이 깨는 것은 간이 에탄올을 산화해
            <strong className="text-red-300"> 아세트알데하이드</strong>,
            <strong className="text-green-300"> 아세트산</strong>을 거쳐 처리하는 과정이다.</p>
          <p>이때 <strong className="text-yellow-300">NAD⁺가 전자와 수소를 받아 NADH</strong>가 되며,</p>
          <p>아세트산 <span className="font-mono text-green-300">CH₃COOH</span>는 앞에서 배운 <strong className="text-green-300">-COOH 카복실기</strong>를 가진다.</p>
        </div>
      </div>
    </ModuleLayout>
  )
}
