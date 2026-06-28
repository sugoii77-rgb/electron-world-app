import { useState, useEffect } from 'react'

const LEVELS = [
  { n: 1, r: 50,  label: 'n=1 (기저 상태)',  color: '#22d3ee', energy: -13.6 },
  { n: 2, r: 85,  label: 'n=2 (1차 들뜬 상태)', color: '#a78bfa', energy: -3.4  },
  { n: 3, r: 120, label: 'n=3 (2차 들뜬 상태)', color: '#f472b6', energy: -1.5  },
]

const PHOTONS = [
  { id: 'blue',   label: '🔵 파란빛 흡수',  jump: 1, color: '#3b82f6', desc: '에너지 작음 (n+1 이동)' },
  { id: 'violet', label: '🟣 보라빛 흡수',  jump: 2, color: '#8b5cf6', desc: '에너지 큼 (n+2 이동)' },
  { id: 'emit',   label: '✨ 빛 방출',       jump: -1, color: '#fbbf24', desc: '에너지 방출 (n-1 이동)' },
]

export default function BohrSection({ analogyMode }) {
  const [level, setLevel]     = useState(1)
  const [message, setMessage] = useState('')
  const [msgType, setMsgType] = useState('info')
  const [photon, setPhoton]   = useState(null) // {color, x, y, id}

  const doAction = (action) => {
    const next = level + action.jump
    if (next < 1) {
      setMessage('이미 가장 낮은 준위(n=1)에 있어요. 방출할 에너지가 없어요!')
      setMsgType('warn')
      return
    }
    if (next > 3) {
      setMessage('에너지가 맞지 않아 전자가 도약하지 못했어요. 이미 최대 준위에 있어요!')
      setMsgType('warn')
      return
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

  const currentLevel = LEVELS[level - 1]
  const orbitSize = currentLevel.r * 2 + 20

  return (
    <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
      <h2 className="text-cyan-400 font-bold text-lg mb-1">⚛️ 보어의 원자 모형과 양자 도약</h2>
      <p className="text-slate-400 text-xs mb-1">
        {analogyMode
          ? '전자는 엘리베이터처럼 아무 높이에나 서는 게 아니라, 정해진 층에만 설 수 있어. 층 사이를 이동할 때 정확한 에너지(빛)가 필요해!'
          : '전자는 원자 안에서 양자화된 에너지 준위를 가지며, 에너지 차이에 해당하는 광자를 흡수하거나 방출할 때 상태가 바뀐다.'}
      </p>
      <div className="text-[10px] text-yellow-600 mb-4">⚠️ 교육용 단순화: 실제 전자는 딱딱한 궤도가 아닌 전자구름(오비탈)으로 설명된다. 보어 모형은 에너지 준위 개념 이해를 위한 교육용 모델이다.</div>

      {/* Atom visual */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
          {/* Orbital rings */}
          {LEVELS.map(lv => (
            <div key={lv.n}
              className="absolute rounded-full border transition-all duration-500"
              style={{
                width: lv.r * 2, height: lv.r * 2,
                borderColor: level === lv.n ? lv.color : lv.color + '30',
                boxShadow: level === lv.n ? `0 0 12px ${lv.color}60` : 'none',
              }}
            >
              {/* Level label */}
              <div className="absolute -right-14 top-1/2 -translate-y-1/2 text-[10px] whitespace-nowrap"
                style={{ color: level === lv.n ? lv.color : '#475569' }}>
                {lv.label}
              </div>
              {/* Energy label */}
              <div className="absolute -left-16 top-1/2 -translate-y-1/2 text-[10px] font-mono whitespace-nowrap"
                style={{ color: level === lv.n ? lv.color : '#334155' }}>
                {lv.energy} eV
              </div>
            </div>
          ))}

          {/* Nucleus */}
          <div className="absolute z-10 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'radial-gradient(circle, #7c3aed, #4c1d95)', boxShadow: '0 0 20px #7c3aed80' }}>
            <div className="text-[9px] text-purple-200 text-center leading-tight">원자핵<br/>+Ze</div>
          </div>

          {/* Electron on current orbit */}
          <div className="absolute"
            style={{
              width: currentLevel.r * 2, height: currentLevel.r * 2,
              animation: 'orbit 2s linear infinite',
              top: `calc(50% - ${currentLevel.r}px)`,
              left: `calc(50% - ${currentLevel.r}px)`,
            }}>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <div className="w-4 h-4 rounded-full"
                style={{ background: currentLevel.color, boxShadow: `0 0 12px ${currentLevel.color}` }} />
            </div>
          </div>

          {/* Photon emission animation */}
          {photon && (
            <div key={photon.id} className="absolute z-20 text-lg"
              style={{
                animation: 'float 0.9s ease-out forwards',
                top: '40%', left: '60%',
                color: photon.color,
                textShadow: `0 0 12px ${photon.color}`,
              }}>
              ✦
            </div>
          )}
        </div>
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

      {/* Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {[
          { title: '에너지 흡수', body: '전자가 광자를 흡수해 높은 에너지 준위로 올라감 (들뜬 상태)', color: '#3b82f6' },
          { title: '자연 방출', body: '들뜬 전자는 자발적으로 낮은 준위로 내려오며 광자를 방출', color: '#fbbf24' },
          { title: '에너지 양자화', body: '흡수/방출되는 빛의 에너지 = 두 준위의 에너지 차이 (ΔE = hν)', color: '#a78bfa' },
        ].map(c => (
          <div key={c.title} className="p-2.5 bg-slate-800/40 border border-slate-700/30 rounded-xl">
            <div className="font-bold mb-1" style={{ color: c.color }}>{c.title}</div>
            <div className="text-slate-400 leading-relaxed">{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
