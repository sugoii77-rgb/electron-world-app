import { useState } from 'react'
import ModuleLayout from '../ModuleLayout'
import MiniQuiz from '../MiniQuiz'

export default function Module4({ analogyMode, onNext }) {
  const [donated, setDonated] = useState(false)
  const [animating, setAnimating] = useState(false)

  const handleDonate = () => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => { setDonated(true); setAnimating(false) }, 800)
  }

  const reset = () => { setDonated(false) }

  return (
    <ModuleLayout number={4} title="비타민 C와 항산화" icon="🍊" color="yellow" onNext={onNext} currentId="module4">
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-yellow-400 font-bold text-lg mb-3">📖 핵심 개념</h2>
        {analogyMode ? (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>☢️ <strong className="text-red-300">활성산소</strong>는 전자가 하나 부족한 불안정한 분자야. 주변 세포에서 전자를 빼앗으려고 난리야!</p>
            <p>🍊 <strong className="text-yellow-300">비타민 C</strong>는 전자를 선뜻 내줄 수 있어. 그리고 줘도 비교적 안정적으로 남아있을 수 있어!</p>
            <p>🛡️ 항산화제 = "전자를 잘 나눠주는 보호자". 자신이 약간 희생하면서 세포를 지켜줘.</p>
            <p>공식: <span className="font-mono text-xs bg-slate-800 px-2 py-1 rounded">C₆H₈O₆</span> — 비타민 C의 화학식</p>
          </div>
        ) : (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p><strong className="text-red-300">활성산소(ROS)</strong>: 짝이 없는 홀전자(unpaired electron)를 가진 불안정한 산소 화학종. O₂⁻·, OH·, H₂O₂ 등.</p>
            <p>세포 DNA, 지질, 단백질에서 전자를 빼앗아 산화적 손상을 일으킨다.</p>
            <p><strong className="text-yellow-300">비타민 C(아스코르브산)</strong>는 전자 1개를 내주어 활성산소를 안정화하고, 자신은 비교적 안정적인 세미데히드로아스코르브산(MDHA) 라디칼이 된다. 이후 재생될 수 있다.</p>
          </div>
        )}
      </section>

      {/* Interactive */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-yellow-400 font-bold text-lg mb-4">🎮 전자 전달 시뮬레이션</h2>

        <div className="flex items-center justify-around gap-4 h-48 relative">
          {/* Vitamin C */}
          <div className={`relative flex flex-col items-center transition-all duration-500 ${donated ? 'opacity-80' : ''}`}>
            <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-500 ${
              donated
                ? 'bg-orange-950/50 border-orange-700 shadow-[0_0_10px_#f97316]'
                : 'bg-yellow-950/50 border-yellow-500 shadow-[0_0_20px_#eab308]'
            }`}>
              <span className="text-2xl">🍊</span>
              <span className="text-xs text-yellow-300 font-bold">Vit C</span>
            </div>
            <div className="mt-2 text-xs text-center text-slate-400">
              {donated ? (
                <span className="text-orange-300">전자를 줬어요<br/>안정적으로 남음 ✓</span>
              ) : (
                <span>C₆H₈O₆<br/>전자 보유 중</span>
              )}
            </div>
            {/* Electron particle */}
            {animating && (
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee] animate-[electron-flow-r_0.8s_ease-in-out_forwards]" />
            )}
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center gap-1">
            {!donated && !animating ? (
              <button
                onClick={handleDonate}
                className="px-4 py-2 bg-yellow-700/50 border border-yellow-600 text-yellow-300 rounded-xl hover:bg-yellow-700/70 transition-colors text-sm font-medium"
              >
                전자 전달 →
              </button>
            ) : animating ? (
              <div className="text-cyan-400 text-xl animate-pulse">⚡</div>
            ) : (
              <button onClick={reset} className="px-3 py-1 text-xs bg-slate-700 border border-slate-600 text-slate-300 rounded-lg">
                다시
              </button>
            )}
          </div>

          {/* Reactive oxygen */}
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-500 ${
              donated
                ? 'bg-green-950/50 border-green-500 shadow-[0_0_15px_#22c55e]'
                : 'bg-red-950/50 border-red-500 shadow-[0_0_20px_#ef4444] animate-shake'
            }`}
              style={donated ? {} : { animation: 'shake 1.5s ease-in-out infinite' }}
            >
              <span className="text-2xl">{donated ? '😌' : '😡'}</span>
              <span className="text-xs font-bold" style={{ color: donated ? '#86efac' : '#fca5a5' }}>
                {donated ? '안정화' : '활성산소'}
              </span>
            </div>
            <div className="mt-2 text-xs text-center text-slate-400">
              {donated ? (
                <span className="text-green-300">전자 받음!<br/>이제 안정 ✓</span>
              ) : (
                <span className="text-red-300">전자 부족<br/>세포 공격 중!</span>
              )}
            </div>
          </div>
        </div>

        {donated && (
          <div className="mt-4 p-3 bg-green-950/30 border border-green-700/40 rounded-xl text-sm text-green-300 text-center">
            🎉 비타민 C가 전자 하나를 내줘서 활성산소가 안정화됐어요!<br/>
            비타민 C는 "희생했지만 안정한 형태"로 남아 있어요.
          </div>
        )}
      </section>

      {/* Comparison */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-red-950/30 border border-red-800/30 rounded-xl p-4 text-sm">
          <div className="text-red-300 font-bold mb-2">☢️ 활성산소</div>
          <div className="text-slate-400 text-xs space-y-1">
            <div>• 전자가 하나 부족함</div>
            <div>• 주변 분자에서 빼앗으려 함</div>
            <div>• 세포 DNA·지질 손상</div>
          </div>
        </div>
        <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-xl p-4 text-sm">
          <div className="text-yellow-300 font-bold mb-2">🍊 항산화제</div>
          <div className="text-slate-400 text-xs space-y-1">
            <div>• 전자를 선뜻 내줄 수 있음</div>
            <div>• 줘도 비교적 안정함</div>
            <div>• 세포를 보호하는 보호자</div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-950/40 border border-yellow-800/40 rounded-xl p-4 mb-2">
        <p className="text-yellow-300 text-sm font-medium">
          💡 한 줄 요약: 항산화제 = 전자를 내주어 활성산소를 안정화하는 보호자. 비타민 C는 내줘도 비교적 안정하게 남는다.
        </p>
      </div>

      <MiniQuiz
        question="비타민 C는 전자를 내주어 활성산소를 안정화할 수 있다."
        answer="O"
        explanation="비타민 C(아스코르브산)는 전자 1개를 제공해 활성산소를 중화하는 항산화제다. 자신은 비교적 안정한 형태로 남는다."
      />
    </ModuleLayout>
  )
}
