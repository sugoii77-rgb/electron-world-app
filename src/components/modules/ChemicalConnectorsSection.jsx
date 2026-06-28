import { useState } from 'react'

// ── 데이터 ────────────────────────────────────────────────────
export const CONNECTORS = [
  {
    id: 'oh',
    emoji: '💧',
    name: '수산기 / 하이드록실기',
    formula: '-OH',
    color: '#22d3ee',
    desc: '물과 잘 어울리고 수소결합을 만들며, 에스터나 우레탄 결합에도 참여한다.',
    uses: '당, 셀룰로오스, 폴리올, 에폭시 경화 후 구조',
    analogy: '물과 악수 잘하는 손',
    reaction: '-OH + -COOH → -COO- + H₂O (에스터 결합)',
  },
  {
    id: 'nh2',
    emoji: '🔗',
    name: '아민기',
    formula: '-NH₂ / -NH-',
    color: '#a855f7',
    desc: '질소의 전자쌍 때문에 반응성이 좋고, 에폭시 고리를 열거나 -COOH와 결합해 아마이드 결합을 만든다.',
    uses: '아미노산, 단백질, 아민계 경화제, 나일론',
    analogy: '에폭시 고리 따개이자 분자 재봉사',
    reaction: '-NH₂ + -COOH → -CONH- + H₂O (아마이드 결합)',
  },
  {
    id: 'epoxy',
    emoji: '🔒',
    name: '에폭시기',
    formula: '▽C-O-C▽',
    color: '#f97316',
    desc: '산소 1개와 탄소 2개가 만든 긴장된 삼각 고리 구조. 아민이나 산과 만나면 고리가 열리며 경화 네트워크를 만든다.',
    uses: '에폭시 레진, 접착제, 복합재 매트릭스',
    analogy: '반응 대기 중인 스프링 클립',
    reaction: 'Epoxide + -NH₂ → -C(OH)-C-NH- (고리 개환)',
  },
  {
    id: 'carbonyl',
    emoji: '⚡',
    name: '카보닐기',
    formula: 'C=O',
    color: '#eab308',
    desc: '산소가 전자를 강하게 끌어당겨 탄소가 반응 중심이 된다. 알데하이드·케톤·카복실산·에스터·아마이드 모두 포함.',
    uses: '알데하이드, 케톤, 카복실산, 에스터, 아마이드',
    analogy: '전자를 끌어당기는 반응 허브',
    reaction: 'C=O의 탄소(δ+)는 친핵성 공격 받기 좋은 위치',
  },
  {
    id: 'ester',
    emoji: '🔩',
    name: '에스터기',
    formula: '-COO-',
    color: '#10b981',
    desc: '-COOH와 -OH가 결합하면서 생기는 연결부. 지방과 폴리에스터의 핵심 결합이다.',
    uses: '중성지방, PET, 폴리에스터 수지',
    analogy: '유기물 세계의 연결 리벳',
    reaction: '-COOH + HO- → -COO- + H₂O',
  },
  {
    id: 'amide',
    emoji: '🧵',
    name: '아마이드기',
    formula: '-CONH-',
    color: '#6366f1',
    desc: '-COOH와 -NH₂가 결합하면서 생기는 강한 연결부. 단백질과 나일론의 핵심 결합이다.',
    uses: '단백질 펩타이드 결합, 나일론, 케블라',
    analogy: '튼튼한 분자 박음질',
    reaction: '-COOH + H₂N- → -CO-NH- + H₂O',
  },
  {
    id: 'nco',
    emoji: '🤝',
    name: '이소시아네이트기',
    formula: '-NCO',
    color: '#f43f5e',
    desc: '-OH와 만나 우레탄 결합을 만들며, 반응성이 매우 큰 작용기다.',
    uses: '폴리우레탄, 폼, 코팅, 접착제',
    analogy: 'OH만 보면 바로 계약하는 적극적인 영업사원',
    reaction: '-NCO + HO- → -NH-COO- (우레탄 결합)',
  },
  {
    id: 'sh',
    emoji: '🔧',
    name: '티올기',
    formula: '-SH',
    color: '#84cc16',
    desc: '황이 포함된 작용기로 금속 표면, 고무 가교, 단백질 구조 형성에 중요하다.',
    uses: '고무 가황, 단백질 시스테인, 금 표면 결합',
    analogy: '금속과 고무 쪽의 개성 강한 커넥터',
    reaction: '-SH + -SH → -S-S- + 2H (이황화 결합)',
  },
  {
    id: 'silane',
    emoji: '🌉',
    name: '실란기',
    formula: '-Si(OR)₃',
    color: '#06b6d4',
    desc: '유리, 금속산화물, 실리카 같은 무기물 표면과 유기 레진을 이어주는 커플링 작용기.',
    uses: '실란 커플링제, 유리섬유 복합재, 코팅, 프라이머',
    analogy: '유기물과 무기물 사이의 통역사',
    reaction: '-Si(OR)₃ + H₂O → -Si(OH)₃ → 무기 표면과 Si-O-Si 결합',
  },
  {
    id: 'phosphate',
    emoji: '🔋',
    name: '인산기',
    formula: '-PO₄H₂ / -PO₄²⁻',
    color: '#ec4899',
    desc: '음전하를 띠기 쉽고, 생명체의 에너지 전달과 정보 저장에 핵심 역할을 한다.',
    uses: 'ATP, DNA/RNA, 인지질, 단백질 인산화',
    analogy: '생명체의 전원 플러그와 신호 스위치',
    reaction: 'ATP → ADP + Pᵢ + 에너지 (고에너지 인산 결합 절단)',
  },
]

