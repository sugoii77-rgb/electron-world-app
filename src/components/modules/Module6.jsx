import { useState } from 'react'
import ModuleLayout from '../ModuleLayout'
import MiniQuiz from '../MiniQuiz'

export default function Module6({ analogyMode, onNext }) {
  const [step, setStep] = useState(0)
  // 0: idle, 1: light absorbed, 2: electron excited, 3: ATP made, 4: glucose made

  const steps = [
    { label: '빛 흡수', desc: '엽록소가 태양빛을 흡수한다', icon: '☀️' },
    { label: '전자 들뜸', desc: '전자가 고에너지 상태로 올라간다', icon: '⚡' },
    { label: 'ATP 생성', desc: '들뜬 전자가 전자전달계를 통해 ATP를 충전한다', icon: '🔋' },
    { label: '탄수화물 합성', desc: 'CO₂와 H₂O가 포도당(C₆H₁₂O₆)과 O₂로 변환된다', icon: '🌿' },
  ]

  return (
    <ModuleLayout number={6} title="광합성과 탄소 포집" icon="🌿" color="green" onNext={onNext} currentId="module6">
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-green-400 font-bold text-lg mb-3">📖 핵심 개념</h2>
        {analogyMode ? (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>🏭 식물은 자연의 탄소 포집 공장이야! CO₂와 물을 먹고, 태양빛을 이용해 탄수화물과 산소를 만들어.</p>
            <p>⚡ 엽록소 전자가 빛을 받으면 에너지가 올라가 (마치 배터리가 충전되는 것처럼!)</p>
            <p>🔑 중요한 점: 전자의 +/- 부호가 바뀌는 게 아니야. <strong className="text-green-300">에너지 상태</strong>가 올라가는 거야!</p>
            <p>그 에너지로 CO₂를 탄수화물로 "되감는" 것이 광합성의 핵심이야.</p>
          </div>
        ) : (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>광합성: 6CO₂ + 6H₂O + 빛에너지 → C₆H₁₂O₆ + 6O₂</p>
            <p><strong className="text-green-300">명반응</strong>: 엽록소 전자가 광자를 흡수해 들뜬 상태가 됨 → 전자전달계(ETC)를 통해 ATP와 NADPH 생성.</p>
            <p><strong className="text-green-300">캘빈 회로</strong>: ATP와 NADPH를 이용해 CO₂를 고정, 포도당으로 환원.</p>
            <p>전자 에너지 상태가 높아지는 것이지, 전자의 전하 부호가 바뀌지는 않는다.</p>
          </div>
        )}
      </section>

      {/* Factory diagram */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-green-400 font-bold text-lg mb-4">🏭 광합성 공장</h2>

        {/* Equation */}
        <div className="flex items-center gap-2 flex-wrap justify-center text-sm mb-6 p-3 bg-slate-950/60 rounded-xl">
          <span className="text-blue-300 font-mono">6CO₂</span>
          <span className="text-slate-500">+</span>
          <span className="text-cyan-300 font-mono">6H₂O</span>
          <span className="text-slate-500">+</span>
          <span className="text-yellow-300">☀️ 빛</span>
          <span className="text-slate-500">→</span>
          <span className="text-green-300 font-mono">C₆H₁₂O₆</span>
          <span className="text-slate-500">+</span>
          <span className="text-blue-400 font-mono">6O₂</span>
        </div>

        {/* Step buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i + 1)}
              className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all text-center ${
                step > i
                  ? 'border-green-500 bg-green-900/40 text-green-300'
                  : step === i
                    ? 'border-green-600 bg-green-900/20 text-green-400 ring-1 ring-green-500'
                    : 'border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="text-lg mb-1">{s.icon}</div>
              {s.label}
            </button>
          ))}
        </div>

        {/* Electron energy visualization */}
        <div className="h-48 bg-slate-950/50 rounded-xl p-4 relative overflow-hidden">
          <div className="text-xs text-slate-500 mb-2">전자 에너지 준위</div>
          <div className="absolute bottom-4 left-8 right-8 h-32 flex items-end">
            {/* Ground state */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-700">
              <span className="absolute -top-4 left-0 text-xs text-slate-500">기저 상태 (낮음)</span>
            </div>
            {/* Excited state */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-yellow-700">
              <span className="absolute -bottom-4 left-0 text-xs text-slate-500">들뜬 상태 (높음)</span>
            </div>

            {/* Electron */}
            <div
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-1000 ${
                step >= 2
                  ? 'bottom-[90%] bg-yellow-500 shadow-[0_0_20px_#eab308]'
                  : 'bottom-0 bg-cyan-600 shadow-[0_0_10px_#0891b2]'
              }`}
              style={{ left: '45%' }}
            >
              e⁻
            </div>

            {/* Arrow for step 2 */}
            {step >= 2 && (
              <div className="absolute left-[52%] bottom-0 top-0 flex flex-col justify-center">
                <div className="w-0.5 h-full bg-yellow-500/50" />
                <div className="text-yellow-400 text-xs absolute top-1/2 left-2">↑ 에너지↑</div>
              </div>
            )}
          </div>

          {/* Step description */}
          {step > 0 && (
            <div className="absolute bottom-4 left-4 right-4 bg-green-900/30 border border-green-700/40 rounded-lg p-2 text-xs text-green-300 text-center">
              {steps[step - 1].icon} {steps[step - 1].desc}
            </div>
          )}
        </div>

        <button
          onClick={() => setStep(0)}
          className="mt-3 w-full py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:text-slate-200"
        >
          초기화
        </button>
      </section>

      {/* Key insight */}
      <div className="bg-green-950/40 border border-green-700/40 rounded-xl p-4 mb-6">
        <p className="text-green-300 text-sm font-medium">
          🌍 "식물은 태양광으로 CO₂를 먹을 수 있는 탄소 덩어리(포도당)로 되감는 자연의 카본 캡처 장치다."
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4 mb-2">
        <p className="text-green-400 text-sm font-medium">
          💡 한 줄 요약: 광합성 = 빛에너지로 전자를 들뜨게 해 CO₂를 포도당으로 바꾸는 자연의 탄소 포집 + 에너지 저장 시스템.
        </p>
      </div>

      <MiniQuiz
        question="광합성에서 빛을 받은 전자는 '+' 전하로 바뀐다."
        answer="X"
        explanation="전자는 항상 음전하(−)다. 빛을 받으면 전자의 에너지 상태(에너지 준위)가 높아지는 것이지, 전하 부호가 바뀌지는 않는다."
      />
    </ModuleLayout>
  )
}
