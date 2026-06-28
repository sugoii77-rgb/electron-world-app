import { useState } from 'react'

const EVENTS = [
  { id: 'humid',   label: '💧 습기 노출', icon: '💧' },
  { id: 'scratch', label: '✂️ 스크래치',  icon: '✂️' },
  { id: 'salt',    label: '🧂 염수 노출', icon: '🧂' },
  { id: 'no_o2',   label: '🚫 산소 차단', icon: '🚫' },
]

// [mildRustPct, mildMessage, ssFilmDmg, ssMessage, ssRecovery]
const STATE = {
  idle:    { rust: 0,  mildMsg: '표면 정상',           filmDmg: false, ssMsg: '수동피막 양호',      recover: false },
  humid:   { rust: 15, mildMsg: '표면에 녹 시작 ⚠️',   filmDmg: false, ssMsg: '피막 유지 (양호)',   recover: false },
  scratch: { rust: 40, mildMsg: '스크래치 → 녹 빠르게 퍼짐 ⚠️', filmDmg: true,  ssMsg: '피막 일시 손상', recover: true  },
  salt:    { rust: 65, mildMsg: '염분 + 습기 → 빠른 부식 ☠️',   filmDmg: true,  ssMsg: '피막 부분 손상 (점부식 위험)', recover: false },
  no_o2:   { rust: 20, mildMsg: '산소 차단 → 다소 느려짐',       filmDmg: true,  ssMsg: '⚠️ 산소 없으면 재피막화 어려움', recover: false },
}

const TABLE_ROWS = [
  { label: '주요 조성',       mild: 'Fe + 소량 C (Cr ≈ 0%)',  ss: 'Fe + Cr ≥ 10.5%' },
  { label: '보호막',          mild: '산화철 (Fe₂O₃) – 불안정', ss: 'Cr₂O₃ 수동피막 – 치밀함' },
  { label: '습기 저항',       mild: '낮음 ✘',                  ss: '높음 ✔' },
  { label: '염분 민감도',     mild: '매우 높음 ✘',             ss: '중간 (등급에 따라 다름)' },
  { label: '스크래치 후 회복',mild: '없음 – 계속 녹 진행',     ss: '산소 있으면 재피막화 가능' },
  { label: '대표 부식 형태',  mild: '균일부식, 광범위한 녹',   ss: '점부식, 틈부식 (염화물 환경)' },
]

