import { useState, useEffect, useRef } from 'react'

const STATES_3BIT = ['000','001','010','011','100','101','110','111']

export default function QuantumComputerSection({ analogyMode }) {
  const [target,   setTarget]   = useState('011')
  const [classicStep, setClassicStep] = useState(-1)
  const [classicRunning, setClassicRunning] = useState(false)
  const [classicFound, setClassicFound]     = useState(false)
  const [qPhase,   setQPhase]   = useState('idle') // idle | superpose | interfere | measure | done
  const [qFoundIdx, setQFoundIdx] = useState(null)
  const classicRef = useRef(null)

  const reset = () => {
    if (classicRef.current) clearInterval(classicRef.current)
    setClassicStep(-1); setClassicRunning(false); setClassicFound(false)
    setQPhase('idle'); setQFoundIdx(null)
  }

  const runClassic = () => {
    if (classicRunning) return
    reset()
    setClassicRunning(true)
    let step = 0
    classicRef.current = setInterval(() => {
      setClassicStep(step)
      if (STATES_3BIT[step] === target) {
        setClassicFound(true)
        setClassicRunning(false)
        clearInterval(classicRef.current)
        return
      }
      step++
      if (step >= STATES_3BIT.length) {
        setClassicRunning(false)
        clearInterval(classicRef.current)
      }
    }, 600)
  }

  const runQuantum = () => {
    if (qPhase !== 'idle') return
    setClassicStep(-1); setClassicFound(false)
    setQPhase('superpose')
    setTimeout(() => setQPhase('interfere'), 1200)
    setTimeout(() => setQPhase('measure'),   2400)
    setTimeout(() => {
      setQFoundIdx(STATES_3BIT.indexOf(target))
      setQPhase('done')
    }, 3200)
  }

  useEffect(() => () => { if (classicRef.current) clearInterval(classicRef.current) }, [])

  const targetIdx = STATES_3BIT.indexOf(target)

  return (
    <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
      <h2 className="text-cyan-400 font-bold text-lg mb-1">💻 양자 컴퓨터의 원리</h2>
      <p className="text-slate-400 text-xs mb-1">
        {analogyMode
          ? '고전 컴퓨터는 문을 하나씩 열어보고, 양자컴퓨터는 여러 가능성의 파동을 겹친 뒤 정답 쪽 파동을 키우는 느낌이야!'
          : '큐비트의 중첩 상태는 여러 basis state의 확률 진폭을 포함하며, 양자 알고리즘은 간섭을 통해 원하는 결과의 측정 확률을 높인다.'}
      </p>
      <div className="text-[10px] text-yellow-600 mb-4">
        ⚠️ 교육용 단순화: 실제 양자컴퓨터는 모든 답을 한 번에 읽는 기계가 아니라, 간섭을 이용해 정답 확률을 키우는 방식으로 동작한다.
      </div>

      {/* Target selector */}
      <div className="mb-4">
        <div className="text-xs text-slate-400 mb-2">🎯 숨겨진 정답 상태 선택:</div>
        <div className="flex flex-wrap gap-1.5">
          {STATES_3BIT.map(s => (
            <button key={s} onClick={() => { setTarget(s); reset() }}
              className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-all ${target === s ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300' : 'border-slate-700 text-slate-500 hover:border-slate-600'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

        {/* Classic */}
        <div className="rounded-xl border border-slate-700/50 p-3">
          <div className="text-xs font-bold text-slate-300 mb-3">🖥 고전 컴퓨터 — 순차 탐색</div>
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {STATES_3BIT.map((s, i) => {
              const checked = classicStep >= i
              const isTarget = s === target && classicStep === i
              const found    = s === target && classicFound && classicStep === i
              return (
                <div key={s} className="rounded-lg border text-center py-1.5 font-mono text-[11px] transition-all duration-200"
                  style={{
                    borderColor: found ? '#22c55e' : isTarget ? '#ef4444' : checked ? '#475569' : '#1e293b',
                    background: found ? '#052e16' : isTarget ? '#450a0a' : checked ? '#1e293b40' : 'transparent',
                    color: found ? '#22c55e' : checked ? '#94a3b8' : '#334155',
                    boxShadow: found ? '0 0 10px #22c55e40' : isTarget ? '0 0 10px #ef444440' : 'none',
                  }}>
                  {s}
                  {found && <div className="text-[8px] text-green-400">✓</div>}
                </div>
              )
            })}
          </div>
          <div className="text-[10px] text-slate-500">
            {classicFound ? `✅ ${classicStep + 1}번 시도 만에 발견` :
             classicStep >= 0 ? `탐색 중... ${classicStep + 1}/${STATES_3BIT.length}` :
             '버튼을 눌러 탐색 시작'}
          </div>
        </div>

        {/* Quantum */}
        <div className="rounded-xl border border-purple-700/40 p-3">
          <div className="text-xs font-bold text-purple-300 mb-3">⚛️ 양자 컴퓨터 — 중첩 + 간섭</div>
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {STATES_3BIT.map((s, i) => {
              const isResult = qPhase === 'done' && i === qFoundIdx
              const superpose = qPhase === 'superpose' || qPhase === 'interfere'
              const ampUp = qPhase === 'interfere' && i === targetIdx
              return (
                <div key={s} className="rounded-lg border text-center py-1.5 font-mono text-[11px] transition-all duration-500"
                  style={{
                    borderColor: isResult ? '#a78bfa' : superpose ? '#312e81' : '#1e293b',
                    background: isResult ? '#3b0764' : ampUp ? '#2d1b6930' : superpose ? '#1e1b4b30' : 'transparent',
                    color: isResult ? '#a78bfa' : superpose ? '#6366f1' : '#334155',
                    opacity: superpose && !ampUp ? 0.6 : 1,
                    boxShadow: isResult ? '0 0 14px #a78bfa60' : ampUp ? '0 0 8px #6366f140' : 'none',
                    transform: ampUp ? 'scale(1.08)' : 'scale(1)',
                  }}>
                  {s}
                  {isResult && <div className="text-[8px] text-purple-400">✦</div>}
                </div>
              )
            })}
          </div>
          <div className="text-[10px]">
            {qPhase === 'idle'       && <span className="text-slate-500">버튼을 눌러 양자 탐색 시작</span>}
            {qPhase === 'superpose'  && <span className="text-blue-400 animate-pulse">🌀 모든 상태 동시 중첩 중...</span>}
            {qPhase === 'interfere'  && <span className="text-purple-400 animate-pulse">⚡ 간섭으로 정답 확률 증폭 중...</span>}
            {qPhase === 'measure'    && <span className="text-yellow-400 animate-pulse">🔭 측정 중...</span>}
            {qPhase === 'done'       && <span className="text-purple-300">✅ 측정 완료: <strong>{target}</strong></span>}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={runClassic} disabled={classicRunning || qPhase !== 'idle'}
          className="flex-1 py-2.5 rounded-xl border border-slate-500/60 text-slate-300 text-sm font-bold hover:border-slate-400 transition-all disabled:opacity-40">
          🖥 고전 방식 실행
        </button>
        <button onClick={runQuantum} disabled={classicRunning || qPhase !== 'idle'}
          className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #4c1d95, #1e3a5f)', border: '1px solid #7c3aed60', color: '#c4b5fd', boxShadow: '0 0 12px #7c3aed30' }}>
          ⚛️ 양자 방식 실행
        </button>
        <button onClick={reset}
          className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 text-sm hover:border-slate-500 transition-all">
          초기화
        </button>
      </div>

      {/* Concept cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {[
          { title: '중첩 연산', body: '큐비트 3개 → 8가지 상태 동시 표현. 고전 3비트는 한 번에 하나만.', color: '#22d3ee' },
          { title: '간섭', body: '정답 상태의 확률 진폭을 키우고 오답은 줄이는 양자 알고리즘의 핵심.', color: '#a78bfa' },
          { title: '유용한 분야', body: '암호화, 분자 시뮬레이션, 최적화 등 특정 문제에서 장점. 만능 마법은 아님.', color: '#f472b6' },
        ].map(c => (
          <div key={c.title} className="p-2.5 bg-slate-800/40 border border-slate-700/30 rounded-xl">
            <div className="font-bold mb-1" style={{ color: c.color }}>{c.title}</div>
            <div className="text-slate-400 leading-relaxed">{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
