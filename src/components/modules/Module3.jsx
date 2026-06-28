import { useState } from 'react'
import ModuleLayout from '../ModuleLayout'
import MiniQuiz from '../MiniQuiz'
import Tooltip from '../Tooltip'
import ChemicalConnectorsSection from './ChemicalConnectorsSection'

export default function Module3({ analogyMode, onNext }) {
  const [ph, setPh] = useState(7)
  const isAcidic = ph < 7

  return (
    <ModuleLayout number={3} title="산성과 -COOH" icon="🧪" color="green" onNext={onNext} currentId="module3">
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-green-400 font-bold text-lg mb-3">📖 핵심 개념</h2>
        {analogyMode ? (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>🍋 산성이란 뭘까? 레몬처럼 H⁺를 잘 내놓는 성질이야!</p>
            <p>🔗 <strong className="text-green-300">-COOH (카복실기)</strong>는 화학 커넥터야. 지방산, 아미노산, 고분자 수지에 모두 등장해.</p>
            <p>⚡ pH가 낮을수록(산성) H⁺를 많이 내놓아 -COO⁻가 돼. pH가 높으면(염기성) H⁺를 돌려받아 -COOH로 돌아가.</p>
            <p className="text-yellow-300">🚫 "산성 = 산소가 많다"는 오해! 핵심은 H⁺를 내놓을 수 있느냐야.</p>
          </div>
        ) : (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>산(Acid)은 <Tooltip term="브뢴스테드-로우리 산" definition="H⁺(양성자)를 내놓는 물질. 현대 산-염기 이론의 핵심.">H⁺를 내놓을 수 있는 물질</Tooltip>로 정의된다.</p>
            <p><Tooltip term="-COOH (카복실기)" definition="탄소, 두 개의 산소, 수소로 구성된 작용기. 지방산·아미노산·고분자에 핵심적으로 등장한다.">-COOH</Tooltip>는 산성 환경에서 R-COOH로, 염기성 환경에서 R-COO⁻ + H⁺로 해리된다.</p>
            <p>pH는 [H⁺] 농도의 음의 로그값이다. pH 7 = 중성, 7 이하 = 산성, 7 초과 = 염기성.</p>
          </div>
        )}
      </section>

      {/* pH Slider interaction */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-green-400 font-bold text-lg mb-4">🎮 pH 슬라이더: -COOH 해리 반응</h2>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>산성 (pH 1)</span>
            <span>중성 (pH 7)</span>
            <span>염기성 (pH 14)</span>
          </div>
          <input
            type="range" min={1} max={14} value={ph} step={0.5}
            onChange={e => setPh(Number(e.target.value))}
            className="w-full accent-green-400 cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #f97316 15%, #eab308 30%, #22c55e 50%, #3b82f6 70%, #8b5cf6 100%)`
            }}
          />
          <div className="text-center mt-2">
            <span className={`text-2xl font-bold ${ph < 7 ? 'text-red-400' : ph > 7 ? 'text-blue-400' : 'text-green-400'}`}>
              pH {ph.toFixed(1)}
            </span>
            <span className="text-slate-400 ml-2 text-sm">
              ({ph < 6 ? '산성' : ph > 8 ? '염기성' : '중성에 가까움'})
            </span>
          </div>
        </div>

        {/* Molecule visualization */}
        <div className="relative h-40 bg-slate-950/50 rounded-xl overflow-hidden flex items-center justify-center">
          {/* R group */}
          <div className="flex items-center gap-1 text-lg font-mono">
            <span className="text-slate-400 text-sm px-2 py-1 bg-slate-800 rounded">R</span>
            <span className="text-slate-500">—</span>

            {/* C=O */}
            <div className="flex flex-col items-center">
              <span className="text-orange-300 text-xs">O</span>
              <span className="text-yellow-300 font-bold">C</span>
              <span className="text-slate-500 text-xs">‖</span>
            </div>
            <span className="text-slate-500">—</span>

            {/* O-H or O- with H+ flying */}
            <div className="relative">
              <span className={`text-lg font-mono transition-all duration-500 ${isAcidic ? 'text-green-300' : 'text-blue-300'}`}>
                O{isAcidic ? 'H' : '⁻'}
              </span>

              {/* Flying H+ */}
              {!isAcidic && (
                <div
                  className="absolute -top-8 left-1/2 text-xs font-bold text-red-400 animate-float"
                  style={{ animationDuration: '1.5s' }}
                >
                  H⁺ ↑
                </div>
              )}
            </div>
          </div>

          {/* Label */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-slate-400 whitespace-nowrap">
            {isAcidic ? 'R-COOH (산성: H⁺를 붙잡고 있음)' : 'R-COO⁻ + H⁺ (염기성: H⁺를 내놓음)'}
          </div>
        </div>

        <div className={`mt-3 p-3 rounded-xl text-sm text-center transition-all ${isAcidic ? 'bg-red-950/40 text-red-300' : 'bg-blue-950/40 text-blue-300'}`}>
          {isAcidic
            ? '산성 환경: H⁺가 많아서 -COO⁻가 H⁺를 붙잡아 -COOH 유지'
            : '염기성 환경: H⁺가 부족해서 -COOH가 H⁺를 내놓아 -COO⁻가 됨'}
        </div>
      </section>

      {/* Common COOH molecules */}
      <section className="grid grid-cols-3 gap-3 mb-6">
        {[
          { name: '아세트산', formula: 'CH₃COOH', role: '식초의 신맛' },
          { name: '아미노산', formula: 'R-CH(NH₂)-COOH', role: '단백질 구성' },
          { name: '지방산', formula: 'CH₃(CH₂)ₙCOOH', role: '세포막 재료' },
        ].map(mol => (
          <div key={mol.name} className="bg-green-950/30 border border-green-800/30 rounded-xl p-3 text-center text-xs">
            <div className="font-bold text-green-300 mb-1">{mol.name}</div>
            <div className="text-slate-400 font-mono text-xs mb-1">{mol.formula}</div>
            <div className="text-slate-500">{mol.role}</div>
          </div>
        ))}
      </section>

      <div className="bg-green-950/40 border border-green-800/40 rounded-xl p-4 mb-2">
        <p className="text-green-300 text-sm font-medium">
          💡 한 줄 요약: 산성 = H⁺를 내놓는 성질. -COOH는 pH에 따라 H⁺를 붙이거나 내놓는 화학 커넥터.
        </p>
      </div>

      {/* ── 화학 커넥터 섹션 ── */}
      <ChemicalConnectorsSection analogyMode={analogyMode} />

      <MiniQuiz
        question="산성은 주로 산소(O)가 많다는 뜻이다."
        answer="X"
        explanation="산성의 핵심은 H⁺(수소 이온)를 내놓을 수 있는 성질이다. 산소 개수와는 직접 관련이 없다."
      />
    </ModuleLayout>
  )
}
