import { useState } from 'react'

// precision: 0=blur(long exposure) to 10=sharp(short exposure)
export default function UncertaintySection({ analogyMode }) {
  const [precision, setPrecision] = useState(5)

  // position accuracy ↑ when precision ↑ (short exposure = sharp position)
  const posAccuracy  = precision * 10   // 0..100
  // momentum accuracy ↑ when precision ↓ (long exposure = sees motion)
  const momAccuracy  = (10 - precision) * 10  // 0..100

  const blurPx = (10 - precision) * 4   // 0..40px
  const trailW = (10 - precision) * 18  // trail width

  const color = (v) => v > 70 ? '#22c55e' : v > 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
      <h2 className="text-yellow-400 font-bold text-lg mb-1">🌀 불확정성의 원리</h2>
      <p className="text-slate-400 text-xs mb-1">
        {analogyMode
          ? '찰칵! 아주 짧게 찍으면 공이 어디 있는지는 잘 보이지만, 어떻게 움직이는지는 잘 안 보여. 반대로 길게 찍으면 움직임은 보이지만 위치가 흐려져.'
          : '위치 불확정성 Δx와 운동량 불확정성 Δp의 곱은 ħ/2보다 작아질 수 없다. 이는 측정 장비의 한계가 아닌 자연의 근본 원리다.'}
      </p>
      <div className="text-[10px] text-yellow-600 mb-4">
        ⚠️ 불확정성 원리는 단순히 측정 장비가 나빠서 생기는 문제가 아니다. 이것은 자연의 근본적인 성질이다.
      </div>

      {/* Core equation */}
      <div className="text-center mb-5 p-3 bg-yellow-950/30 border border-yellow-700/40 rounded-xl">
        <div className="font-mono text-yellow-300 text-xl font-bold">Δx · Δp ≥ ħ / 2</div>
        <div className="text-xs text-slate-500 mt-1">위치 불확정성 × 운동량 불확정성 ≥ 플랑크 상수/2</div>
      </div>

      {/* Visual: particle with blur */}
      <div className="relative rounded-xl bg-slate-950/60 border border-slate-700/40 mb-5 overflow-hidden" style={{ height: 120 }}>
        {/* Trail (motion blur) */}
        {trailW > 0 && (
          <div className="absolute top-1/2 -translate-y-1/2 rounded-full opacity-30 transition-all duration-300"
            style={{
              left: `calc(50% - ${trailW / 2}px)`,
              width: trailW,
              height: 24,
              background: 'linear-gradient(to right, transparent, #22d3ee, transparent)',
            }} />
        )}

        {/* Particle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          style={{ filter: `blur(${blurPx * 0.3}px)` }}>
          <div className="w-6 h-6 rounded-full"
            style={{
              background: `radial-gradient(circle, #22d3ee, #0891b2)`,
              boxShadow: `0 0 ${20 - blurPx * 0.4}px #22d3ee`,
            }} />
        </div>

        {/* Labels */}
        <div className="absolute bottom-2 left-3 text-[10px] text-slate-500">
          {precision >= 8 ? '📸 짧은 노출 (선명)' : precision <= 3 ? '🎞 긴 노출 (궤적 보임)' : ''}
        </div>
        <div className="absolute top-2 right-3 text-[10px]">
          {precision >= 8 ? (
            <span className="text-green-400">위치: 선명</span>
          ) : precision <= 3 ? (
            <span className="text-blue-400">궤적: 보임</span>
          ) : null}
        </div>
      </div>

      {/* Slider */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>🎞 긴 노출 (운동량 잘 보임)</span>
          <span>📸 짧은 노출 (위치 선명)</span>
        </div>
        <input type="range" min={0} max={10} value={precision}
          onChange={e => setPrecision(Number(e.target.value))}
          className="w-full cursor-pointer" style={{ accentColor: '#eab308' }} />
        <div className="text-center text-xs text-yellow-400 mt-1">
          관찰 정밀도: {precision} / 10
        </div>
      </div>

      {/* Dual gauges */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {[
          { label: '📍 위치 정확도 (Δx 작음)', val: posAccuracy,  desc: precision >= 7 ? '위치 매우 선명' : precision <= 3 ? '위치 불분명' : '중간' },
          { label: '💨 운동량 정보 (Δp 작음)',  val: momAccuracy, desc: precision <= 3 ? '운동량 잘 파악' : precision >= 7 ? '운동량 불분명' : '중간' },
        ].map(g => (
          <div key={g.label}>
            <div className="text-[11px] text-slate-400 mb-1">{g.label}</div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-1">
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${g.val}%`, backgroundColor: color(g.val), boxShadow: `0 0 6px ${color(g.val)}` }} />
            </div>
            <div className="text-[10px]" style={{ color: color(g.val) }}>{g.val}% — {g.desc}</div>
          </div>
        ))}
      </div>

      {/* Key insight */}
      <div className="p-3 bg-slate-800/40 border border-yellow-700/20 rounded-xl text-xs">
        <div className="text-yellow-400 font-bold mb-1">💡 핵심 통찰</div>
        <div className="text-slate-300 leading-relaxed">
          두 게이지는 항상 반대로 움직인다. 하나를 올리면 다른 하나는 내려간다.
          이것이 <strong className="text-yellow-300">불확정성 원리</strong>의 본질이다.
          더 좋은 측정 장비가 있어도 이 한계는 사라지지 않는다 — 이것은 자연의 근본 성질이다.
        </div>
      </div>
    </div>
  )
}
