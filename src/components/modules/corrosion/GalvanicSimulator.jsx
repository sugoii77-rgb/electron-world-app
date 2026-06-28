import { useState } from 'react'

// Simplified galvanic series (standard electrode potential, V vs SHE, approximate)
const METALS = {
  zinc:          { label: '아연 (Zn)',             potential: -0.76, color: '#94a3b8', bg: '#0f172a' },
  aluminum:      { label: '알루미늄 (Al)',          potential: -0.68, color: '#cbd5e1', bg: '#0f172a' },
  mild_steel:    { label: '일반강 (Mild Steel)',    potential: -0.44, color: '#6b7280', bg: '#111827' },
  stainless_316: { label: '스테인리스 316',         potential:  0.10, color: '#22d3ee', bg: '#0c1a2e' },
  copper:        { label: '구리 (Cu)',              potential:  0.34, color: '#f97316', bg: '#1c0a00' },
  titanium:      { label: '티타늄 (Ti)',            potential:  0.10, color: '#a78bfa', bg: '#150f2b' },
  gold:          { label: '금 (Au)',               potential:  1.50, color: '#fbbf24', bg: '#1c1500' },
}

const ENVS = {
  dry:    { label: '건조 🌵',  mult: 0.0, desc: '전해질 없음 → 갈바닉 부식 거의 없음' },
  humid:  { label: '습윤 💧',  mult: 0.5, desc: '얇은 물막이 전해질 역할 → 갈바닉 반응 시작' },
  saline: { label: '염수 🧂',  mult: 1.0, desc: '강력한 전해질 → 갈바닉 부식 크게 가속' },
}

const RISK = [
  { min: 0,    label: '없음',  color: '#22c55e', bg: '#052e16' },
  { min: 0.01, label: '낮음',  color: '#84cc16', bg: '#1a2e05' },
  { min: 0.2,  label: '중간',  color: '#f59e0b', bg: '#451a03' },
  { min: 0.5,  label: '높음',  color: '#ef4444', bg: '#450a0a' },
  { min: 1.0,  label: '매우 높음', color: '#dc2626', bg: '#7f1d1d' },
]

function getRisk(potDiff, envMult) {
  const val = potDiff * envMult
  return [...RISK].reverse().find(r => val >= r.min) || RISK[0]
}

