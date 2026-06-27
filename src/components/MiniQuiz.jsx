import { useState } from 'react'

export default function MiniQuiz({ question, answer, explanation }) {
  const [selected, setSelected] = useState(null)
  const [celebrating, setCelebrating] = useState(false)

  const handle = (choice) => {
    if (selected !== null) return
    setSelected(choice)
    if (choice === answer) {
      setCelebrating(true)
      setTimeout(() => setCelebrating(false), 800)
    }
  }

  const isCorrect = selected === answer
  const isWrong = selected !== null && !isCorrect

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 mt-6">
      <p className="text-sm text-slate-400 mb-1">🧩 미니 퀴즈</p>
      <p className="font-medium text-slate-100 mb-4">{question}</p>
      <div className="flex gap-3">
        {['O', 'X'].map(opt => (
          <button
            key={opt}
            onClick={() => handle(opt)}
            className={`flex-1 py-3 rounded-xl font-bold text-xl transition-all ${
              selected === null
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                : opt === answer
                  ? 'bg-green-900/60 border-2 border-green-500 text-green-300'
                  : opt === selected
                    ? 'bg-red-900/60 border-2 border-red-500 text-red-300'
                    : 'bg-slate-800/40 text-slate-600'
            } ${celebrating && opt === answer ? 'animate-celebrate' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className={`mt-3 p-3 rounded-xl text-sm ${isCorrect ? 'bg-green-900/30 text-green-300' : 'bg-orange-900/30 text-orange-300'}`}>
          {isCorrect ? '🎉 정답! ' : '💡 괜찮아, 이 부분이 헷갈리기 쉬워! '}
          {explanation}
        </div>
      )}
    </div>
  )
}
