import { useState } from 'react'

const ENTANGLE_MODES = [
  { id: 'same',  label: '같은 결과 모드', desc: '지구=0이면 달=0, 지구=1이면 달=1' },
  { id: 'opp',   label: '반대 결과 모드', desc: '지구=0이면 달=1, 지구=1이면 달=0' },
]

function SpinCoin({ label, value, spinning, color }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="relative w-24 h-24">
        <div className="w-full h-full rounded-full border-4 flex items-center justify-center transition-all duration-500"
          style={{
            borderColor: color,
            boxShadow: `0 0 20px ${color}60`,
            background: value !== null
              ? `radial-gradient(circle, ${color}30, ${color}08)`
              : 'radial-gradient(circle, #1e1b4b, #0f0a2a)',
            animation: spinning ? 'spin-slow 1.5s linear infinite' : 'none',
          }}>
          {value !== null ? (
            <div className="text-4xl font-black" style={{ color }}>{value}</div>
          ) : (
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-purple-300 opacity-50">0</div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-cyan-300 opacity-50"
                style={{ animation: 'flicker 1.2s ease-in-out infinite alternate' }}>1</div>
            </div>
          )}
        </div>
      </div>
      <div className="text-[11px] font-medium" style={{ color: value !== null ? color : '#64748b' }}>
        {value !== null ? `결과: ${value}` : '중첩 상태'}
      </div>
    </div>
  )
}

