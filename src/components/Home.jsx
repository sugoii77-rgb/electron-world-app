import { useEffect, useRef } from 'react'

function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      hue: Math.random() > 0.5 ? 180 : 270,
    }))

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, 0.7)`
        ctx.shadowBlur = 8
        ctx.shadowColor = `hsla(${p.hue}, 100%, 70%, 1)`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

export default function Home({ onStart }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <ParticleCanvas />
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <div className="text-6xl mb-6 animate-float">⚡</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
          전자와 결합의 세계
        </h1>
        <p className="text-lg text-slate-300 mb-2 font-medium">
          탄수화물에서 구리 전선까지
        </p>
        <p className="text-sm text-slate-400 mb-10 leading-relaxed">
          탄수화물, 비타민 C, 지방산, 오존, 구리 전선, 철 녹까지<br/>
          한 번에 이해하는 인터랙티브 화학 여행
        </p>

        <button
          onClick={onStart}
          className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50"
        >
          여행 시작하기 →
        </button>

        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '⚛️', label: '9개 모듈' },
            { icon: '🎮', label: '인터랙티브' },
            { icon: '🏆', label: '퀴즈 12문항' },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-slate-900/60 backdrop-blur border border-slate-700/40 rounded-xl p-3">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-slate-600">
          핵심 개념: 전자 · 수소 이온 · 작용기 · 산화/환원 · 생체분자 · 금속 결합 · 전도율 · 부식
        </p>
      </div>
    </div>
  )
}
