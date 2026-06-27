import { useState } from 'react'
import ModuleLayout from '../ModuleLayout'
import MiniQuiz from '../MiniQuiz'

export default function Module7({ analogyMode, onNext }) {
  const [selected, setSelected] = useState('o2')

  return (
    <ModuleLayout number={7} title="오존과 활성산소" icon="☁️" color="blue" onNext={onNext} currentId="module7">
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-blue-400 font-bold text-lg mb-3">📖 핵심 개념</h2>
        {analogyMode ? (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>🌬️ <strong className="text-blue-300">O₂</strong>: 우리가 숨쉬는 안정적인 산소. 두 원자가 결합한 형태.</p>
            <p>⚡ <strong className="text-purple-300">O₃ (오존)</strong>: 세 번째 산소 원자가 붙어 불안정해진 형태. 더 반응하고 싶어 안달이야!</p>
            <p>🔑 오존이 위험한 건 "산성이라서"가 아니라, <strong className="text-red-300">전자를 빼앗는 힘(산화력)</strong>이 강해서야!</p>
            <p>💡 산성(H⁺ 관련) ≠ 산화력(전자를 빼앗는 힘). 이 두 개념은 달라!</p>
          </div>
        ) : (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p><strong className="text-blue-300">O₂</strong>: 산소 원자 2개가 이중결합. 상대적으로 안정. 표준 산화-환원전위 낮음.</p>
            <p><strong className="text-purple-300">O₃ (오존)</strong>: 굽은 구조(V형). 공명구조로 인해 반응성 높음. 산화전위 +2.07 V (매우 강한 산화제).</p>
            <p>오존의 위험성은 낮은 pH(산성)가 아닌 높은 산화전위에서 비롯된다. 산화력 = 전자를 빼앗는 능력.</p>
            <p>산성: H⁺ 농도로 정의. 산화력: 산화환원전위(E°)로 정의. 독립적 개념.</p>
          </div>
        )}
      </section>

      {/* O2 vs O3 */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-blue-400 font-bold text-lg mb-4">⚖️ O₂ vs O₃ 비교</h2>
        <div className="flex gap-3 mb-4">
          {['o2', 'o3'].map(key => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                selected === key
                  ? key === 'o2' ? 'border-blue-500 bg-blue-950/50 text-blue-300' : 'border-purple-500 bg-purple-950/50 text-purple-300'
                  : 'border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              {key === 'o2' ? 'O₂' : 'O₃'}
            </button>
          ))}
        </div>

        {/* Molecule visualization */}
        <div className="h-48 bg-slate-950/50 rounded-xl flex items-center justify-center relative overflow-hidden">
          {selected === 'o2' ? (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-blue-800/60 border-2 border-blue-500 flex items-center justify-center font-bold text-blue-300 shadow-[0_0_15px_#3b82f6]">O</div>
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-6 h-0.5 bg-blue-400" />
                <div className="w-6 h-0.5 bg-blue-400" />
                <div className="text-xs text-blue-400 mt-1">이중결합</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-800/60 border-2 border-blue-500 flex items-center justify-center font-bold text-blue-300 shadow-[0_0_15px_#3b82f6]">O</div>
              <div className="absolute bottom-4 text-xs text-slate-400">안정적 · 숨쉬는 산소</div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-purple-800/60 border-2 border-purple-400 flex items-center justify-center font-bold text-purple-300 shadow-[0_0_15px_#a855f7] animate-shake"
                style={{ animation: 'shake 2s ease-in-out infinite' }}>O</div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-purple-400 rotate-12" />
                  <div className="w-14 h-14 rounded-full bg-purple-800/60 border-2 border-purple-400 flex items-center justify-center font-bold text-purple-300 shadow-[0_0_15px_#a855f7] animate-pulse-glow">O</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-purple-400 -rotate-12" />
                  <div className="w-14 h-14 rounded-full bg-purple-800/60 border-2 border-purple-400 flex items-center justify-center font-bold text-purple-300 shadow-[0_0_15px_#a855f7] animate-pulse-glow">O</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-1">V형 굽은 구조 · 반응성 높음 · 불안정</div>
            </div>
          )}
        </div>
      </section>

      {/* Acid vs Oxidation comparison */}
      <section className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-green-950/30 border border-green-700/40 rounded-xl p-4">
          <div className="text-green-300 font-bold mb-2">🧪 산성</div>
          <div className="text-xs text-slate-400 space-y-1">
            <div>• H⁺를 내놓는 성질</div>
            <div>• pH로 측정</div>
            <div>• 레몬, 식초, 위산</div>
            <div className="font-mono text-green-400">HA → H⁺ + A⁻</div>
          </div>
        </div>
        <div className="bg-red-950/30 border border-red-700/40 rounded-xl p-4">
          <div className="text-red-300 font-bold mb-2">⚡ 산화력</div>
          <div className="text-xs text-slate-400 space-y-1">
            <div>• 전자를 빼앗는 능력</div>
            <div>• 산화환원전위(E°)</div>
            <div>• 오존, H₂O₂, 불소</div>
            <div className="font-mono text-red-400">X + e⁻ → X⁻ (환원)</div>
          </div>
        </div>
      </section>

      {/* O3 danger note */}
      <div className="bg-purple-950/40 border border-purple-700/40 rounded-xl p-4 mb-6">
        <p className="text-purple-300 text-sm">
          ⚠️ 오존이 위험한 이유: 강한 산화력(E° = +2.07V)으로 호흡기 세포, DNA, 지질 등에서 전자를 빼앗아 산화 손상을 일으킨다.
          산성(H⁺ 방출)과는 다른 메커니즘이다.
        </p>
      </div>

      <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-4 mb-2">
        <p className="text-blue-300 text-sm font-medium">
          💡 한 줄 요약: 오존(O₃)은 산성이 아니라 강한 산화력 때문에 위험하다. 산성(H⁺)과 산화력(전자 빼앗기)은 다른 개념.
        </p>
      </div>

      <MiniQuiz
        question="오존(O₃)은 산성이라서 위험하다."
        answer="X"
        explanation="오존의 위험성은 강한 산화력(전자를 빼앗는 능력) 때문이다. 산성(H⁺ 농도)과는 다른 성질이다."
      />
    </ModuleLayout>
  )
}
