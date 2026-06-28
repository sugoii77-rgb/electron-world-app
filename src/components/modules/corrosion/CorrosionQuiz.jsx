const QUESTIONS = [
  { q: '철 부식에는 보통 산소와 물이 함께 있어야 빠르게 진행된다.', a: 'O', exp: '양극(Fe → Fe²⁺)과 음극(O₂ + H₂O + e⁻ → OH⁻) 반응이 모두 필요하다. 건조하거나 산소가 없으면 부식이 크게 느려진다.' },
  { q: 'NaCl은 단순히 표면을 더럽히기만 할 뿐, 부식과는 무관하다.', a: 'X', exp: 'NaCl은 Na⁺와 Cl⁻로 해리해 전해질 전도성을 높여 전기화학 반응을 가속한다. 특히 Cl⁻는 피막 손상 및 국부 부식을 촉진한다.' },
  { q: 'Cl⁻(염화이온)은 금속 표면의 수동피막을 손상시켜 국부 부식을 유도할 수 있다.', a: 'O', exp: '스테인리스의 Cr₂O₃ 피막도 Cl⁻ 농도가 높으면 국부 손상(pitting)이 발생할 수 있다. 316SS의 Mo가 이를 개선한다.' },
  { q: '갈바닉 부식은 같은 종류의 금속끼리 접촉했을 때 발생한다.', a: 'X', exp: '서로 다른 금속(이종 금속)이 전해질 속에서 접촉할 때 전위차로 인해 발생한다. 같은 금속은 전위차가 없어 갈바닉 부식이 생기지 않는다.' },
  { q: '갈바닉 부식에서 전위가 더 낮은(더 활성인) 금속이 양극이 되어 먼저 부식된다.', a: 'O', exp: '더 활성인 금속이 전자를 내놓고(산화) 용출된다. 아연이 철을 보호하는 희생양극 원리도 이 때문이다.' },
  { q: '스테인리스강은 Cr₂O₃ 수동피막 덕분에 일반강보다 내식성이 뛰어나다.', a: 'O', exp: 'Cr ≥ 10.5%에서 자연 형성되는 수 nm 두께의 Cr₂O₃ 피막이 내식성의 핵심이다. 손상되어도 산소가 있으면 재피막화된다.' },
  { q: '스테인리스강은 어떤 환경에서도 절대 부식되지 않는다.', a: 'X', exp: '스테인리스도 염화물 환경에서 점부식(pitting), 틈부식, 응력부식균열 등이 발생할 수 있다. 환경에 맞는 등급 선택이 필요하다.' },
  { q: 'Ferritic 스테인리스와 Austenitic 스테인리스는 결정 구조가 다르다.', a: 'O', exp: 'Ferritic은 BCC(체심입방), Austenitic은 FCC(면심입방) 구조다. 이 차이가 기계적 성질과 일부 내식 특성에도 영향을 준다.' },
  { q: '316 스테인리스는 304보다 염화물 환경에서 보통 더 유리하다.', a: 'O', exp: '316에는 Mo(몰리브덴) 2~3%가 추가돼 점부식·틈부식 저항이 개선된다. 이 때문에 해양·식품·의료 환경에서 316이 선택된다.' },
  { q: '모든 상황에서 Austenitic 스테인리스가 Ferritic 스테인리스보다 절대적으로 우수하다.', a: 'X', exp: '일부 Ferritic SS는 염화물 응력부식균열(SCC)에 더 강하다. Austenitic은 SCC 민감성이 높아 온수+Cl⁻ 환경에서 취약할 수 있다. 용도별 선택이 중요하다.' },
  { q: '작은 양극 면적 + 큰 음극 면적 조합은 갈바닉 부식에서 특히 위험하다.', a: 'O', exp: '전류가 작은 양극 면적에 집중되어 단위 면적당 부식 속도가 매우 빨라진다. 설계 시 이종 금속 면적비를 신경 써야 한다.' },
  { q: '304L, 316L의 "L"은 저탄소(Low Carbon)를 의미하며 용접 후 입계부식 민감성을 줄일 수 있다.', a: 'O', exp: 'C 함량이 낮으면 용접 열영향부에서 탄화크롬(Cr₂₃C₆) 석출이 억제되어 입계 Cr 결핍(민감화) 문제가 줄어든다.' },
]

import { useState } from 'react'

export default function CorrosionQuiz() {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null))

  const handle = (i, choice) => {
    if (answers[i] !== null) return
    const next = [...answers]; next[i] = choice; setAnswers(next)
  }

  const correct = answers.filter((a, i) => a === QUESTIONS[i].a).length
  const answered = answers.filter(a => a !== null).length

  return (
    <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
      <h2 className="text-yellow-400 font-bold text-lg mb-1">🧩 부식 메커니즘 O/X 퀴즈</h2>
      <div className="flex items-center gap-3 mb-4 text-xs text-slate-400">
        <span>{answered}/{QUESTIONS.length} 답변</span>
        <span>•</span>
        <span className={correct > answered * 0.7 ? 'text-green-400' : 'text-slate-400'}>
          정답 {correct}개
        </span>
        {answered === QUESTIONS.length && (
          <span className={`font-bold ${correct >= 10 ? 'text-yellow-400' : correct >= 7 ? 'text-cyan-400' : 'text-slate-300'}`}>
            {correct >= 10 ? '🏆 부식 전문가!' : correct >= 7 ? '🎯 꽤 잘 알고 있어!' : '📚 복습 추천!'}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {QUESTIONS.map((item, i) => {
          const ans = answers[i]
          const correct = ans === item.a
          return (
            <div key={i} className={`border rounded-xl p-4 transition-all ${
              ans === null ? 'border-slate-700/60' :
              correct ? 'border-green-600/40 bg-green-950/20' : 'border-red-600/30 bg-red-950/10'
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
                        ? 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                        : opt === item.a
                          ? 'border-green-500 bg-green-900/40 text-green-300'
                          : opt === ans
                            ? 'border-red-500 bg-red-900/30 text-red-300'
                            : 'border-slate-800 text-slate-700'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
              {ans !== null && (
                <div className={`mt-2 text-xs p-2 rounded-lg leading-relaxed ${correct ? 'text-green-400 bg-green-950/30' : 'text-orange-300 bg-orange-950/20'}`}>
                  {correct ? '🎉 정답! ' : `💡 정답: ${item.a} — `}{item.exp}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