export default function GalvanicSimulator({ analogyMode }) {
  const [metalA, setMetalA] = useState('mild_steel')
  const [metalB, setMetalB] = useState('copper')
  const [env, setEnv]       = useState('humid')
  const [anim, setAnim]     = useState(false)

  const A = METALS[metalA]
  const B = METALS[metalB]
  const potDiff = Math.abs(A.potential - B.potential)
  const envData = ENVS[env]
  const risk    = getRisk(potDiff, envData.mult)

  // Lower potential = anode (oxidizes faster)
  const anodeKey   = A.potential <= B.potential ? metalA : metalB
  const cathodeKey = A.potential <= B.potential ? metalB : metalA
  const anode   = METALS[anodeKey]
  const cathode = METALS[cathodeKey]

  const same = metalA === metalB

  return (
    <div className="space-y-5">
      <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
        <h2 className="text-purple-400 font-bold text-lg mb-1">⚡ 갈바닉 부식 시뮬레이터</h2>
        <p className="text-slate-400 text-xs mb-5">
          {analogyMode
            ? '서로 다른 두 금속이 물속에서 전기 게임을 하면 "활성적인" 금속이 먼저 희생된다. 덜 귀한 금속이 양극이 돼서 더 빨리 녹아버리는 것!'
            : '이종 금속 접촉 + 전해질 + 전위차 → 갈바닉 전지 형성. 더 활성인(전위가 낮은) 금속이 양극이 되어 산화가 촉진된다.'}
        </p>

        {/* Metal selectors */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { key: 'A', val: metalA, set: setMetalA, label: '금속 A' },
            { key: 'B', val: metalB, set: setMetalB, label: '금속 B' },
          ].map(sel => (
            <div key={sel.key}>
              <div className="text-xs text-slate-400 mb-1">{sel.label}</div>
              <select value={sel.val} onChange={e => { sel.set(e.target.value); setAnim(false) }}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-sm cursor-pointer">
                {Object.entries(METALS).map(([k, m]) => (
                  <option key={k} value={k}>{m.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Environment */}
        <div className="mb-5">
          <div className="text-xs text-slate-400 mb-2">환경 선택</div>
          <div className="flex gap-2">
            {Object.entries(ENVS).map(([k, v]) => (
              <button key={k} onClick={() => { setEnv(k); setAnim(false) }}
                className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${env === k ? 'border-blue-500 bg-blue-950/40 text-blue-300' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative rounded-xl border border-slate-700/50 overflow-hidden mb-4" style={{ height: 150 }}>
          {/* Electrolyte */}
          <div className="absolute inset-0 transition-all duration-500"
            style={{ background: env === 'dry' ? '#0a0a1a' : env === 'saline' ? 'rgba(20,40,80,0.9)' : 'rgba(15,40,70,0.7)' }}>
            {env !== 'dry' && <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-blue-400/50">{env === 'saline' ? '염수 (강한 전해질)' : '습윤 환경 (전해질)'}</div>}
          </div>

          {/* Metal A block */}
          <div className="absolute left-4 bottom-4 w-28 h-20 rounded-lg flex flex-col items-center justify-center border-2 transition-all duration-500"
            style={{ borderColor: !same && anodeKey === metalA ? '#ef4444' : A.color, backgroundColor: A.bg,
              boxShadow: !same && anodeKey === metalA && env !== 'dry' ? '0 0 16px #ef444460' : `0 0 8px ${A.color}30` }}>
            <div className="text-base font-bold" style={{ color: A.color }}>{A.label.split('(')[0].trim()}</div>
            <div className="text-[10px] mt-1" style={{ color: !same && anodeKey === metalA ? '#ef4444' : '#94a3b8' }}>
              {same ? '─' : anodeKey === metalA ? '⚠️ 양극 (산화)' : '✅ 음극 (보호)'}
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">{A.potential.toFixed(2)} V</div>
          </div>

          {/* Metal B block */}
          <div className="absolute right-4 bottom-4 w-28 h-20 rounded-lg flex flex-col items-center justify-center border-2 transition-all duration-500"
            style={{ borderColor: !same && cathodeKey === metalB ? '#22c55e' : B.color, backgroundColor: B.bg,
              boxShadow: !same && cathodeKey === metalB && env !== 'dry' ? '0 0 16px #22c55e40' : `0 0 8px ${B.color}30` }}>
            <div className="text-base font-bold" style={{ color: B.color }}>{B.label.split('(')[0].trim()}</div>
            <div className="text-[10px] mt-1" style={{ color: !same && cathodeKey === metalB ? '#22c55e' : '#94a3b8' }}>
              {same ? '─' : cathodeKey === metalB ? '✅ 음극 (보호)' : '⚠️ 양극 (산화)'}
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">{B.potential.toFixed(2)} V</div>
          </div>

          {/* Electron flow arrow */}
          {!same && env !== 'dry' && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-14 flex flex-col items-center">
              <div className="text-[9px] text-cyan-400 mb-0.5">e⁻ 이동 방향</div>
              <div className="flex items-center gap-1">
                <div className="w-16 h-0.5 bg-cyan-500 relative overflow-hidden" style={{ boxShadow: '0 0 6px #22d3ee' }}>
                  <div className="absolute inset-0 animate-electron-flow-r" style={{ background: 'linear-gradient(to right, transparent, #22d3ee, transparent)', width: '50%' }} />
                </div>
                <div className="text-cyan-400 text-xs">→</div>
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">금속 내부 경로</div>
            </div>
          )}

          {/* Ion flow in electrolyte */}
          {!same && env !== 'dry' && (
            <div className="absolute left-1/2 -translate-x-1/2 top-3 text-[9px] text-purple-400/70">이온 이동 (전해질 내)</div>
          )}
        </div>

        {/* Result */}
        {same ? (
          <div className="p-3 rounded-xl border border-slate-700 text-xs text-slate-400 text-center">
            같은 금속 → 전위차 없음 → 갈바닉 부식 없음
          </div>
        ) : (
          <div className="space-y-2">
            <div className="p-3 rounded-xl border text-sm" style={{ borderColor: risk.color + '50', backgroundColor: risk.bg }}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold" style={{ color: risk.color }}>갈바닉 부식 위험: {risk.label}</span>
                <span className="text-xs text-slate-400">전위차 {potDiff.toFixed(2)} V</span>
              </div>
              <div className="text-xs text-slate-400">{envData.desc}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-red-950/30 border border-red-800/40 rounded-xl">
                <div className="text-red-400 font-bold mb-1">⚠️ 양극 (더 빨리 부식)</div>
                <div style={{ color: anode.color }}>{anode.label}</div>
                <div className="text-slate-500 mt-0.5">전위: {anode.potential.toFixed(2)} V (더 낮음)</div>
                <div className="text-red-300 mt-1">Fe → Fe²⁺ + 2e⁻ 반응 가속</div>
              </div>
              <div className="p-2.5 bg-green-950/30 border border-green-800/40 rounded-xl">
                <div className="text-green-400 font-bold mb-1">✅ 음극 (보호됨)</div>
                <div style={{ color: cathode.color }}>{cathode.label}</div>
                <div className="text-slate-500 mt-0.5">전위: {cathode.potential.toFixed(2)} V (더 높음)</div>
                <div className="text-green-300 mt-1">상대적으로 산화 억제</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl text-xs text-purple-300 space-y-1">
          <div className="font-bold">💡 설계 주의점</div>
          <div>• 아연 + 철: 아연이 희생양극 → 철 보호 (이 원리로 도금·희생방식 활용)</div>
          <div>• 구리 + 철: 철이 양극 → 철 가속 부식 (작은 철 + 큰 구리 조합 특히 위험)</div>
          <div>• 작은 양극 + 큰 음극 = 전류 집중 → 국부 부식 빠름</div>
        </div>
      </div>
    </div>
  )
}
