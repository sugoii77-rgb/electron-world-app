import { useState } from 'react'

const QUESTIONS = [
  { q: 'H⁺는 수소가 전자를 잃은 상태 (사실상 양성자)다.', a: 'O', exp: 'H⁺는 양성자 1개만 남은 상태다. 전자를 잃어 양전하를 띤다.' },
  { q: 'H⁻는 전자를 2개 가진 수소다.', a: 'O', exp: 'H⁻는 양성자 1개 + 전자 2개. 헬륨과 같은 전자 배치(1s²)다.' },
  { q: '산성은 산소(O)가 많다는 뜻이다.', a: 'X', exp: '산성의 핵심은 H⁺를 내놓을 수 있는 성질이다. 산소 개수와 무관하다.' },
  { q: '-COOH는 H⁺를 내놓으면 -COO⁻가 된다.', a: 'O', exp: '카복실기(-COOH)는 염기성 환경에서 H⁺를 내놓고 -COO⁻가 된다.' },
  { q: '비타민 C는 전자를 내주어 활성산소를 안정화할 수 있다.', a: 'O', exp: '비타민 C(아스코르브산)는 전자 공여체로 활성산소를 중화하는 항산화제다.' },
  { q: '중성지방에서 "중성"은 양이온과 음이온의 중간이라는 뜻이다.', a: 'X', exp: '중성지방의 "중성"은 전기적으로 전하를 거의 띠지 않는다는 의미다.' },
  { q: '지방 1g은 탄수화물 1g보다 에너지가 많다.', a: 'O', exp: '지방: 9 kcal/g, 탄수화물: 4 kcal/g. 지방이 약 2배 이상 에너지 밀도가 높다.' },
  { q: '광합성에서 빛을 받은 전자는 전하가 + 로 바뀐다.', a: 'X', exp: '전자는 항상 음전하(−). 빛을 받으면 에너지 상태(준위)가 높아지는 것이지 전하 부호가 바뀌지 않는다.' },
  { q: '오존(O₃)은 주로 강한 산화력 때문에 위험하다.', a: 'O', exp: '오존의 위험성은 높은 산화전위(전자를 빼앗는 능력)에 있다. 산성과는 다른 개념이다.' },
  { q: '금속에서 전도 전자는 특정 원자에 고정되어 있다.', a: 'X', exp: '금속에서 전도 전자는 비국소화되어 전체 격자에 자유롭게 퍼져 있다 (전자 바다 모델).' },
  { q: '구리는 철보다 전기 전도율이 높다.', a: 'O', exp: '구리(5.96×10⁷ S/m)는 철(1.00×10⁷ S/m)보다 약 6배 전도율이 높다.' },
  { q: '철의 녹(Fe₂O₃)은 내부 부식을 효과적으로 막는 보호막이다.', a: 'X', exp: '철 녹은 다공성·취약하여 보호막 역할을 하지 못한다. 구리 산화층과 달리 내부 부식이 계속 진행된다.' },
  // ── 모듈 11 양자역학 ──
  { q: '보어 모형에서 전자는 아무 에너지나 가질 수 있다.', a: 'X', exp: '전자는 특정 양자화된 에너지 준위에만 있을 수 있다. 연속적인 에너지를 갖지 않는다.' },
  { q: '전자가 높은 에너지 준위에서 낮은 준위로 내려오면 빛(광자)을 방출할 수 있다.', a: 'O', exp: '전자가 낮은 준위로 전이할 때 에너지 차이(ΔE = hν)에 해당하는 광자를 방출한다.' },
  { q: '이중 슬릿 실험에서 전자 하나는 검출될 때 파동처럼 퍼져서 나타난다.', a: 'X', exp: '전자 하나는 검출될 때 하나의 점(입자처럼)으로 나타난다. 파동성은 많은 전자의 분포에서 드러난다.' },
  { q: '많은 전자를 이중 슬릿에 쏘면 간섭 무늬가 나타날 수 있다.', a: 'O', exp: '개별 전자는 점으로 찍히지만, 많이 쌓이면 파동 간섭에 의한 줄무늬 패턴이 나타난다.' },
  { q: '불확정성 원리는 측정 장비가 나빠서 생기는 기술적 한계다.', a: 'X', exp: '불확정성 원리(Δx·Δp ≥ ħ/2)는 아무리 완벽한 장비를 써도 사라지지 않는 자연의 근본 원리다.' },
  { q: '위치를 아주 정확히 알수록 운동량 불확실성은 커질 수 있다.', a: 'O', exp: 'Δx·Δp ≥ ħ/2. 위치 불확정성이 작아지면 운동량 불확정성이 커진다.' },
  { q: '양자 중첩은 단순히 우리가 결과를 모른다는 뜻과 완전히 같다.', a: 'X', exp: '양자 중첩은 실제 양자 상태가 여러 가능성의 조합으로 표현되는 것이다. 이는 실험적으로 검증된 성질이다.' },
  { q: '측정하면 중첩 상태는 하나의 결과로 나타난다.', a: 'O', exp: '측정(파동함수 붕괴)에 의해 여러 가능성 중 하나로 확정된다.' },
  { q: '얽힘은 두 입자 사이에 강한 양자 상관관계가 있음을 보여준다.', a: 'O', exp: '얽힌 두 입자의 측정 결과 사이에는 강한 상관관계가 있다. 벨 부등식 실험으로 검증됐다.' },
  { q: '얽힘만으로 빛보다 빠르게 의미 있는 정보를 보낼 수 있다.', a: 'X', exp: '얽힘의 상관관계를 확인하려면 고전 통신이 필요하다. 얽힘만으로는 정보를 빛보다 빠르게 전송할 수 없다.' },
  { q: '큐비트는 0과 1의 중첩 상태로 표현될 수 있다.', a: 'O', exp: '큐비트 상태 |ψ⟩ = α|0⟩ + β|1⟩로 표현되며, 측정 전까지 0과 1의 가능성이 공존한다.' },
  { q: '양자컴퓨터는 모든 문제를 무조건 한 번에 풀 수 있는 마법 기계다.', a: 'X', exp: '양자컴퓨터는 특정 문제에서 유리하지만 모든 문제에 빠른 것은 아니다. 간섭을 이용해 정답 확률을 높이는 방식이다.' },
  { q: '양자 알고리즘은 간섭을 이용해 원하는 결과의 측정 확률을 높일 수 있다.', a: 'O', exp: '그로버 알고리즘 등은 간섭을 통해 정답 상태의 확률 진폭을 키우고 오답을 줄인다.' },
  { q: '보어 원자 모형의 궤도는 현대 양자역학의 전자구름(오비탈)과 완전히 같다.', a: 'X', exp: '보어 모형은 에너지 준위 개념 이해를 위한 교육용 모델이다. 실제 전자는 오비탈(확률분포)로 설명된다.' },
]

