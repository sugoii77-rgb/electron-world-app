import { useState, useMemo } from 'react'

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

export default function SaltHumiditySimulator({ analogyMode }) {
  const [humidity, setHumidity] = useState(40)
  const [salinity, setSalinity] = useState(10)
  const [temp, setTemp] = useState(1) // 0=낮음 1=보통 2=높음

  const tempMult = [0.6, 1.0, 1.4][temp]

  const waterFilm   = clamp(humidity * 0.9,  0, 100)
  const electrolyte = clamp((humidity * 0.5 + salinity * 0.5) * tempMult, 0, 100)
  const corrRate    = clamp(((humidity * 0.4 + salinity * 0.4 + (humidity > 60 ? 20 : 0)) * tempMult), 0, 100)
  const pittingRisk = clamp((salinity * 0.7 + (humidity > 70 ? 20 : 0)) * (temp === 2 ? 1.3 : 1), 0, 100)

  const clIons = Math.round(salinity / 100 * 18)

  const gauge = (val, color, label, warn) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={val > 60 && warn ? 'text-red-400 font-bold' : 'text-slate-300'}>{Math.round(val)}% {val > 60 && warn ? '⚠️' : ''}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${val}%`, backgroundColor: color, boxShadow: val > 60 && warn ? `0 0 8px ${color}` : 'none' }} />
      </div>
    </div>
  )

  const riskLevel = corrRate < 30 ? { label: '낮음 ✅', color: '#22c55e', bg: '#052e16' }
    : corrRate < 60 ? { label: '중간 ⚠️', color: '#f59e0b', bg: '#451a03' }
    : { label: '높음 ☠️', color: '#ef4444', bg: '#450a0a' }

  return (
    <div className="space-y-5">
      <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
        <h2 className="text-blue-400 font-bold text-lg mb-1">💧 환경 가속 부식 시뮬레이터</h2>
        <p className="text-slate-400 text-xs mb-5">
          {analogyMode
            ? '습기는 전기가 흐르는 얇은 물길을 만들고, 소금은 그 물길을 더 잘 통하게 만드는 부스터야. 게다가 Cl⁻는 보호막을 찢는 말썽꾸러기!'
            : '습윤 상태는 전해질층을 형성해 전기화학 반응을 가속한다. NaCl 용해로 생성된 이온은 전도성을 높이고, Cl⁻는 수동피막 손상 및 국부 부식을 촉진할 수 있다.'}
        </p>

        {/* Visual: Iron surface */}
        <div className="relative rounded-xl border border-slate-700/50 overflow-hidden mb-5" style={{ height: 130 }}>
          {/* Iron base */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 45, backgroundColor: '#374151' }}>
            <div className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-500 font-bold">철 표면 (Fe)</div>
            {/* Pitting spots */}
            {pittingRisk > 40 && [15, 38, 62, 80].filter((_, i) => i < Math.floor(pittingRisk / 25)).map((x, i) => (
              <div key={i} className="absolute w-2.5 h-2.5 rounded-full border-2 border-red-500/80"
                style={{ left: `${x}%`, top: 2, backgroundColor: '#7f1d1d', boxShadow: '0 0 6px #ef4444' }} />
            ))}
          </div>

          {/* Water film */}
          <div className="absolute bottom-11 left-0 right-0 transition-all duration-700"
            style={{ height: Math.max(2, waterFilm * 0.4), background: 'rgba(59,130,246,0.25)', borderTop: '1px solid rgba(59,130,246,0.4)' }}>
          </div>

          {/* Electrolyte layer label */}
          {humidity > 20 && (
            <div className="absolute text-[10px] text-blue-400/70" style={{ bottom: 50, left: 8 }}>
              물막 (전해질)
            </div>
          )}

          {/* Cl- ions */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: clIons }).map((_, i) => (
              <div key={i} className="absolute text-[10px] text-yellow-400/80 font-bold"
                style={{ left: `${(i * 67 + 5) % 90}%`, top: `${10 + (i * 43) % 55}%`, opacity: salinity > 5 ? 0.9 : 0 }}>
                Cl⁻
              </div>
            ))}
          </div>

          {/* Temperature label */}
          <div className="absolute top-2 right-3 text-[10px] text-slate-500">
            🌡 {['낮음','보통','높음'][temp]}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4 mb-5">
          {[
            { label: '💧 습도', val: humidity, set: setHumidity, lo: '0%', hi: '100%', color: '#3b82f6' },
            { label: '🧂 염분 농도 (NaCl)', val: salinity, set: setSalinity, lo: '0%', hi: '100%', color: '#eab308' },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{s.label}</span>
                <span className="text-slate-300">{s.val}%</span>
              </div>
              <input type="range" min={0} max={100} value={s.val} onChange={e => s.set(Number(e.target.value))}
                className="w-full cursor-pointer" style={{ accentColor: s.color }} />
            </div>
          ))}

          {/* Temperature selector */}
          <div>
            <div className="text-xs text-slate-400 mb-2">🌡 온도</div>
            <div className="flex gap-2">
              {['낮음 (5°C)', '보통 (20°C)', '높음 (40°C)'].map((t, i) => (
                <button key={i} onClick={() => setTemp(i)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs transition-all ${temp === i ? 'border-orange-500 bg-orange-950/40 text-orange-300' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gauges */}
        <div className="space-y-3 mb-4">
          {gauge(waterFilm,   '#3b82f6', '💧 물막 형성 정도',   false)}
          {gauge(electrolyte, '#8b5cf6', '⚡ 전해질 강도',      true)}
          {gauge(corrRate,    '#f97316', '🔥 부식 속도',        true)}
          {gauge(pittingRisk, '#ef4444', '🎯 국부(점)부식 위험',true)}
        </div>

        {/* Risk summary */}
        <div className="p-3 rounded-xl border text-sm text-center transition-all"
          style={{ borderColor: riskLevel.color + '60', backgroundColor: riskLevel.bg }}>
          <span className="font-bold" style={{ color: riskLevel.color }}>종합 부식 위험: {riskLevel.label}</span>
          {salinity > 50 && (
            <div className="text-xs text-yellow-400 mt-1">
              ⚠️ 고염분 → Cl⁻ 농도 높음 → 수동피막 손상 및 점부식 위험 증가
            </div>
          )}
          {humidity > 80 && salinity > 30 && (
            <div className="text-xs text-red-400 mt-1">
              ☠️ 고습 + 고염 조합 = 가장 가혹한 부식 환경 (해안, 선박 등)
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {[
            { icon: '💧', title: '물의 역할', body: '이온이 이동하는 전해질 역할. 습도 60% 이상이면 얇은 물막 형성으로 반응 크게 가속.' },
            { icon: '🧂', title: 'NaCl의 역할', body: 'Na⁺, Cl⁻로 해리해 전도성 ↑. 특히 Cl⁻가 Fe 표면 산화막/수동피막을 손상시킬 수 있다.' },
            { icon: '🎯', title: '국부(점)부식', body: '보호막이 부분적으로 뚫리면 그 부위만 집중적으로 깊이 파고드는 pitting 부식 발생.' },
          ].map(c => (
            <div key={c.title} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-2.5">
              <div className="font-bold text-slate-300 mb-1">{c.icon} {c.title}</div>
              <div className="text-slate-500 leading-relaxed">{c.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
