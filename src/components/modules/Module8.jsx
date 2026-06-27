import { useState, useEffect, useRef } from 'react'
import ModuleLayout from '../ModuleLayout'
import MiniQuiz from '../MiniQuiz'

function ElectronFlow({ speed, color, label, conductivity }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const particles = Array.from({ length: 8 }, (_, i) => ({
      x: (i / 8) * canvas.width,
      speed: speed + Math.random() * 0.5,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Lattice
      for (let x = 20; x < canvas.width; x += 30) {
        ctx.beginPath()
        ctx.arc(x, canvas.height / 2, 6, 0, Math.PI * 2)
        ctx.fillStyle = color + '60'
        ctx.fill()
        ctx.strokeStyle = color + '30'
        ctx.lineWidth = 1
        ctx.stroke()
      }
      // Electrons
      particles.forEach(p => {
        p.x += p.speed
        if (p.x > canvas.width + 10) p.x = -10
        ctx.beginPath()
        ctx.arc(p.x, canvas.height / 2, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#22d3ee'
        ctx.shadowBlur = 8
        ctx.shadowColor = '#22d3ee'
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animId)
  }, [speed, color])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span className="font-bold" style={{ color }}>{label}</span>
        <span>전도율: {conductivity}</span>
      </div>
      <canvas ref={canvasRef} width={280} height={50} className="w-full rounded-lg bg-slate-950/60" />
    </div>
  )
}

export default function Module8({ analogyMode, onNext }) {
  const [metal, setMetal] = useState('copper')

  const metals = {
    copper: { label: '구리 (Cu)', color: '#f97316', conductivity: '5.96×10⁷ S/m', speed: 3.5, rank: '90%', desc: '면심입방(FCC) 구조. 전도 전자가 격자 산란이 적어 잘 흐른다.' },
    iron: { label: '철 (Fe)', color: '#6b7280', conductivity: '1.00×10⁷ S/m', speed: 1.5, rank: '17%', desc: '체심입방(BCC) 구조. 격자 결함과 자기적 특성으로 전자 산란이 많다.' },
  }
  const m = metals[metal]

  return (
    <ModuleLayout number={8} title="금속 결합 · 구리와 철" icon="⚙️" color="purple" onNext={onNext} currentId="module8">
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-purple-400 font-bold text-lg mb-3">📖 핵심 개념</h2>
        {analogyMode ? (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>🌊 금속은 <strong className="text-purple-300">전자 바다</strong>야! 양이온 격자 속에서 전자들이 자유롭게 헤엄쳐 다녀.</p>
            <p>🔌 그래서 전기가 잘 흐르는 거야 — 전자가 이쪽에서 저쪽으로 자유롭게 이동하니까!</p>
            <p>⚡ 구리는 철보다 전기가 훨씬 잘 흐르는데, 단순히 "느슨하게 잡아서"가 아니야.</p>
            <p>🔑 구리는 FCC 구조라 전자 이동이 방해를 덜 받아. 철은 자기적 특성과 격자 결함으로 전자가 더 많이 튕겨나가.</p>
          </div>
        ) : (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>금속 결합: 양이온이 규칙적 격자를 이루고, 자유 전자(전도 전자)가 전체에 비국소화되어 존재한다.</p>
            <p>전도율에 영향하는 요인: 전자 구조(d-밴드 채움), 격자 산란(포논), 불순물·결함, 온도.</p>
            <p>구리: [Ar]3d¹⁰4s¹. FCC. 전도 전자(4s)가 격자 산란이 적다. σ = 5.96×10⁷ S/m.</p>
            <p>철: [Ar]3d⁶4s². BCC. 자기적 특성·복잡한 d-밴드로 전자 산란 증가. σ = 1.00×10⁷ S/m.</p>
          </div>
        )}
      </section>

      {/* Metal selector */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-purple-400 font-bold text-lg mb-4">⚡ 전기 전도 시뮬레이션</h2>

        <div className="flex gap-3 mb-6">
          {Object.entries(metals).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setMetal(key)}
              className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                metal === key
                  ? 'border-purple-500 bg-purple-950/50 text-purple-300'
                  : 'border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        <ElectronFlow speed={m.speed} color={m.color} label={m.label} conductivity={m.conductivity} />

        <div className="mt-4 p-3 bg-slate-800/60 rounded-xl text-xs text-slate-300">
          {m.desc}
        </div>
      </section>

      {/* Conductivity comparison */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-purple-400 font-bold text-base mb-4">📊 전기 전도율 비교</h2>
        {Object.entries(metals).map(([key, val]) => (
          <div key={key} className="mb-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span style={{ color: val.color }}>{val.label}</span>
              <span>{val.conductivity}</span>
            </div>
            <div className="h-6 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: val.rank, backgroundColor: val.color, boxShadow: `0 0 10px ${val.color}` }}
              />
            </div>
          </div>
        ))}
        <p className="text-xs text-slate-500 mt-2">구리의 전도율은 철의 약 6배다.</p>
      </section>

      {/* Key insight */}
      <div className="bg-purple-950/40 border border-purple-700/40 rounded-xl p-4 mb-6">
        <p className="text-purple-300 text-sm">
          🌊 "금속은 전자 바다를 공유하지만, 모든 금속에서 전자가 똑같이 잘 흐르는 것은 아니다.
          구리와 철의 전자 구조와 격자 특성이 전도율의 차이를 만든다."
        </p>
      </div>

      <div className="bg-purple-950/40 border border-purple-800/40 rounded-xl p-4 mb-2">
        <p className="text-purple-300 text-sm font-medium">
          💡 한 줄 요약: 금속 = 전자 바다 모델. 구리는 철보다 전도율이 약 6배 높다. 이유는 전자 구조와 격자 산란 차이.
        </p>
      </div>

      <MiniQuiz
        question="금속에서 자유롭게 이동하는 전자가 전기 전도의 핵심이다 (전자 바다 모델)."
        answer="O"
        explanation="금속 결합에서 전도 전자는 비국소화되어 자유롭게 이동한다. 이것이 전기·열 전도성의 원인이다."
      />
    </ModuleLayout>
  )
}