// ── 매칭 게임 데이터 ─────────────────────────────────────────
const MATCH_PAIRS = [
  { id: 'oh',        formula: '-OH',        role: '수소결합과 물 친화성' },
  { id: 'nh2',       formula: '-NH₂',       role: '에폭시 고리 열기 / 아마이드 결합' },
  { id: 'epoxy',     formula: '에폭시기',    role: '고리 열림 경화 반응' },
  { id: 'ester',     formula: '-COO- (에스터)', role: '지방과 폴리에스터 연결부' },
  { id: 'amide',     formula: '-CONH-',     role: '단백질과 나일론의 강한 결합' },
  { id: 'nco',       formula: '-NCO',       role: '우레탄 결합' },
  { id: 'silane',    formula: '-Si(OR)₃',   role: '유기물-무기물 커플링' },
  { id: 'phosphate', formula: '-PO₄',       role: 'ATP와 DNA의 핵심 작용기' },
]

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

// ── 매칭 게임 컴포넌트 ───────────────────────────────────────
function MatchingGame() {
  const [leftItems]  = useState(() => shuffle(MATCH_PAIRS))
  const [rightItems] = useState(() => shuffle(MATCH_PAIRS))
  const [selected, setSelected]   = useState(null)   // id
  const [matched, setMatched]     = useState([])      // [id, ...]
  const [wrongPair, setWrongPair] = useState(null)    // id of wrong right click
  const [score, setScore]         = useState(0)

  const handleLeft = (id) => {
    if (matched.includes(id)) return
    setSelected(id)
    setWrongPair(null)
  }

  const handleRight = (id) => {
    if (!selected || matched.includes(id)) return
    if (selected === id) {
      // correct
      setMatched(m => [...m, id])
      setScore(s => s + 1)
      setSelected(null)
      setWrongPair(null)
    } else {
      setWrongPair(id)
      setTimeout(() => setWrongPair(null), 1200)
    }
  }

  const reset = () => {
    setSelected(null)
    setMatched([])
    setWrongPair(null)
    setScore(0)
  }

  const done = matched.length === MATCH_PAIRS.length

  return (
    <div className="bg-slate-900/60 border border-green-700/30 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-green-400 font-bold text-base">🎮 커넥터 매칭 게임</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            {score} / {MATCH_PAIRS.length} 연결
          </span>
          <button onClick={reset} className="text-xs px-3 py-1 border border-slate-600 text-slate-400 rounded-lg hover:text-slate-200 hover:border-slate-400 transition-colors">
            리셋
          </button>
        </div>
      </div>

      {!done ? (
        <>
          <p className="text-xs text-slate-500 mb-4">
            왼쪽에서 작용기를 클릭 → 오른쪽에서 맞는 역할을 클릭해 연결하세요.
          </p>

          {wrongPair && (
            <div className="mb-3 p-2 bg-orange-950/50 border border-orange-700/50 rounded-xl text-xs text-orange-300 text-center">
              💡 이건 헷갈리기 쉬워. 다시 연결해보자.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Left: formulas */}
            <div className="space-y-2">
              <p className="text-xs text-slate-500 text-center mb-2">작용기</p>
              {leftItems.map(item => {
                const isMatched  = matched.includes(item.id)
                const isSelected = selected === item.id
                const conn = CONNECTORS.find(c => c.id === item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLeft(item.id)}
                    disabled={isMatched}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all text-left ${
                      isMatched
                        ? 'border-green-600/50 bg-green-950/30 text-green-400 cursor-default'
                        : isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300 scale-[1.02]'
                          : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white hover:scale-[1.01]'
                    }`}
                    style={isSelected ? { boxShadow: `0 0 10px #22d3ee60` } : isMatched ? { boxShadow: `0 0 8px ${conn?.color}40` } : {}}
                  >
                    {isMatched ? '✓ ' : ''}{item.formula}
                  </button>
                )
              })}
            </div>

            {/* Right: roles */}
            <div className="space-y-2">
              <p className="text-xs text-slate-500 text-center mb-2">역할</p>
              {rightItems.map(item => {
                const isMatched = matched.includes(item.id)
                const isWrong   = wrongPair === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleRight(item.id)}
                    disabled={isMatched}
                    className={`w-full py-2 px-3 rounded-xl text-xs border transition-all text-left ${
                      isMatched
                        ? 'border-green-600/50 bg-green-950/30 text-green-400 cursor-default'
                        : isWrong
                          ? 'border-red-500 bg-red-950/40 text-red-300 animate-shake'
                          : selected
                            ? 'border-slate-600 text-slate-300 hover:border-purple-500 hover:bg-purple-950/20 hover:text-white cursor-pointer'
                            : 'border-slate-700 text-slate-500 cursor-default'
                    }`}
                  >
                    {isMatched ? '✓ ' : ''}{item.role}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <div className="text-5xl mb-3 animate-celebrate">🏆</div>
          <p className="text-green-400 font-bold text-lg mb-1">전부 연결 성공!</p>
          <p className="text-slate-400 text-sm mb-4">작용기들의 역할을 완벽히 파악했어요.</p>
          <button onClick={reset} className="px-6 py-2 bg-green-800/50 border border-green-600 text-green-300 rounded-xl hover:bg-green-800/70 transition-colors text-sm">
            다시 풀기
          </button>
        </div>
      )}
    </div>
  )
}

// ── 메인 섹션 컴포넌트 ───────────────────────────────────────
export default function ChemicalConnectorsSection({ analogyMode }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="mt-8 space-y-6">
      {/* 섹션 헤더 */}
      <div className="border-t border-slate-700/40 pt-6">
        <h2 className="text-green-400 font-bold text-xl mb-1">
          🧩 -COOH 말고도 유명한 화학 커넥터들
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          -COOH는 대표적인 화학 커넥터지만, 분자 세계에는 다른 유명한 손잡이들도 많아.
          이 작용기들은 생체분자, 고분자, 레진, 접착제, 복합재에서 분자끼리 연결되거나
          표면에 달라붙게 만드는 핵심 포인트야.
        </p>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CONNECTORS.map(conn => {
          const isOpen = expanded === conn.id
          return (
            <button
              key={conn.id}
              onClick={() => setExpanded(isOpen ? null : conn.id)}
              className="group text-left rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 focus:outline-none"
              style={{
                borderColor: isOpen ? conn.color : '#334155',
                backgroundColor: isOpen ? conn.color + '12' : '#0f172a',
                boxShadow: isOpen ? `0 0 16px ${conn.color}40` : undefined,
              }}
              onMouseEnter={e => {
                if (!isOpen) {
                  e.currentTarget.style.borderColor = conn.color + 'aa'
                  e.currentTarget.style.boxShadow = `0 0 12px ${conn.color}30`
                }
              }}
              onMouseLeave={e => {
                if (!isOpen) {
                  e.currentTarget.style.borderColor = '#334155'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {/* Top row */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{conn.emoji}</span>
                <div>
                  <div className="font-bold text-sm text-slate-100">{conn.name}</div>
                  <div
                    className="font-mono text-xs font-bold"
                    style={{ color: conn.color }}
                  >
                    {conn.formula}
                  </div>
                </div>
              </div>

              {/* Analogy / description */}
              {analogyMode ? (
                <p className="text-xs leading-relaxed" style={{ color: conn.color + 'cc' }}>
                  💬 {conn.analogy}
                </p>
              ) : (
                <p className="text-xs text-slate-400 leading-relaxed">{conn.desc}</p>
              )}

              {/* Expanded detail */}
              {isOpen && (
                <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: conn.color + '30' }}>
                  {!analogyMode && (
                    <div className="font-mono text-xs rounded-lg px-2 py-1.5 bg-slate-900/70"
                      style={{ color: conn.color }}>
                      {conn.reaction}
                    </div>
                  )}
                  {analogyMode && (
                    <p className="text-xs text-slate-400">{conn.desc}</p>
                  )}
                  <div className="text-xs text-slate-500">
                    <span className="text-slate-400 font-medium">사용처: </span>
                    {conn.uses}
                  </div>
                </div>
              )}

              <div className="mt-2 text-right text-[10px]" style={{ color: conn.color + '70' }}>
                {isOpen ? '▲ 닫기' : '▼ 더보기'}
              </div>
            </button>
          )
        })}
      </div>

      {/* 매칭 게임 */}
      <MatchingGame />

      {/* 핵심 정리 카드 */}
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: 'linear-gradient(135deg, #052e16 0%, #0f172a 50%, #1e1b4b 100%)',
          borderColor: '#22c55e60',
          boxShadow: '0 0 20px #22c55e20',
        }}
      >
        <h3 className="text-green-400 font-bold text-base mb-3">📌 핵심 정리</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          <strong className="text-green-300">-COOH</strong>가 대표적인 화학 커넥터라면,{' '}
          <strong className="text-cyan-300">-OH</strong>,{' '}
          <strong className="text-purple-300">-NH₂</strong>,{' '}
          <strong className="text-orange-300">에폭시기</strong>,{' '}
          <strong className="text-red-300">-NCO</strong>,{' '}
          <strong className="text-sky-300">실란기</strong>,{' '}
          <strong className="text-lime-300">-SH</strong>,{' '}
          <strong className="text-pink-300">인산기</strong>{' '}
          등은 각 분야에서 자주 쓰이는 유명한 분자 손잡이다.
        </p>
        <p className="text-slate-400 text-sm mt-3 italic">
          "생명체든 레진이든 복합재든, 결국 분자 세계는 <span className="text-green-300 not-italic font-bold">'누가 누구와 어떻게 손잡느냐'</span>의 게임이다."
        </p>
      </div>
    </div>
  )
}
