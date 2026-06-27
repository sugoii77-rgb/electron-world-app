import { useState } from 'react'
import ModuleLayout from '../ModuleLayout'
import MiniQuiz from '../MiniQuiz'

export default function Module9({ analogyMode, onNext }) {
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)

  const tick = () => {
    setTime(t => {
      if (t >= 100) { setRunning(false); return 100 }
      return t + 1
    })
  }

  const startAnim = () => {
    if (time >= 100) setTime(0)
    setRunning(true)
    const id = setInterval(() => {
      setTime(t => {
        if (t >= 100) { clearInterval(id); setRunning(false); return 100 }
        return t + 2
      })
    }, 50)
  }

  const ironRust = Math.min(time, 100)
  const copperOx = Math.min(time * 0.4, 30) // copper forms protective layer, stops early

  return (
    <ModuleLayout number={9} title="녹 · 산화 · 보호막" icon="🔴" color="red" onNext={onNext} currentId="module9">
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-red-400 font-bold text-lg mb-3">📖 핵심 개념</h2>
        {analogyMode ? (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>🔴 철은 물과 산소를 만나면 녹(Fe₂O₃·xH₂O)이 생겨. 그런데 철 녹은 부서지기 쉬워서 내부를 보호하지 못해 계속 안쪽으로 파고들어!</p>
            <p>🟢 구리는 표면에 얇은 산화구리·녹청(CuO, Cu₂(OH)₂CO₃)이 생겨. 이 층이 추가 산화를 어느 정도 막아줘!</p>
            <p>철 녹 = 보호력 낮은 부서지는 층 / 구리 산화층 = 상대적으로 튼튼한 보호막</p>
          </div>
        ) : (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>철의 부식: Fe → Fe²⁺ → Fe₂O₃ (적철석). 산화층이 다공성·취약해 산소·수분이 내부로 계속 침투한다.</p>
            <p>구리의 산화: Cu → CuO → Cu₂(OH)₂CO₃ (말라카이트, 녹청). 표면에 밀착된 부동태층이 형성되어 추가 산화를 억제한다.</p>
            <p>알루미늄도 유사하게 Al₂O₃ 부동태층이 내부를 보호한다 (비교 참고용).</p>
          </div>
        )}
      </section>

      {/* Animation */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-red-400 font-bold text-lg mb-4">🎮 부식 시뮬레이션</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Iron */}
          <div>
            <div className="text-center text-sm font-bold text-slate-300 mb-2">🔩 철 (Fe)</div>
            <div className="h-32 bg-slate-800 rounded-xl overflow-hidden relative">
              {/* Iron base */}
              <div className="absolute bottom-0 left-0 right-0 h-full bg-slate-600" />
              {/* Rust spreading from outside in */}
              <div
                className="absolute top-0 left-0 right-0 transition-all duration-100"
                style={{ height: `${ironRust}%`, background: 'linear-gradient(to bottom, #92400e, #b45309, #d97706)' }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {ironRust < 30 && <span className="text-slate-300">표면</span>}
                {ironRust >= 30 && ironRust < 70 && <span className="text-orange-300">녹 진행 중...</span>}
                {ironRust >= 70 && <span className="text-red-300">내부까지 부식!</span>}
              </div>
            </div>
            <div className="text-xs text-red-400 text-center mt-2">
              녹 진행: {ironRust}% — 내부 보호 안됨
            </div>
          </div>

          {/* Copper */}
          <div>
            <div className="text-center text-sm font-bold text-slate-300 mb-2">🔶 구리 (Cu)</div>
            <div className="h-32 bg-slate-800 rounded-xl overflow-hidden relative">
              {/* Copper base */}
              <div className="absolute bottom-0 left-0 right-0 h-full bg-orange-800" />
              {/* Thin protective layer */}
              <div
                className="absolute top-0 left-0 right-0 transition-all duration-100"
                style={{
                  height: `${copperOx}%`,
                  background: 'linear-gradient(to bottom, #047857, #059669, #10b981)',
                  maxHeight: '30%'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {copperOx < 5 && <span className="text-orange-300">표면</span>}
                {copperOx >= 5 && copperOx < 25 && <span className="text-green-300">보호막 생성 중</span>}
                {copperOx >= 25 && <span className="text-emerald-300">보호막 완성! 내부 안전</span>}
              </div>
            </div>
            <div className="text-xs text-green-400 text-center mt-2">
              보호층: {Math.round(copperOx)}% — 내부 보호됨
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={startAnim}
            disabled={running}
            className="flex-1 py-2.5 bg-red-900/50 border border-red-700/50 text-red-300 rounded-xl text-sm hover:bg-red-900/70 disabled:opacity-50 transition-colors font-medium"
          >
            {running ? '진행 중...' : '⏯️ 시뮬레이션 시작'}
          </button>
          <button
            onClick={() => { setTime(0); setRunning(false) }}
            className="px-4 py-2 bg-slate-700 border border-slate-600 text-slate-300 rounded-xl text-sm hover:bg-slate-600"
          >
            초기화
          </button>
        </div>

        {time > 0 && (
          <div className="mt-3 text-xs text-slate-500 text-center">
            💧 + O₂ 노출 시간: {time}%
          </div>
        )}
      </section>

      {/* Comparison cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-red-950/30 border border-red-700/40 rounded-xl p-4 text-sm">
          <div className="text-red-300 font-bold mb-2">🔴 철 녹 (Fe₂O₃)</div>
          <div className="text-xs text-slate-400 space-y-1">
            <div>• 다공성, 부서지기 쉬움</div>
            <div>• 내부 산소·수분 차단 안됨</div>
            <div>• 부식 계속 진행</div>
            <div>• 보호력: 낮음 ❌</div>
          </div>
        </div>
        <div className="bg-green-950/30 border border-green-700/40 rounded-xl p-4 text-sm">
          <div className="text-green-300 font-bold mb-2">🟢 구리 녹청</div>
          <div className="text-xs text-slate-400 space-y-1">
            <div>• 밀착된 산화층 형성</div>
            <div>• 내부와 외부 사이 장벽</div>
            <div>• 추가 산화 억제</div>
            <div>• 보호력: 상대적으로 높음 ✓</div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-4 mb-6 text-xs">
        <p className="text-slate-400 font-bold mb-2">💡 실생활 예시</p>
        <div className="space-y-1 text-slate-400">
          <p>🏛️ 구리 동상: 세월이 지나도 녹청층이 생기고 추가 부식 느려짐</p>
          <p>🚗 철제 차체: 방치하면 내부까지 녹이 파고들어 구조 손상</p>
          <p>🛡️ 아연 도금: 철 표면에 아연을 입혀 희생 산화로 철을 보호</p>
        </div>
      </section>

      <div className="bg-red-950/40 border border-red-800/40 rounded-xl p-4 mb-2">
        <p className="text-red-300 text-sm font-medium">
          💡 한 줄 요약: 철 녹은 다공성이라 내부 보호가 안 되고, 구리 산화층은 상대적으로 밀착 보호막이 된다.
        </p>
      </div>

      <MiniQuiz
        question="철의 녹(Fe₂O₃)은 내부 부식을 잘 막는 보호막 역할을 한다."
        answer="X"
        explanation="철 녹은 다공성·취약하여 산소와 수분이 내부로 계속 침투한다. 구리 산화층과 달리 보호막 역할이 낮다."
      />
    </ModuleLayout>
  )
}
