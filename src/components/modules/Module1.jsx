import { useState } from 'react'
import ModuleLayout from '../ModuleLayout'
import MiniQuiz from '../MiniQuiz'
import Tooltip from '../Tooltip'

function AtomViz({ charge }) {
  const electrons = charge === 1 ? 0 : charge === -1 ? 2 : 1
  return (
    <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
      {/* Nucleus */}
      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500 z-10 ${
        charge === 0 ? 'bg-slate-600 text-white' :
        charge === 1 ? 'bg-red-600 text-white shadow-[0_0_20px_#ef4444]' :
        'bg-blue-600 text-white shadow-[0_0_20px_#3b82f6]'
      }`}>
        {charge === 0 ? 'H' : charge === 1 ? 'H⁺' : 'H⁻'}
      </div>
      {/* Electron cloud */}
      {electrons > 0 && (
        <div className="absolute inset-0">
          <div className="absolute inset-2 rounded-full border border-cyan-500/30 animate-pulse-glow" />
          <div className="absolute top-1/2 left-1/2 animate-orbit origin-center">
            <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] -translate-x-1/2 -translate-y-1/2" />
          </div>
          {electrons > 1 && (
            <div className="absolute top-1/2 left-1/2 animate-orbit2 origin-center">
              <div className="w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_8px_#67e8f9] -translate-x-1/2 -translate-y-1/2" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Module1({ analogyMode, onNext }) {
  const [electrons, setElectrons] = useState(6)

  const chargeLabel = electrons > 6 ? `${electrons - 6 === 0 ? '' : '-'}${electrons - 6}` :
    electrons < 6 ? `+${6 - electrons}` : '0 (중성)'

  const bgColor = electrons > 6 ? 'text-blue-400' : electrons < 6 ? 'text-red-400' : 'text-green-400'

  return (
    <ModuleLayout number={1} title="원자와 전자" icon="⚛️" color="cyan" onNext={onNext} currentId="module1">
      {/* Explanation */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-cyan-400 font-bold text-lg mb-3">📖 핵심 개념</h2>
        {analogyMode ? (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>🌰 원자를 복숭아라고 생각해봐. 가운데 딱딱한 씨(핵)가 있고, 그 주변을 과육(전자구름)이 감싸고 있어.</p>
            <p>⚡ <strong className="text-cyan-300">전자</strong>는 아주 작은 에너지 운반자야. 음전하를 띠고 핵 주변을 구름처럼 감싸고 있어.</p>
            <p>🔑 전자가 얼마나 있느냐에 따라 원자가 양이온이 될지, 음이온이 될지 결정돼!</p>
          </div>
        ) : (
          <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
            <p>원자는 <Tooltip term="양성자" definition="핵 속의 양전하 입자. 원소 번호를 결정한다.">양성자</Tooltip>·<Tooltip term="중성자" definition="핵 속의 전하 없는 입자. 질량에 기여한다.">중성자</Tooltip>(핵)와 <Tooltip term="전자" definition="핵 주변을 둘러싼 음전하 입자. 화학 반응의 주역이다.">전자</Tooltip>로 구성된다.</p>
            <p>전자는 음전하(−)를 가지며, 파동함수로 기술되는 <Tooltip term="전자구름" definition="전자가 발견될 확률 분포. 특정 위치에 고정된 게 아니라 구름처럼 퍼져있다.">전자구름</Tooltip> 형태로 존재한다.</p>
            <p>전자를 잃으면 <strong className="text-red-400">양이온(+)</strong>, 얻으면 <strong className="text-blue-400">음이온(−)</strong>이 된다.</p>
          </div>
        )}
      </section>

      {/* Interaction */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-cyan-400 font-bold text-lg mb-4">🎮 직접 해보기: 탄소 원자 (전자 6개 기준)</h2>

        {/* Atom visualization */}
        <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">
          {/* Orbital rings — diameter = 2 × translateX = 100px */}
          <div className="absolute rounded-full border border-cyan-500/25" style={{ width: 100, height: 100 }} />
          <div className="absolute rounded-full border border-cyan-500/10" style={{ width: 80, height: 80 }} />
          {/* Nucleus */}
          <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center z-10 font-bold transition-all duration-500 ${
            electrons === 6 ? 'bg-slate-700 shadow-[0_0_15px_#64748b]' :
            electrons > 6 ? 'bg-blue-800 shadow-[0_0_20px_#3b82f6]' :
            'bg-red-900 shadow-[0_0_20px_#ef4444]'
          }`}>
            <span className="text-xs text-slate-300">C</span>
            <span className={`text-sm font-bold ${bgColor}`}>{electrons > 6 ? `-${electrons-6}` : electrons < 6 ? `+${6-electrons}` : '0'}</span>
          </div>
          {/* Electrons — wrapper is a zero-size point at center */}
          {Array.from({ length: Math.min(electrons, 8) }).map((_, i) => {
            const n = Math.min(electrons, 8)
            return (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 animate-orbit"
                style={{ animationDelay: `-${(i / n) * 2.5}s` }}
              >
                <div className="w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
              </div>
            )
          })}
        </div>

        <div className="text-center mb-4">
          <span className="text-slate-400 text-sm">전자 수: </span>
          <span className="text-cyan-300 font-bold text-lg">{electrons}</span>
          <span className="ml-3 text-slate-400 text-sm">전하: </span>
          <span className={`font-bold text-lg ${bgColor}`}>{chargeLabel}</span>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setElectrons(e => Math.max(3, e - 1))}
            className="px-5 py-2 bg-red-900/50 border border-red-700/50 text-red-300 rounded-xl hover:bg-red-900/70 transition-colors font-medium"
          >
            전자 제거 (−)
          </button>
          <button
            onClick={() => setElectrons(6)}
            className="px-5 py-2 bg-slate-700 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors text-sm"
          >
            초기화
          </button>
          <button
            onClick={() => setElectrons(e => Math.min(9, e + 1))}
            className="px-5 py-2 bg-blue-900/50 border border-blue-700/50 text-blue-300 rounded-xl hover:bg-blue-900/70 transition-colors font-medium"
          >
            전자 추가 (+)
          </button>
        </div>

        {electrons !== 6 && (
          <div className={`mt-4 p-3 rounded-xl text-sm text-center ${electrons > 6 ? 'bg-blue-900/30 text-blue-300' : 'bg-red-900/30 text-red-300'}`}>
            {electrons > 6
              ? `⬇️ 전자가 ${electrons - 6}개 더 많아요 → 음이온 (C${electrons-6 === 1 ? '⁻' : electrons-6+'⁻'})`
              : `⬆️ 전자가 ${6 - electrons}개 부족해요 → 양이온 (C${6-electrons === 1 ? '⁺' : 6-electrons+'⁺'})`}
          </div>
        )}
      </section>

      {/* Summary */}
      <div className="bg-cyan-950/40 border border-cyan-800/40 rounded-xl p-4 mb-2">
        <p className="text-cyan-300 text-sm font-medium">
          💡 한 줄 요약: 전자를 잃으면 양이온(+), 얻으면 음이온(−). 전자가 화학의 핵심 열쇠다.
        </p>
      </div>

      <MiniQuiz
        question="원자가 전자를 잃으면 양이온이 된다."
        answer="O"
        explanation="전자는 음전하이므로, 전자를 잃으면 양전하가 남아 양이온이 된다."
      />
    </ModuleLayout>
  )
}
