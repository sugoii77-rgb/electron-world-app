import { useState } from 'react'

const QUESTIONS = [
  { q: '보어 모형에서 전자는 아무 에너지나 가질 수 있다.', a: 'X', exp: '전자는 특정 양자화된 에너지 준위에만 있을 수 있다. 아무 에너지나 가질 수 없다.' },
  { q: '전자가 높은 에너지 준위에서 낮은 준위로 내려오면 빛(광자)을 방출할 수 있다.', a: 'O', exp: '전자가 낮은 준위로 전이할 때 에너지 차이(ΔE = hν)에 해당하는 광자를 방출한다.' },
  { q: '이중 슬릿 실험에서 전자 하나는 검출될 때 파동처럼 퍼져서 나타난다.', a: 'X', exp: '전자 하나는 검출될 때 하나의 점(입자처럼)으로 나타난다. 파동성은 많은 전자의 분포에서 나타난다.' },
  { q: '많은 전자를 이중 슬릿에 쏘면 간섭 무늬가 나타날 수 있다.', a: 'O', exp: '개별 전자는 점으로 나타나지만, 많이 쌓이면 파동 간섭에 의한 줄무늬 패턴이 나타난다.' },
  { q: '불확정성 원리는 측정 장비가 나빠서 생기는 한계다.', a: 'X', exp: '불확정성 원리는 아무리 완벽한 장비를 써도 사라지지 않는 자연의 근본 원리다. 기술적 한계가 아니다.' },
  { q: '위치를 아주 정확히 알수록 운동량 불확실성은 커질 수 있다.', a: 'O', exp: 'Δx·Δp ≥ ħ/2. 위치 불확정성이 작아지면 운동량 불확정성이 커진다.' },
  { q: '양자 중첩은 단순히 우리가 결과를 모른다는 뜻과 완전히 같다.', a: 'X', exp: '양자 중첩은 측정 전 실제 양자 상태가 여러 가능성의 조합으로 표현되는 것이다. 이는 실험적으로 검증된 성질이다.' },
  { q: '측정하면 중첩 상태는 하나의 결과로 나타난다.', a: 'O', exp: '측정(파동함수 붕괴)에 의해 여러 가능성 중 하나로 결정된다.' },
  { q: '얽힘은 두 입자 사이에 강한 상관관계가 있음을 보여준다.', a: 'O', exp: '얽힌 두 입자의 측정 결과 사이에는 강한 양자 상관관계가 있다. 이는 벨 부등식 실험으로 검증됐다.' },
  { q: '얽힘만으로 빛보다 빠르게 의미 있는 정보를 보낼 수 있다.', a: 'X', exp: '얽힘의 상관관계를 이용하려면 고전 통신이 필요하다. 얽힘 자체만으로 정보를 빛보다 빠르게 전송할 수 없다.' },
  { q: '3개의 고전 비트는 한 순간에 000~111을 모두 동시에 확정값으로 가진다.', a: 'X', exp: '고전 비트 3개는 한 번에 하나의 상태(예: 010)만 가진다. 동시에 여러 상태를 갖는 것은 큐비트의 중첩이다.' },
  { q: '양자 알고리즘은 간섭을 이용해 원하는 결과의 측정 확률을 높일 수 있다.', a: 'O', exp: '양자 알고리즘(예: 그로버 알고리즘)은 간섭을 통해 정답 상태의 확률 진폭을 키운다.' },
  { q: '양자컴퓨터는 모든 문제를 무조건 한 번에 풀 수 있다.', a: 'X', exp: '양자컴퓨터는 특정 문제(암호 분석, 분자 시뮬레이션 등)에서 유리하지만, 모든 문제에 빠른 것은 아니다.' },
  { q: '큐비트는 0과 1의 중첩 상태로 표현될 수 있다.', a: 'O', exp: '큐비트 상태 |ψ⟩ = α|0⟩ + β|1⟩ 로 표현되며, 측정 전까지 0과 1의 가능성이 공존한다.' },
]

export default function QuantumQuiz() {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))

  const handle = (i, choice) => {
    if (answers[i] !== null) return
    const next = [...answers]; next[i] = choice; setAnswers(next)
  }

  const correct  = answers.filter((a, i) => a === QUESTIONS[i].a).length
  const answered = answers.filter(a => a !== null).length

  const reset = () => setAnswers(Array(QUESTIONS.length).fill(null))

  return (
    <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
      <h2 className="text-yellow-400 font-bold text-lg mb-2">🧩 양자역학 O/X 퀴즈</h2>
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
        <span>{answered}/{QUESTIONS.length} 답변 · 정답 {correct}개</span>
        {answered === QUESTIONS.length && (
          <span className={`font-bold ${correct >= 12 ? 'text-yellow-400' : correct >= 9 ? 'text-cyan-400' : 'text-slate-300'}`}>
            {correct >= 12 ? '🏆 양자 마스터!' : correct >= 9 ? '🎯 양자 감각 있음!' : '📚 복습 추천!'}
          </span>
        )}
        <button onClick={reset} className="px-3 py-1 rounded-lg border border-slate-700 text-slate-500 text-[10px] hover:border-slate-600 hover:text-slate-300 transition-colors">
          초기화
        </button>
      </div>

      <div className="space-y-3">
        {QUESTIONS.map((item, i) => {
          const ans = answers[i]
          const ok  = ans === item.a
          return (
            <div key={i} className={`border rounded-xl p-4 transition-all ${
              ans === null ? 'border-slate-700/50' :
              ok  ? 'border-purple-600/40 bg-purple-950/15' : 'border-red-600/30 bg-red-950/10'
            }`}>
              <div className="flex gap-2 mb-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[11px] font-bold">{i + 1}</span>
                <p className="text-sm text-slate-200 leading-relaxed">{item.q}</p>
              </div>
              <div className="flex gap-2">
                {['O', 'X'].map(opt => (
                  <button key={opt} onClick={() => handle(i, opt)}
                    className={`flex-1 py-2 rounded-lg font-bold text-lg border transition-all ${
                      ans === null
                        ? 'border-slate-700 text-slate-400 hover:border-purple-600/60 hover:text-white'
                        : opt === item.a ? 'border-purple-500 bg-purple-900/40 text-purple-300'
                        : opt === ans   ? 'border-red-500 bg-red-900/30 text-red-300'
                        : 'border-slate-800 text-slate-700'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
              {ans !== null && (
                <div className={`mt-2 text-xs p-2 rounded-lg leading-relaxed ${ok ? 'text-purple-300 bg-purple-950/30' : 'text-orange-300 bg-orange-950/20'}`}>
                  {ok ? '🎉 좋아! 양자 감각이 올라갔어!' : `💡 괜찮아. 이 부분이 양자역학에서 제일 헷갈리는 지점이야. 정답: ${item.a} — `}
                  {item.exp}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
