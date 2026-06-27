import { useState } from 'react'
import ModuleLayout from '../ModuleLayout'
import MiniQuiz from '../MiniQuiz'

const MOLECULES = [
  {
    key: 'carb',
    icon: '🌾',
    name: '탄수화물',
    color: 'yellow',
    formula: 'C:H:O ≈ 1:2:1',
    analogy: '빠른 연료 — 즉시 태울 수 있는 장작',
    science: '단당(포도당, 과당), 이당, 다당(전분, 셀룰로스). CHO 비율이 1:2:1에 가깝다.',
    kcal: 4,
    color2: 'bg-yellow-950/40 border-yellow-700/40 text-yellow-300',
  },
  {
    key: 'fat',
    icon: '🧈',
    name: '지방',
    color: 'orange',
    formula: 'C-H 많음, O 적음',
    analogy: '고밀도 배터리 + 세포막 재료',
    science: '지방산(긴 C-H 사슬) + 글리세롤. 포화/불포화 지방산. 세포막·호르몬·에너지 저장.',
    kcal: 9,
    color2: 'bg-orange-950/40 border-orange-700/40 text-orange-300',
  },
  {
    key: 'amino',
    icon: '🧬',
    name: '아미노산',
    color: 'purple',
    formula: 'C, H, O + N (NH₂ + COOH)',
    analogy: '단백질 레고 블록',
    science: '아미노기(-NH₂)와 카복실기(-COOH)를 공통으로 가진다. R기에 따라 20가지 종류.',
    kcal: 4,
    color2: 'bg-purple-950/40 border-purple-700/40 text-purple-300',
  },
]

