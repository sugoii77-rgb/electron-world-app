import { useState, useRef, useEffect, useCallback } from 'react'

// Sample y position from double-slit interference probability distribution
// P(y) ∝ cos²(freq·y) · exp(-y²/2σ²)
function sampleY() {
  const sigma = 0.38
  const freq  = 8.5
  for (let i = 0; i < 10000; i++) {
    const y = (Math.random() - 0.5) * 2      // [-1, 1]
    const P = Math.cos(freq * y) ** 2 * Math.exp(-(y * y) / (2 * sigma * sigma))
    if (Math.random() < P) return y
  }
  return 0
}

export default function DoubleSlitSection({ analogyMode }) {
  const canvasRef = useRef(null)
  const dotsRef   = useRef([])
  const [count, setCount]   = useState(0)
  const [running, setRunning] = useState(false)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height

    ctx.fillStyle = '#05080f'
    ctx.fillRect(0, 0, W, H)

    // Grid lines (faint)
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 0.5
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }

    // Draw dots
    dotsRef.current.forEach(dot => {
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
      ctx.fillStyle = dot.color
      ctx.shadowBlur = dot.glow ? 8 : 0
      ctx.shadowColor = dot.color
      ctx.fill()
    })
    ctx.shadowBlur = 0
  }, [])

  const addDots = useCallback((n) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = canvas.width, H = canvas.height

    const batch = []
    for (let i = 0; i < n; i++) {
      const y = sampleY()               // [-1, 1]
      const px = W * (0.55 + Math.random() * 0.35)  // right portion
      const py = H * (0.5 + y * 0.45)  // centered vertically
      const blue = Math.floor(Math.random() * 80 + 175)
      batch.push({
        x: px, y: py, r: n === 1 ? 2.5 : 1.2,
        color: n === 1 ? `rgba(255,255,255,0.95)` : `rgba(${120 + Math.random()*60},${180 + Math.random()*40},${blue},0.8)`,
        glow: n === 1,
      })
    }
    dotsRef.current = [...dotsRef.current, ...batch]
    setCount(c => c + n)
  }, [])

  // Animation frame
  useEffect(() => {
    let raf
    const loop = () => { draw(); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [draw])

  const shoot = (n) => {
    if (n === 1) {
      addDots(1)
      return
    }
    // Fire in batches so we see accumulation
    setRunning(true)
    const batchSize = n <= 100 ? 5 : 50
    const total = n
    let fired = 0
    const interval = setInterval(() => {
      const next = Math.min(batchSize, total - fired)
      if (next <= 0) { clearInterval(interval); setRunning(false); return }
      addDots(next)
      fired += next
      if (fired >= total) { clearInterval(interval); setRunning(false) }
    }, n <= 100 ? 60 : 30)
  }

  const reset = () => {
    dotsRef.current = []
    setCount(0)
  }

  return (
    <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
      <h2 className="text-blue-400 font-bold text-lg mb-1">〰 파동-입자 이중성: 이중 슬릿 실험</h2>
      <p className="text-slate-400 text-xs mb-1">
        {analogyMode
          ? '전자 하나하나는 도착할 때 점으로 찍히지만, 많이 모이면 파도처럼 줄무늬 패턴을 만들어. 이게 파동성의 증거야!'
          : '전자 검출 결과는 개별 사건으로 나타나지만, 많은 사건의 분포는 파동함수의 확률분포와 간섭 효과를 반영한다.'}
      </p>
      <div className="text-[10px] text-yellow-600 mb-4">⚠️ 교육용 단순화: 실제 양자 간섭 패턴을 교육 목적으로 근사한 시뮬레이션입니다.</div>

      {/* Experiment diagram labels */}
      <div className="flex items-center text-[10px] text-slate-500 mb-2 gap-4 justify-center">
        <span>🔫 전자총</span>
        <span className="text-slate-700">─────</span>
        <span>‖‖ 이중 슬릿</span>
        <span className="text-slate-700">─────</span>
        <span>📺 검출 스크린</span>
      </div>

      {/* Canvas */}
      <div className="relative mb-4 rounded-xl overflow-hidden border border-slate-700/50">
        <canvas ref={canvasRef} width={500} height={260}
          className="w-full" style={{ background: '#05080f', imageRendering: 'pixelated' }} />

        {/* Overlay: slit plate */}
        <div className="absolute top-0 bottom-0 flex flex-col justify-center pointer-events-none"
          style={{ left: '42%', width: 4 }}>
          <div className="flex-1 bg-slate-600/80" style={{ maxHeight: '30%' }} />
          <div className="h-3" />  {/* slit gap */}
          <div className="flex-1 bg-slate-600/80" style={{ maxHeight: '15%' }} />
          <div className="h-3" />  {/* slit gap */}
          <div className="flex-1 bg-slate-600/80" style={{ maxHeight: '30%' }} />
        </div>

        {/* Electron gun */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-xl">🔫</div>
        </div>

        {/* Counter */}
        <div className="absolute top-2 right-2 text-[10px] font-mono text-blue-400 bg-slate-900/80 px-2 py-0.5 rounded">
          전자 {count.toLocaleString()}개
        </div>

        {/* Pattern hint when enough dots */}
        {count >= 500 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-cyan-400/70 bg-slate-900/60 px-2 py-0.5 rounded whitespace-nowrap">
            간섭 무늬 형성 중…
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: '전자 1개 ▶', n: 1,     color: '#22d3ee' },
          { label: '전자 100개 ▶▶', n: 100,   color: '#3b82f6' },
          { label: '전자 10,000개 ▶▶▶', n: 10000, color: '#8b5cf6' },
        ].map(btn => (
          <button key={btn.n} onClick={() => shoot(btn.n)} disabled={running}
            className="flex-1 py-2 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] disabled:opacity-40"
            style={{ borderColor: btn.color + '60', color: btn.color, background: btn.color + '12' }}>
            {btn.label}
          </button>
        ))}
        <button onClick={reset} disabled={running}
          className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs hover:border-slate-500 hover:text-white transition-colors disabled:opacity-40">
          초기화
        </button>
      </div>

      {/* Explanation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {[
          { title: '전자 1개', body: '어디에 찍힐지는 확률만 있다. 아무 곳에나 무작위로 나타남.', color: '#22d3ee' },
          { title: '전자 많아지면', body: '줄무늬 패턴이 나타남. 이게 파동 간섭의 흔적!', color: '#3b82f6' },
          { title: '입자냐 파동이냐', body: '검출될 때는 점(입자), 분포는 파동. 이것이 파동-입자 이중성.', color: '#8b5cf6' },
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