export default function SteelComparison({ analogyMode }) {
  const [event, setEvent] = useState('idle')
  const s = STATE[event]

  return (
    <div className="space-y-5">
      <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
        <h2 className="text-slate-100 font-bold text-lg mb-1">🔬 일반강 vs 스테인리스</h2>
        <p className="text-slate-400 text-xs mb-5">
          {analogyMode
            ? '스테인리스는 "절대 안 녹는 금속"이 아냐. 크롬(Cr)이 만들어 주는 아주 얇은 보호막 덕분에 훨씬 잘 버티는 거야. 그 막이 찢어지면 문제가 생길 수 있어!'
            : '스테인리스강은 Cr ≥ 10.5% 첨가로 표면에 수 nm 두께의 Cr₂O₃ 수동피막이 자연 형성된다. 이 피막이 손상돼도 산소가 있으면 재생(repassivation)이 가능하다.'}
        </p>

        {/* Event buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setEvent('idle')}
            className={`px-3 py-1.5 rounded-xl border text-xs transition-all ${event === 'idle' ? 'border-slate-400 bg-slate-700 text-white' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}>
            🔄 초기화
          </button>
          {EVENTS.map(ev => (
            <button key={ev.id} onClick={() => setEvent(ev.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs transition-all ${event === ev.id ? 'border-blue-500 bg-blue-950/40 text-blue-300' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}>
              {ev.label}
            </button>
          ))}
        </div>

        {/* Side by side */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Mild steel */}
          <div className="rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="bg-slate-800/60 px-3 py-2 text-xs font-bold text-slate-300 border-b border-slate-700/50">
              🔩 일반강 (Mild Steel)
            </div>
            <div className="relative" style={{ height: 110 }}>
              {/* Iron base */}
              <div className="absolute bottom-0 inset-x-0 flex items-center justify-center text-[10px] text-slate-500"
                style={{ height: 50, backgroundColor: '#374151' }}>
                Fe (표면)
              </div>
              {/* Rust layer */}
              <div className="absolute bottom-0 inset-x-0 transition-all duration-700 flex items-center justify-center"
                style={{ height: s.rust * 0.5, background: 'linear-gradient(180deg, #92400e, #b45309)', boxShadow: s.rust > 0 ? '0 -2px 8px #b4530950' : 'none' }}>
                {s.rust > 20 && <span className="text-[9px] text-orange-200">녹 (Fe₂O₃·xH₂O)</span>}
              </div>
              {/* Crack visual when scratched */}
              {event === 'scratch' && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute" style={{ left: '45%', top: 0, width: 2, height: '65%', background: 'linear-gradient(180deg,#1e293b,#b45309)', transform: 'rotate(3deg)' }} />
                </div>
              )}
            </div>
            <div className={`px-3 py-2 text-[11px] transition-all ${s.rust > 30 ? 'bg-red-950/40 text-red-300' : s.rust > 0 ? 'bg-orange-950/30 text-orange-300' : 'bg-slate-800/40 text-slate-400'}`}>
              {s.mildMsg} • 녹 {s.rust}%
            </div>
          </div>

          {/* Stainless steel */}
          <div className="rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="bg-slate-800/60 px-3 py-2 text-xs font-bold text-cyan-300 border-b border-slate-700/50">
              ✨ 스테인리스
            </div>
            <div className="relative" style={{ height: 110 }}>
              {/* SS base */}
              <div className="absolute bottom-0 inset-x-0 flex items-center justify-center text-[10px] text-slate-400"
                style={{ height: 50, backgroundColor: '#1e3a5f' }}>
                Fe + Cr (표면)
              </div>
              {/* Passive film */}
              <div className="absolute bottom-12 inset-x-0 transition-all duration-700"
                style={{ height: 6, background: s.filmDmg ? (s.recover ? 'linear-gradient(90deg,#166534,#22d3ee,#166534)' : 'linear-gradient(90deg,#166534,#dc2626,#166534)') : 'linear-gradient(90deg,#22d3ee80,#06b6d480,#22d3ee80)', boxShadow: s.filmDmg ? undefined : '0 0 8px #22d3ee60' }}>
              </div>
              {/* Film label */}
              <div className="absolute text-[9px] transition-all duration-500"
                style={{ bottom: 60, left: 8, color: s.filmDmg ? (s.recover ? '#22c55e' : '#f97316') : '#22d3ee' }}>
                Cr₂O₃ 피막{s.filmDmg ? (s.recover ? ' → 재생 중 ✓' : ' → 손상 ⚠') : ' (수동피막)'}
              </div>
              {/* Pitting for salt */}
              {event === 'salt' && [25, 55, 75].map((x, i) => (
                <div key={i} className="absolute w-2 h-2 rounded-full border border-red-500"
                  style={{ left: `${x}%`, bottom: 55, backgroundColor: '#7f1d1d30' }} />
              ))}
            </div>
            <div className={`px-3 py-2 text-[11px] transition-all ${s.filmDmg ? (s.recover ? 'bg-green-950/30 text-green-300' : 'bg-orange-950/30 text-orange-300') : 'bg-cyan-950/30 text-cyan-300'}`}>
              {s.ssMsg}
            </div>
          </div>
        </div>

        {/* Compare table */}
        <div className="overflow-x-auto rounded-xl border border-slate-700/40">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-2 px-3 text-slate-500 w-28">항목</th>
                <th className="py-2 px-3 text-slate-300 text-center">일반강</th>
                <th className="py-2 px-3 text-cyan-400 text-center">스테인리스</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(r => (
                <tr key={r.label} className="border-b border-slate-800/50">
                  <td className="py-2 px-3 text-slate-500">{r.label}</td>
                  <td className="py-2 px-3 text-slate-400 text-center leading-relaxed">{r.mild}</td>
                  <td className="py-2 px-3 text-cyan-300 text-center leading-relaxed">{r.ss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-300">
          💡 핵심: 스테인리스는 '절대 녹 안 스는 금속'이 아니라, <strong>크롬이 만든 아주 얇은 Cr₂O₃ 보호피막 덕분에 훨씬 잘 버티는 금속</strong>이다.
          Cl⁻ 등 공격적 이온 환경에서는 피팅(점부식)이 생길 수 있다.
        </div>
      </div>
    </div>
  )
}