export default function Quiz({ onNext, markCompleted }) {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)
  const [celebrating, setCelebrating] = useState(null)

  const handle = (idx, choice) => {
    if (submitted) return
    const newAns = [...answers]
    newAns[idx] = choice
    setAnswers(newAns)
    if (choice === QUESTIONS[idx].a) {
      setCelebrating(idx)
      setTimeout(() => setCelebrating(null), 800)
    }
  }

  const score = answers.filter((a, i) => a === QUESTIONS[i].a).length
  const allAnswered = answers.every(a => a !== null)

  const handleSubmit = () => {
    setSubmitted(true)
    markCompleted('quiz')
  }

  const total = QUESTIONS.length
  const level = score >= Math.floor(total * 0.9) ? '🏆 양자 마스터' : score >= Math.floor(total * 0.75) ? '🥇 분자 전문가' : score >= Math.floor(total * 0.6) ? '🥈 화학 탐험가' : '🌱 과학 새싹'

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <span className="text-4xl">🏆</span>
        <h1 className="text-3xl font-bold text-yellow-400 mt-2 mb-2">퀴즈 / 미션</h1>
        <p className="text-slate-400 text-sm">{QUESTIONS.length}문항 · O/X 형식 · 오늘 배운 내용 확인</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>답변: {answers.filter(a => a !== null).length} / {QUESTIONS.length}</span>
          {submitted && <span className="text-yellow-300">점수: {score} / {QUESTIONS.length}</span>}
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-green-500 rounded-full transition-all"
            style={{ width: `${(answers.filter(a => a !== null).length / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {QUESTIONS.map((q, i) => {
          const ans = answers[i]
          const isCorrect = ans === q.a
          const isWrong = ans !== null && !isCorrect

          return (
            <div
              key={i}
              className={`border rounded-2xl p-4 transition-all ${
                !submitted ? 'border-slate-700/50 bg-slate-900/60' :
                isCorrect ? 'border-green-600/50 bg-green-950/20' :
                isWrong ? 'border-red-600/50 bg-red-950/20' :
                'border-slate-700/50 bg-slate-900/60'
              }`}
            >
              <div className="flex gap-3 mb-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  submitted && isCorrect ? 'bg-green-600 text-white' :
                  submitted && isWrong ? 'bg-red-600 text-white' :
                  'bg-slate-700 text-slate-300'
                }`}>{i + 1}</span>
                <p className="text-sm text-slate-200 leading-relaxed">{q.q}</p>
              </div>
              <div className="flex gap-3">
                {['O', 'X'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => handle(i, opt)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-lg border transition-all ${
                      celebrating === i && opt === q.a ? 'animate-celebrate' : ''
                    } ${
                      ans === null
                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                        : opt === q.a && (submitted || ans === opt)
                          ? 'border-green-500 bg-green-900/40 text-green-300'
                          : opt === ans && opt !== q.a
                            ? 'border-red-500 bg-red-900/40 text-red-300'
                            : 'border-slate-800 bg-slate-900/30 text-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {(submitted || answers[i] !== null) && submitted && (
                <div className={`mt-2 text-xs p-2 rounded-lg ${isCorrect ? 'text-green-400 bg-green-950/30' : 'text-orange-300 bg-orange-950/30'}`}>
                  {isCorrect ? '✓ 정답! ' : '💡 정답: ' + q.a + ' — '}
                  {q.exp}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Submit */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="mt-8 w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl font-bold text-lg transition-all shadow-lg"
        >
          {allAnswered ? '채점하기 🎯' : `${QUESTIONS.length - answers.filter(a=>a!==null).length}개 더 답하세요`}
        </button>
      ) : (
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-yellow-700/40 rounded-3xl p-8">
            <div className="text-6xl mb-4">{score >= 10 ? '🏆' : score >= 7 ? '🌟' : '💪'}</div>
            <div className="text-3xl font-extrabold text-yellow-400 mb-2">{score} / {QUESTIONS.length}</div>
            <div className="text-xl font-bold text-slate-200 mb-4">{level}</div>
            <p className="text-slate-400 text-sm mb-6">
              {score === total ? '완벽해요! 모든 개념을 완전히 이해했어요!' :
               score >= Math.floor(total * 0.75) ? '훌륭해요! 핵심 개념을 잘 파악했어요.' :
               score >= Math.floor(total * 0.5) ? '좋아요! 틀린 문제를 다시 복습해봐요.' :
               '괜찮아요! 모듈을 다시 보면서 복습해봐요.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setAnswers(Array(QUESTIONS.length).fill(null)); setSubmitted(false) }}
                className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl hover:border-slate-400 transition-colors"
              >
                다시 풀기
              </button>
              <button
                onClick={() => onNext('quiz')}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-bold hover:from-cyan-500 hover:to-purple-500 transition-all"
              >
                요약 카드 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
