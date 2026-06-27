import { useState } from 'react'

const CARDS = [
  { num: 1, icon: '⚛️', title: '전자가 핵심', text: '전자는 결합과 반응성을 결정한다. 전자를 잃으면 양이온(+), 얻으면 음이온(−).', color: 'cyan' },
  { num: 2, icon: '⚡', title: 'H⁺ = 양성자', text: 'H⁺는 수소가 전자를 잃은 상태, 사실상 양성자에 가깝다. 수소가 사라진 것이 아니다.', color: 'blue' },
  { num: 3, icon: '🛡️', title: 'H⁻ = 전자 2개', text: 'H⁻는 전자를 하나 더 얻은 수소. 전자 2개를 가진 음이온이다.', color: 'blue' },
  { num: 4, icon: '🍋', title: '산성 = H⁺ 방출', text: '산성은 주로 H⁺를 내놓는 성질이다. 산소가 많다는 뜻이 아니다.', color: 'green' },
  { num: 5, icon: '🔗', title: '-COOH: 화학 커넥터', text: '-COOH(카복실기)는 지방산·아미노산·고분자에서 중요한 화학 커넥터다. pH에 따라 H⁺를 붙이거나 내놓는다.', color: 'green' },
  { num: 6, icon: '🍊', title: '비타민 C: 전자 보호자', text: '비타민 C는 전자를 내주어 활성산소를 안정화한다. 항산화제 = 전자를 잘 나눠주는 보호자.', color: 'yellow' },
  { num: 7, icon: '🧈', title: '지방: 고밀도 배터리', text: '지방은 고밀도 에너지 저장고(9 kcal/g)이자 세포막·호르몬 재료다. 탄수화물(4 kcal/g)보다 에너지 밀도가 2배 이상.', color: 'orange' },
  { num: 8, icon: '🌿', title: '식물: 탄소 캡처', text: '식물은 빛으로 CO₂와 물을 탄수화물과 O₂로 바꾸는 자연의 카본 캡처 장치다.', color: 'green' },
  { num: 9, icon: '☁️', title: '오존: 산화력이 핵심', text: '오존은 산성보다 강한 산화력(전자 빼앗기)이 핵심이다. 산성과 산화력은 다른 개념이다.', color: 'purple' },
  { num: 10, icon: '🌊', title: '금속: 전자 바다 + 차이', text: '금속은 전자 바다를 공유하지만, 구리와 철의 전도율(6배 차이)과 부식성은 다르다.', color: 'slate' },
]

const ENGLISH = `Today we explored how electrons, hydrogen ions, and chemical bonds explain many things from biology to materials science.

Hydrogen can exist as neutral H, positive H⁺ (a proton), or negative H⁻. Acidity means the ability to release H⁺, while oxidation is related to taking electrons. The carboxyl group -COOH acts as a chemical connector in fatty acids, amino acids, and polymer resins.

Vitamin C works as an antioxidant because it can donate electrons and stabilize reactive oxygen species (ROS). Fats are high-density energy storage molecules (9 kcal/g) and also serve as cell membrane and hormone materials.

Plants use sunlight to convert CO₂ and water into carbohydrates and oxygen, acting like natural carbon capture machines. Ozone is not mainly dangerous because of acidity, but because of its strong oxidizing power.

Metals such as copper and iron share mobile electrons (electron sea model), but copper conducts electricity about 6× better and resists corrosion differently because of its electronic structure and protective oxide layer behavior.`

const colorMap = {
  cyan: 'border-cyan-500/40 bg-cyan-950/20 hover:border-cyan-400/60',
  blue: 'border-blue-500/40 bg-blue-950/20 hover:border-blue-400/60',
  green: 'border-green-500/40 bg-green-950/20 hover:border-green-400/60',
  yellow: 'border-yellow-500/40 bg-yellow-950/20 hover:border-yellow-400/60',
  orange: 'border-orange-500/40 bg-orange-950/20 hover:border-orange-400/60',
  purple: 'border-purple-500/40 bg-purple-950/20 hover:border-purple-400/60',
  slate: 'border-slate-500/40 bg-slate-800/20 hover:border-slate-400/60',
}

const titleColorMap = {
  cyan: 'text-cyan-400', blue: 'text-blue-400', green: 'text-green-400',
  yellow: 'text-yellow-400', orange: 'text-orange-400', purple: 'text-purple-400', slate: 'text-slate-300',
}

export default function Summary({ markCompleted, navigate }) {
  const [showEnglish, setShowEnglish] = useState(false)
  const [flipped, setFlipped] = useState({})

  const toggle = (n) => setFlipped(f => ({ ...f, [n]: !f[n] }))

  markCompleted('summary')

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <span className="text-4xl">📋</span>
        <h1 className="text-3xl font-bold text-slate-100 mt-2 mb-2">전체 요약 카드</h1>
        <p className="text-slate-400 text-sm">오늘 배운 핵심 10가지 — 카드를 클릭해서 복습하세요</p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {CARDS.map(card => (
          <button
            key={card.num}
            onClick={() => toggle(card.num)}
            className={`border rounded-2xl p-4 text-left transition-all ${colorMap[card.color]} ${flipped[card.num] ? 'ring-1 ring-white/10' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{card.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-500">#{card.num}</span>
                  <span className={`font-bold text-sm ${titleColorMap[card.color]}`}>{card.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{card.text}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* English summary toggle */}
      <div className="mb-8">
        <button
          onClick={() => setShowEnglish(s => !s)}
          className="w-full py-3 border border-slate-600 text-slate-300 rounded-2xl hover:border-cyan-600 hover:text-cyan-300 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          🌏 {showEnglish ? '영어 요약 닫기' : '오늘 배운 내용 영어 요약 보기'}
        </button>
        {showEnglish && (
          <div className="mt-4 p-5 bg-slate-900/80 border border-slate-700/50 rounded-2xl">
            <h3 className="font-bold text-cyan-400 mb-3 text-sm">Today's Summary (English)</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{ENGLISH}</div>
          </div>
        )}
      </div>

      {/* Level badge */}
      <div className="bg-gradient-to-r from-cyan-950 to-purple-950 border border-cyan-700/40 rounded-3xl p-8 text-center mb-8">
        <div className="text-5xl mb-3">🧬</div>
        <h2 className="text-2xl font-extrabold text-white mb-2">학습 완료!</h2>
        <p className="text-cyan-300 font-semibold text-lg mb-1">오늘의 분자 감각 레벨</p>
        <p className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          🏆 분자 탐험가
        </p>
        <p className="text-slate-400 text-sm mt-3">
          전자에서 금속 부식까지 — 화학의 흐름을 한 줄기로 이해했어요!
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('quiz')}
          className="flex-1 py-3 border border-yellow-700/50 text-yellow-300 rounded-xl hover:border-yellow-600 transition-colors"
        >
          🏆 퀴즈 다시 풀기
        </button>
        <button
          onClick={() => navigate('map')}
          className="flex-1 py-3 bg-gradient-to-r from-cyan-700 to-purple-700 rounded-xl font-bold hover:from-cyan-600 hover:to-purple-600 transition-all"
        >
          📍 학습 지도로
        </button>
      </div>
    </div>
  )
}