export default function EntanglementSection({ analogyMode }) {
  const [entangled, setEntangled] = useState(false)
  const [mode, setMode]   = useState('same')
  const [earthVal, setEarthVal] = useState(null)
  const [moonVal,  setMoonVal]  = useState(null)
  const [history, setHistory]   = useState([])
  const [flash, setFlash] = useState(false)

  const entangle = () => {
    setEntangled(true)
    setEarthVal(null)
    setMoonVal(null)
  }

  const measureSide = (side) => {
    if (!entangled) return
    if (earthVal !== null && moonVal !== null) return

    let eVal, mVal
    if (side === 'earth') {
      eVal = Math.random() < 0.5 ? 0 : 1
      mVal = mode === 'same' ? eVal : (1 - eVal)
    } else {
      mVal = Math.random() < 0.5 ? 0 : 1
      eVal = mode === 'same' ? mVal : (1 - mVal)
    }

    setEarthVal(eVal)
    setMoonVal(mVal)
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    setHistory(h => [...h, { e: eVal, m: mVal }].slice(-8))
  }

  const reset = () => {
    setEntangled(false)
    setEarthVal(null)
    setMoonVal(null)
  }

  return (
    <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
      <h2 className="text-pink-400 font-bold text-lg mb-1">🔗 양자 얽힘</h2>
      <p className="text-slate-400 text-xs mb-1">
        {analogyMode
          ? '두 동전이 아주 멀리 떨어져 있어도, 한쪽을 확인하면 다른 쪽 결과와 강하게 맞물려 있다는 사실이 드러나. 신기하지만 이게 양자 얽힘이야!'
          : '얽힌 상태는 개별 입자의 상태만으로는 완전히 설명되지 않고, 두 입자의 결합 상태 전체로 설명된다. (예: 벨 상태 |Φ⁺⟩ = (|00⟩+|11⟩)/√2)'}
      </p>
      <div className="text-[10px] text-yellow-600 mb-4">
        ⚠️ 얽힘은 멀리 있는 입자 사이의 상관관계를 보여주지만, 이것만으로 의미 있는 정보를 빛보다 빠르게 보내는 것은 아니다.
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-5">
        {ENTANGLE_MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`flex-1 py-2 rounded-xl border text-xs transition-all ${mode === m.id ? 'border-pink-500/70 bg-pink-950/30 text-pink-300' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}>
            <div className="font-bold">{m.label}</div>
            <div className="text-[10px] opacity-70 mt-0.5">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Two particles visual */}
      <div className="relative flex items-center justify-between mb-5 px-4">
        <SpinCoin label="🌍 지구" value={earthVal} spinning={entangled && earthVal === null} color="#22d3ee" />

        {/* Connection line */}
        <div className="flex-1 flex flex-col items-center gap-1 px-2">
          <div className="relative w-full h-1 rounded-full overflow-hidden"
            style={{ background: entangled ? '#ec4899' : '#1e293b', boxShadow: entangled ? '0 0 8px #ec489950' : 'none', transition: 'all 0.5s' }}>
            {entangled && (
              <div className="absolute inset-0 animate-electron-flow-r"
                style={{ background: 'linear-gradient(to right, transparent, #f9a8d4, transparent)', width: '40%' }} />
            )}
          </div>
          {flash && (
            <div className="text-[10px] text-pink-400 font-bold animate-pulse">⚡ 상관관계 확정!</div>
          )}
          {entangled && !flash && (
            <div className="text-[10px] text-pink-400/50">얽힘 연결 중</div>
          )}
        </div>

        <SpinCoin label="🌙 달" value={moonVal} spinning={entangled && moonVal === null} color="#a78bfa" />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button onClick={entangle}
          className="px-4 py-2.5 rounded-xl border border-pink-500/60 bg-pink-950/20 text-pink-300 text-sm font-bold hover:border-pink-400 transition-all">
          🔗 얽힌 쌍 만들기
        </button>
        <button onClick={() => measureSide('earth')} disabled={!entangled || earthVal !== null}
          className="px-4 py-2.5 rounded-xl border border-cyan-500/60 bg-cyan-950/20 text-cyan-300 text-sm font-bold hover:border-cyan-400 transition-all disabled:opacity-30">
          🌍 지구 쪽 측정
        </button>
        <button onClick={() => measureSide('moon')} disabled={!entangled || moonVal !== null}
          className="px-4 py-2.5 rounded-xl border border-purple-500/60 bg-purple-950/20 text-purple-300 text-sm font-bold hover:border-purple-400 transition-all disabled:opacity-30">
          🌙 달 쪽 측정
        </button>
        <button onClick={reset}
          className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:border-slate-500 transition-all">
          초기화
        </button>
      </div>

      {/* Result message */}
      {earthVal !== null && moonVal !== null && (
        <div className="mb-4 p-3 rounded-xl border border-pink-700/40 bg-pink-950/20 text-sm text-pink-300 text-center">
          🌍 지구: <strong>{earthVal}</strong> &nbsp;|&nbsp; 🌙 달: <strong>{moonVal}</strong>
          &nbsp;— 각 결과는 랜덤처럼 보이지만, 두 결과 사이에는 강한 상관관계가 있어!
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] text-slate-500 mb-1">측정 기록</div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-[10px]">
                <span className="text-cyan-400">🌍{h.e}</span>
                <span className="text-slate-600">·</span>
                <span className="text-purple-400">🌙{h.m}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key insight */}
      <div className="p-3 bg-pink-950/20 border border-pink-700/30 rounded-xl text-xs text-slate-300 leading-relaxed">
        <div className="text-pink-300 font-bold mb-1">🔑 얽힘의 핵심</div>
        개별 측정 결과는 예측 불가능하게 랜덤하다. 하지만 두 결과의 상관관계는 어떤 거리에 있어도 유지된다.
        이 상관관계는 두 입자가 사전에 결과를 "합의"해 놓은 것으로는 설명이 안 된다는 것이 벨 부등식 실험으로 검증됐다.
        그러나 얽힘만으로는 정보를 빛보다 빠르게 전송할 수 없다 — 상관관계를 확인하려면 고전 통신이 필요하기 때문이다.
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes flicker { 0% { opacity: 0.2; } 100% { opacity: 0.9; } }
      `}</style>
    </div>
  )
}
