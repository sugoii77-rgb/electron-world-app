import { useState } from 'react'

const LEVELS = [
  { n: 1, r: 50,  label: 'n=1 기저 상태',     color: '#22d3ee', energy: '-13.6 eV' },
  { n: 2, r: 85,  label: 'n=2 1차 들뜬 상태', color: '#a78bfa', energy: '-3.4 eV'  },
  { n: 3, r: 120, label: 'n=3 2차 들뜬 상태', color: '#f472b6', energy: '-1.5 eV'  },
]

const PHOTONS = [
  { id: 'blue',   label: '🔵 파란빛 흡수', jump:  1, color: '#3b82f6', desc: '에너지 작음 (n+1 이동)' },
  { id: 'violet', label: '🟣 보라빛 흡수', jump:  2, color: '#8b5cf6', desc: '에너지 큼 (n+2 이동)'   },
  { id: 'emit',   label: '✨ 빛 방출',      jump: -1, color: '#fbbf24', desc: '에너지 방출 (n-1 이동)' },
]

export default function BohrSection({ analogyMode }) {
  const [level,   setLevel]   = useState(1)
  const [message, setMessage] = useState('')
  const [msgType, setMsgType] = useState('info')
  const [photon,  setPhoton]  = useState(null)

  const doAction = (action) => {
    const next = level + action.jump
    if (next < 1) {
      setMessage('이미 가장 낮은 준위(n=1)에 있어요. 방출할 에너지가 없어요!')
      setMsgType('warn'); return
    }
    if (next > 3) {
      setMessage('에너지가 맞지 않아 전자가 도약하지 못했어요. 이미 최대 준위예요!')
      setMsgType('warn'); return
    }
    if (action.jump > 0) {
      setMessage(`에너지 흡수 성공! 전자가 n=${level} → n=${next}로 올라갔어요 ⬆️`)
      setMsgType('success')
    } else {
      setMessage(`에너지 방출! 전자가 n=${level} → n=${next}로 내려오며 빛을 방출해요 ✨`)
      setMsgType('emit')
      setPhoton({ color: action.color, id: Date.now() })
      setTimeout(() => setPhoton(null), 900)
    }
    setLevel(next)
  }

  const cur = LEVELS[level - 1]

  return (
    <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
      <h2 className="text-cyan-400 font-bold text-lg mb-1">⚛️ 보어의 원자 모형과 양자 도약</h2>
      <p className="text-slate-400 text-xs mb-1">
        {analogyMode
          ? '전자는 엘리베이터처럼 아무 높이에나 서는 게 아니라, 정해진 층에만 설 수 있어. 층 사이를 이동할 때 정확한 에너지(빛)가 필요해!'
          : '전자는 원자 안에서 양자화된 에너지 준위를 가지며, 에너지 차이에 해당하는 광자를 흡수하거나 방출할 때 상태가 바뀐다.'}
      </p>
      <div className="text-[10px] text-yellow-600 mb-4">
        ⚠️ 교육용 단순화: 실제 전자는 딱딱한 궤도가 아닌 전자구름(오비탈)으로 설명된다. 보어 모형은 에너지 준위 개념 이해를 위한 교육용 모델이다.
      </div>

      {/* ── Atom visual ── */}
      <div className="flex justify-center mb-3">
        {/*
          컨테이너: 290×290. 모든 자식은 absolute + top:50% left:50% + translate(-50%,-50%)로 정중앙 기준.
        */}
        <div className="relative" style={{ width: 290, height: 290 }}>

          {/* Orbital rings — 각 링이 정중앙을 기준으로 centered */}
          {LEVELS.map(lv => (
            <div key={lv.n}
              className="absolute rounded-full border transition-all duration-500"
              style={{
                width:  lv.r * 2,
                height: lv.r * 2,
                top:    '50%',
                left:   '50%',
                transform: 'translate(-50%, -50%)',
                borderColor: level === lv.n ? lv.color : lv.color + '28',
                boxShadow:   level === lv.n ? `0 0 14px ${lv.color}50` : 'none',
              }}
            />
          ))}

          {/* Nucleus — z-index 10으로 링 위에 */}
          <div className="absolute z-10 rounded-full flex items-center justify-center"
            style={{
              width: 44, height: 44,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, #7c3aed, #4c1d95)',
              boxShadow: '0 0 22px #7c3aed90',
            }}>
            <div className="text-[9px] text-purple-200 text-center leading-tight">원자핵<br/>+Ze</div>
          </div>

          {/*
            Electron — Module1 방식과 동일:
            zero-size anchor at 50%/50%, 애니메이션이 rotate→translateX→rotate-back으로 반지름 결정.
            전자 dot은 -translate-x-1/2 -translate-y-1/2로 anchor 중앙에서 dot 중앙을 맞춤.
          */}
          <div className="absolute z-20"
            style={{
              top: '50%', left: '50%',
              width: 0, height: 0,
              animation: `bohr-orbit-${level} 2s linear infinite`,
            }}>
            <div style={{
              width: 16, height: 16,
              marginLeft: -8, marginTop: -8,
              borderRadius: '50%',
              background: cur.color,
              boxShadow: `0 0 14px ${cur.color}, 0 0 6px ${cur.color}`,
            }} />
          </div>

          {/* Photon emission */}
          {photon && (
            <div key={photon.id} className="absolute z-30 text-xl pointer-events-none"
              style={{
                top: '40%', left: '62%',
                animation: 'float 0.9s ease-out forwards',
                color: photon.color,
                textShadow: `0 0 14px ${photon.color}`,
              }}>
              ✦
            </div>
          )}
        </div>
      </div>

      {/* Level labels below the diagram */}
      <div className="flex justify-center gap-4 mb-5">
        {LEVELS.map(lv => (
          <div key={lv.n} className="flex items-center gap-1.5 text-xs transition-all"
            style={{ opacity: level === lv.n ? 1 : 0.35 }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: lv.color, boxShadow: `0 0 6px ${lv.color}` }} />
            <span style={{ color: lv.color }} className="font-medium">{lv.label}</span>
            <span className="text-slate-500 font-mono">{lv.energy}</span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {PHOTONS.map(p => (
          <button key={p.id} onClick={() => doAction(p)}
            className="flex flex-col items-center px-4 py-2.5 rounded-xl border text-xs font-medium transition-all hover:scale-[1.03]"
            style={{ borderColor: p.color + '60', background: p.color + '12', color: p.color }}>
            <span className="font-bold mb-0.5">{p.label}</span>
            <span className="text-[10px] opacity-70">{p.desc}</span>
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className={`p-3 rounded-xl text-sm text-center mb-4 transition-all ${
          msgType === 'success' ? 'bg-green-950/40 border border-green-700/40 text-green-300' :
          msgType === 'emit'    ? 'bg-yellow-950/40 border border-yellow-700/40 text-yellow-300' :
          'bg-red-950/30 border border-red-700/30 text-red-300'
        }`}>
          {message}
        </div>
      )}

      {/* Explanation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {[
          { title: '에너지 흡수', body: '전자가 광자를 흡수해 높은 에너지 준위로 올라감 (들뜬 상태)', color: '#3b82f6' },
          { title: '자연 방출',  body: '들뜬 전자는 자발적으로 낮은 준위로 내려오며 광자를 방출',   color: '#fbbf24' },
          { title: '에너지 양자화', body: '흡수/방출되는 빛의 에너지 = 두 준위의 에너지 차이 (ΔE = hν)', color: '#a78bfa' },
        ].map(c => (
          <div key={c.title} className="p-2.5 bg-slate-800/40 border border-slate-700/30 rounded-xl">
            <div className="font-bold mb-1" style={{ color: c.color }}>{c.title}</div>
            <div className="text-slate-400 leading-relaxed">{c.body}</div>
          </div>
        ))}
      </div>

      {/* Keyframes for 3 orbit radii */}
      <style>{`
        @keyframes bohr-orbit-1 {
          from { transform: rotate(0deg)   translateX(50px)  rotate(0deg); }
          to   { transform: rotate(360deg) translateX(50px)  rotate(-360deg); }
        }
        @keyframes bohr-orbit-2 {
          from { transform: rotate(0deg)   translateX(85px)  rotate(0deg); }
          to   { transform: rotate(360deg) translateX(85px)  rotate(-360deg); }
        }
        @keyframes bohr-orbit-3 {
          from { transform: rotate(0deg)   translateX(120px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }
      `}</style>
    </div>
  )
}