export default function Module5({ analogyMode, onNext }) {
  const [selected, setSelected] = useState('fat')
  const [esterAnim, setEsterAnim] = useState(false)

  const mol = MOLECULES.find(m => m.key === selected)

  return (
    <ModuleLayout number={5} title="탄수화물 · 지방 · 아미노산" icon="🧬" color="orange" onNext={onNext} currentId="module5">
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-orange-400 font-bold text-lg mb-3">📖 핵심 개념</h2>
        {analogyMode ? (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>🌾 탄수화물: 즉시 쓸 수 있는 장작. C, H, O가 거의 같은 비율.</p>
            <p>🧈 지방: 고밀도 배터리야. C-H 결합이 많아서 에너지가 많이 저장돼. 세포막·호르몬도 만들어.</p>
            <p>🧬 아미노산: 단백질 레고 블록. N(질소)이 포함된다는 게 포인트!</p>
            <p>중성지방의 "중성"은 양성·음성 사이가 아니라 <strong className="text-cyan-300">전하를 거의 띠지 않는다</strong>는 뜻이야.</p>
          </div>
        ) : (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p><strong className="text-yellow-300">탄수화물</strong>: 경험식 (CH₂O)ₙ. 포도당 C₆H₁₂O₆. 신속한 ATP 생산 기질.</p>
            <p><strong className="text-orange-300">지방(트리아실글리세롤)</strong>: 글리세롤 1분자 + 지방산 3분자가 에스터 결합. C-H 결합의 환원 상태가 높아 산화 시 에너지 다량 방출 (9 kcal/g).</p>
            <p><strong className="text-purple-300">아미노산</strong>: -NH₂(아미노기) + -COOH(카복실기) + R기. 20가지 표준 아미노산이 펩티드 결합으로 연결된다.</p>
          </div>
        )}
      </section>

      {/* Molecule selector */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <div className="flex gap-2 mb-5">
          {MOLECULES.map(m => (
            <button
              key={m.key}
              onClick={() => setSelected(m.key)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                selected === m.key ? m.color2 : 'border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              {m.icon} {m.name}
            </button>
          ))}
        </div>

        <div className={`border rounded-2xl p-4 ${mol.color2}`}>
          <div className="text-3xl mb-2 text-center">{mol.icon}</div>
          <div className="font-bold text-lg mb-1 text-center">{mol.name}</div>
          <div className="font-mono text-xs text-slate-400 text-center mb-3">{mol.formula}</div>
          <div className={`text-sm p-3 rounded-xl bg-slate-900/40 ${analogyMode ? '' : 'hidden'}`}>
            📌 {mol.analogy}
          </div>
          <div className={`text-sm p-3 rounded-xl bg-slate-900/40 text-slate-300 ${analogyMode ? 'hidden' : ''}`}>
            {mol.science}
          </div>
          <div className="mt-3 text-center">
            <span className="text-xs text-slate-400">에너지:</span>
            <span className={`ml-2 font-bold text-lg ${mol.color2.split(' ')[2]}`}>{mol.kcal} kcal/g</span>
          </div>
        </div>
      </section>

      {/* Energy comparison bar chart */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-orange-400 font-bold text-base mb-4">⚡ 1g당 에너지 비교</h2>
        {[
          { name: '탄수화물', kcal: 4, color: 'bg-yellow-500', width: '44%' },
          { name: '단백질', kcal: 4, color: 'bg-purple-500', width: '44%' },
          { name: '지방', kcal: 9, color: 'bg-orange-500', width: '100%' },
        ].map(item => (
          <div key={item.name} className="mb-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{item.name}</span>
              <span>{item.kcal} kcal/g</span>
            </div>
            <div className="h-5 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: item.width }} />
            </div>
          </div>
        ))}
        <p className="text-xs text-slate-500 mt-3">
          💡 팔굽혀펴기 1회 ≈ 0.3 kcal → 지방 1g = 팔굽혀펴기 약 30회 분량!
        </p>
      </section>

      {/* Ester bond animation */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-orange-400 font-bold text-base mb-3">🔗 에스터 결합: 지방 만들기</h2>
        <p className="text-xs text-slate-400 mb-4">글리세롤의 -OH와 지방산의 -COOH가 만나면 에스터 결합이 생기고 물(H₂O)이 빠져나간다.</p>
        <div className="flex items-center gap-2 text-sm flex-wrap justify-center">
          <span className="px-3 py-1.5 bg-green-900/40 border border-green-700/40 text-green-300 rounded-lg font-mono text-xs">글리세롤-OH</span>
          <span className="text-slate-500">+</span>
          <span className="px-3 py-1.5 bg-orange-900/40 border border-orange-700/40 text-orange-300 rounded-lg font-mono text-xs">HOOC-지방산</span>
          <span className="text-slate-500">→</span>
          <span className="px-3 py-1.5 bg-blue-900/40 border border-blue-700/40 text-blue-300 rounded-lg font-mono text-xs">에스터 결합</span>
          <span className="text-slate-500">+</span>
          <span className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${esterAnim ? 'bg-cyan-900/60 border border-cyan-500 text-cyan-300 scale-110' : 'bg-slate-800 border border-slate-700 text-slate-400'}`}>
            H₂O 💧
          </span>
        </div>
        <button
          onClick={() => { setEsterAnim(true); setTimeout(() => setEsterAnim(false), 1200) }}
          className="mt-4 w-full py-2 bg-orange-900/40 border border-orange-700/40 text-orange-300 rounded-xl text-sm hover:bg-orange-900/60 transition-colors"
        >
          반응 시뮬레이션
        </button>
        {esterAnim && (
          <div className="mt-3 text-center text-cyan-300 text-sm animate-pulse-glow">
            💧 물이 빠져나오며 에스터 결합 생성!
          </div>
        )}
      </section>

      <div className="bg-orange-950/40 border border-orange-800/40 rounded-xl p-4 mb-2">
        <p className="text-orange-300 text-sm font-medium">
          💡 한 줄 요약: 탄수화물(4kcal) = 빠른 연료, 지방(9kcal) = 고밀도 배터리·세포막 재료, 아미노산(4kcal) = 단백질 블록.
        </p>
      </div>

      <MiniQuiz
        question="중성지방에서 '중성'은 양이온도 음이온도 아닌, 전하를 거의 띠지 않는다는 의미다."
        answer="O"
        explanation="중성지방(triglyceride)의 '중성'은 전기적 중성을 뜻한다. 전하를 거의 띠지 않아 물에 잘 녹지 않고 세포 내에 저장된다."
      />
    </ModuleLayout>
  )
}
