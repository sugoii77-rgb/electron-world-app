import { useState, useEffect, useRef } from 'react'
import ModuleLayout from '../ModuleLayout'
import MiniQuiz from '../MiniQuiz'

// ── 활성산소 종류 데이터 ──────────────────────────────────────
const ROS_LIST = [
  {
    id: 'superoxide',
    name: '슈퍼옥사이드',
    formula: 'O₂·⁻',
    icon: '💥',
    color: '#f97316',
    border: 'border-orange-500',
    glow: 'shadow-[0_0_18px_#f97316]',
    bg: 'bg-orange-950/50',
    danger: 3,
    halfLife: '마이크로초',
    source: '미토콘드리아 전자전달계 누출',
    mechanism: '전자 1개가 O₂에 추가된 상태. 불쌍한 홀전자(↑)를 채우려고 주변에서 전자를 빼앗는다.',
    unpaired: 1,
  },
  {
    id: 'hydroxyl',
    name: '하이드록실 라디칼',
    formula: 'OH·',
    icon: '☢️',
    color: '#ef4444',
    border: 'border-red-500',
    glow: 'shadow-[0_0_22px_#ef4444]',
    bg: 'bg-red-950/50',
    danger: 5,
    halfLife: '나노초',
    source: 'Fenton 반응 (Fe²⁺ + H₂O₂)',
    mechanism: '홀전자 1개. 반응성이 가장 강한 ROS. DNA·지질·단백질 가리지 않고 전자를 빼앗아 연쇄 손상.',
    unpaired: 1,
  },
  {
    id: 'h2o2',
    name: '과산화수소',
    formula: 'H₂O₂',
    icon: '⚗️',
    color: '#a855f7',
    border: 'border-purple-500',
    glow: 'shadow-[0_0_15px_#a855f7]',
    bg: 'bg-purple-950/50',
    danger: 2,
    halfLife: '분~시간',
    source: 'SOD에 의한 O₂·⁻ 불균등화',
    mechanism: '직접 산화력은 낮지만 세포막을 통과해 Fenton 반응으로 OH·를 생성. 간접적 세포 손상.',
    unpaired: 0,
  },
  {
    id: 'singlet',
    name: '싱글렛 산소',
    formula: '¹O₂',
    icon: '✨',
    color: '#eab308',
    border: 'border-yellow-500',
    glow: 'shadow-[0_0_18px_#eab308]',
    bg: 'bg-yellow-950/50',
    danger: 4,
    halfLife: '마이크로초',
    source: '광산화 반응, 광증감제',
    mechanism: '홀전자는 없지만 들뜬 에너지 상태. 전자쌍이 고에너지로 주변 분자에 에너지·전자를 전달.',
    unpaired: 0,
    excited: true,
  },
  {
    id: 'ozone',
    name: '오존',
    formula: 'O₃',
    icon: '🌫️',
    color: '#06b6d4',
    border: 'border-cyan-500',
    glow: 'shadow-[0_0_15px_#06b6d4]',
    bg: 'bg-cyan-950/50',
    danger: 4,
    halfLife: '초~분',
    source: '대기 오염, UV 조사',
    mechanism: '강한 산화전위(+2.07 V). 직접 전자를 빼앗거나 OH·를 생성해 간접 손상.',
    unpaired: 0,
  },
]

// ── 공격 타겟 데이터 ──────────────────────────────────────────
const TARGETS = [
  {
    id: 'dna',
    label: 'DNA',
    icon: '🧬',
    color: '#22c55e',
    desc: '구아닌 염기에서 전자를 빼앗음 → 8-OHdG 생성 → 돌연변이·암',
    electron: '구아닌 (G) 의 전자',
    result: '염기 손상 / 이중나선 절단',
  },
  {
    id: 'lipid',
    label: '세포막 지질',
    icon: '🧈',
    color: '#f97316',
    desc: '불포화 지방산의 C=C 이중결합에서 H·를 빼앗음 → 지질 과산화 연쇄 반응',
    electron: '불포화 지방산의 수소 원자',
    result: '지질 과산화 / 세포막 붕괴',
  },
  {
    id: 'protein',
    label: '단백질',
    icon: '🔩',
    color: '#a855f7',
    desc: '시스테인·메티오닌 황(S) 잔기에서 전자를 빼앗음 → 구조 변형·효소 불활성화',
    electron: '황(S) 잔기의 전자',
    result: '단백질 산화 / 효소 기능 상실',
  },
]

// ── 전자 흐름 캔버스 애니메이션 ──────────────────────────────
function AttackCanvas({ ros, target, active, onDone }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const centerX = W / 2

    // ROS 쪽(왼쪽), 타겟 쪽(오른쪽)
    const rosX = W * 0.22, rosY = H / 2
    const targetX = W * 0.78, targetY = H / 2

    let t = 0
    const TOTAL = 120

    // Electron particle travelling from target to ROS
    const electrons = Array.from({ length: 3 }, (_, i) => ({
      progress: -i * 0.3,
      active: false,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, W, 0)
      grad.addColorStop(0, '#1a0a00')
      grad.addColorStop(1, '#0a0020')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      const progress = t / TOTAL // 0→1

      // Draw connection line
      ctx.save()
      ctx.setLineDash([6, 4])
      ctx.strokeStyle = `rgba(239,68,68,${0.3 + progress * 0.4})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(rosX + 30, rosY)
      ctx.lineTo(targetX - 30, targetY)
      ctx.stroke()
      ctx.restore()

      // Draw ROS
      ctx.beginPath()
      ctx.arc(rosX, rosY, 28, 0, Math.PI * 2)
      ctx.fillStyle = ros.color + '33'
      ctx.fill()
      ctx.strokeStyle = ros.color
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.shadowBlur = 15
      ctx.shadowColor = ros.color
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(ros.formula, rosX, rosY)
      ctx.shadowBlur = 0

      // Hunger indicator (홀전자 wobble)
      if (ros.unpaired > 0) {
        const wobble = Math.sin(t * 0.3) * 5
        ctx.beginPath()
        ctx.arc(rosX + wobble, rosY - 34, 5, 0, Math.PI * 2)
        ctx.fillStyle = '#fbbf24'
        ctx.fill()
        ctx.fillStyle = '#fbbf24'
        ctx.font = '8px sans-serif'
        ctx.fillText('홀e⁻', rosX + wobble, rosY - 46)
      }

      // Draw target
      ctx.beginPath()
      ctx.arc(targetX, targetY, 28, 0, Math.PI * 2)
      ctx.fillStyle = target.color + '22'
      ctx.fill()
      ctx.strokeStyle = progress > 0.6 ? '#ef4444' : target.color
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.shadowBlur = progress > 0.6 ? 20 : 8
      ctx.shadowColor = progress > 0.6 ? '#ef4444' : target.color
      ctx.fillStyle = '#fff'
      ctx.font = '18px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(target.icon, targetX, targetY)
      ctx.shadowBlur = 0

      // Electrons travelling from target → ROS
      electrons.forEach((e, i) => {
        e.progress = progress - i * 0.28
        if (e.progress < 0 || e.progress > 1) return
        const ex = targetX + (rosX - targetX) * e.progress
        const ey = targetY + Math.sin(e.progress * Math.PI) * -20
        const alpha = e.progress < 0.1 ? e.progress * 10 : e.progress > 0.9 ? (1 - e.progress) * 10 : 1

        ctx.beginPath()
        ctx.arc(ex, ey, 5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34,211,238,${alpha})`
        ctx.shadowBlur = 10
        ctx.shadowColor = '#22d3ee'
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`
        ctx.font = '7px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('e⁻', ex, ey)
      })

      // Result text when done
      if (progress > 0.85) {
        const alpha = (progress - 0.85) / 0.15
        ctx.fillStyle = `rgba(239,68,68,${alpha})`
        ctx.font = `bold 11px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('⚠ ' + target.result, centerX, H - 18)
      }

      t++
      if (t <= TOTAL) {
        animRef.current = requestAnimationFrame(draw)
      } else {
        onDone?.()
      }
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [active, ros, target])

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={160}
      className="w-full rounded-xl"
    />
  )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────
export default function Module7({ analogyMode, onNext }) {
  const [selectedRos, setSelectedRos] = useState('hydroxyl')
  const [selectedTarget, setSelectedTarget] = useState('dna')
  const [attacking, setAttacking] = useState(false)
  const [attackDone, setAttackDone] = useState(false)
  const [rosView, setRosView] = useState('superoxide')

  const ros = ROS_LIST.find(r => r.id === selectedRos)
  const target = TARGETS.find(t => t.id === selectedTarget)
  const rosDetail = ROS_LIST.find(r => r.id === rosView)

  const startAttack = () => {
    setAttackDone(false)
    setAttacking(false)
    setTimeout(() => setAttacking(true), 50)
  }

  return (
    <ModuleLayout number={7} title="오존과 활성산소" icon="☁️" color="blue" onNext={onNext} currentId="module7">

      {/* ── 개념 설명 ── */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-blue-400 font-bold text-lg mb-3">📖 핵심 개념</h2>
        {analogyMode ? (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p>☢️ <strong className="text-red-300">활성산소(ROS)</strong>는 전자 배열이 불안정한 산소 화학종들의 총칭이야.</p>
            <p>😡 홀전자(짝이 없는 전자)가 있으면 "짝을 찾아라!"며 주변 분자에서 전자를 빼앗아 연쇄 손상을 일으켜.</p>
            <p>⚡ 하이드록실 라디칼(OH·)은 반응성이 가장 강해서 DNA·세포막 가리지 않고 공격해.</p>
            <p>🛡️ 항산화제는 이 전자 빼앗기를 대신 당해주는 희생 보호자야.</p>
          </div>
        ) : (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p><strong className="text-red-300">ROS(Reactive Oxygen Species)</strong>: 짝없는 홀전자(unpaired electron) 또는 고에너지 상태를 가진 산소 화학종. 산화력이 매우 높다.</p>
            <p>주요 생성: 미토콘드리아 ETC 전자 누출, Fenton 반응(Fe²⁺ + H₂O₂ → OH· + OH⁻), 광산화, 방사선.</p>
            <p>손상 메커니즘: 전자 탈취(산화) → 라디칼 연쇄 반응 → DNA 8-OHdG, 지질 과산화, 단백질 카보닐화.</p>
          </div>
        )}
      </section>

      {/* ── ROS 종류 갤러리 ── */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-blue-400 font-bold text-lg mb-4">🔬 활성산소 종류</h2>

        {/* Selector tabs */}
        <div className="flex gap-2 flex-wrap mb-4">
          {ROS_LIST.map(r => (
            <button
              key={r.id}
              onClick={() => setRosView(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                rosView === r.id
                  ? `${r.border} text-white`
                  : 'border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
              style={rosView === r.id ? { backgroundColor: r.color + '25', color: r.color } : {}}
            >
              {r.icon} {r.formula}
            </button>
          ))}
        </div>

        {/* Detail card */}
        {rosDetail && (
          <div className={`border rounded-2xl p-4 transition-all ${rosDetail.border} ${rosDetail.bg}`}>
            <div className="flex items-start gap-4">
              {/* Molecule visual */}
              <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center relative">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm border-2 animate-pulse-glow"
                  style={{
                    borderColor: rosDetail.color,
                    backgroundColor: rosDetail.color + '20',
                    boxShadow: `0 0 16px ${rosDetail.color}`,
                    color: rosDetail.color,
                  }}
                >
                  {rosDetail.formula}
                </div>
                {/* Unpaired electron indicator */}
                {rosDetail.unpaired > 0 && (
                  <div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black animate-float"
                    title="홀전자"
                  >
                    ↑
                  </div>
                )}
                {rosDetail.excited && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-300 rounded-full flex items-center justify-center text-xs font-bold text-black animate-float">
                    ★
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-white">{rosDetail.name}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-slate-800" style={{ color: rosDetail.color }}>
                    {rosDetail.formula}
                  </span>
                </div>

                {/* Danger meter */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-400 w-12">위험도</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-4 h-2 rounded-sm transition-all"
                        style={{ backgroundColor: i < rosDetail.danger ? rosDetail.color : '#1e293b' }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <div><span className="text-slate-500">반감기: </span>{rosDetail.halfLife}</div>
                  <div><span className="text-slate-500">주요 생성원: </span>{rosDetail.source}</div>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-slate-900/50 rounded-xl text-xs text-slate-300 leading-relaxed">
              ⚙️ {rosDetail.mechanism}
            </div>

            {/* Electron structure visual */}
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="text-slate-500">전자 상태:</span>
              {rosDetail.unpaired > 0 ? (
                <span className="flex items-center gap-1 text-yellow-300">
                  <span className="w-4 h-4 border border-yellow-500 rounded flex items-center justify-center">↑</span>
                  <span className="w-4 h-4 border border-slate-600 rounded" />
                  홀전자 있음 — 불안정 → 전자 강탈
                </span>
              ) : rosDetail.excited ? (
                <span className="text-yellow-300">들뜬 에너지 상태 — 고에너지 → 에너지·전자 전달</span>
              ) : (
                <span className="flex items-center gap-1 text-purple-300">
                  <span className="w-4 h-4 border border-purple-500 rounded flex items-center justify-center">↑↓</span>
                  짝전자 — 직접 탈취 대신 간접 손상 (OH· 생성)
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ── 세포 공격 메커니즘 ── */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-red-400 font-bold text-lg mb-2">⚔️ 세포 공격 메커니즘</h2>
        <p className="text-slate-400 text-xs mb-4">활성산소를 고르고, 공격 대상을 선택한 뒤 시뮬레이션을 실행해봐.</p>

        {/* ROS selector */}
        <div className="mb-3">
          <p className="text-xs text-slate-500 mb-2">① 활성산소 선택</p>
          <div className="flex gap-2 flex-wrap">
            {ROS_LIST.map(r => (
              <button
                key={r.id}
                onClick={() => { setSelectedRos(r.id); setAttacking(false); setAttackDone(false) }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  selectedRos === r.id ? `${r.border}` : 'border-slate-700 text-slate-500 hover:text-slate-300'
                }`}
                style={selectedRos === r.id ? { backgroundColor: r.color + '25', color: r.color } : {}}
              >
                {r.icon} {r.formula}
              </button>
            ))}
          </div>
        </div>

        {/* Target selector */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 mb-2">② 공격 대상 선택</p>
          <div className="flex gap-2">
            {TARGETS.map(t => (
              <button
                key={t.id}
                onClick={() => { setSelectedTarget(t.id); setAttacking(false); setAttackDone(false) }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedTarget === t.id
                    ? 'border-slate-400 text-white bg-slate-700'
                    : 'border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas animation */}
        <div className="mb-3 bg-slate-950/60 rounded-xl overflow-hidden">
          <AttackCanvas
            ros={ros}
            target={target}
            active={attacking}
            onDone={() => setAttackDone(true)}
          />
          {!attacking && !attackDone && (
            <div className="text-center py-4 text-slate-500 text-xs -mt-2">
              ↑ 시뮬레이션 실행 버튼을 눌러보세요
            </div>
          )}
        </div>

        {/* Attack detail */}
        {target && ros && (
          <div className="p-3 bg-slate-800/60 rounded-xl text-xs text-slate-300 mb-3 space-y-1">
            <div><span style={{ color: ros.color }} className="font-bold">{ros.formula}</span> → <span style={{ color: target.color }} className="font-bold">{target.icon} {target.label}</span></div>
            <div className="text-slate-400">빼앗는 것: <span className="text-cyan-300">{target.electron}</span></div>
            <div className="text-slate-400">결과: <span className="text-red-300">{target.result}</span></div>
            <div className="text-slate-300 mt-1">{target.desc}</div>
          </div>
        )}

        <button
          onClick={startAttack}
          disabled={attacking}
          className="w-full py-3 bg-gradient-to-r from-red-700 to-orange-700 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 rounded-xl font-bold text-sm transition-all"
        >
          {attacking ? '⚡ 공격 중...' : attackDone ? '🔄 다시 시뮬레이션' : '⚡ 세포 공격 시뮬레이션 실행'}
        </button>

        {attackDone && (
          <div className="mt-3 p-3 bg-red-950/40 border border-red-700/40 rounded-xl text-sm text-red-300 text-center">
            ⚠️ {ros?.name}이 {target?.label}에서 전자를 빼앗아 <strong>{target?.result}</strong>을 일으켰어요!
          </div>
        )}
      </section>

      {/* ── 연쇄 반응 도식 ── */}
      <section className="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-5 mb-6">
        <h2 className="text-orange-400 font-bold text-base mb-3">🔗 ROS 연쇄 반응 흐름</h2>
        <div className="flex flex-wrap items-center gap-1 text-xs justify-center">
          {[
            { label: 'O₂', color: '#64748b', sub: '산소' },
            { label: '→', plain: true },
            { label: 'O₂·⁻', color: '#f97316', sub: '슈퍼옥사이드' },
            { label: '→ SOD →', plain: true },
            { label: 'H₂O₂', color: '#a855f7', sub: '과산화수소' },
            { label: '+ Fe²⁺ →', plain: true },
            { label: 'OH·', color: '#ef4444', sub: '최강 라디칼' },
            { label: '→', plain: true },
            { label: '세포 손상', color: '#dc2626', sub: 'DNA/지질/단백' },
          ].map((item, i) =>
            item.plain ? (
              <span key={i} className="text-slate-500 mx-1">{item.label}</span>
            ) : (
              <div key={i} className="flex flex-col items-center">
                <span
                  className="px-2 py-1 rounded-lg font-bold font-mono"
                  style={{ backgroundColor: item.color + '25', color: item.color, border: `1px solid ${item.color}60` }}
                >
                  {item.label}
                </span>
                <span className="text-slate-600 text-[10px] mt-0.5">{item.sub}</span>
              </div>
            )
          )}
        </div>
        <p className="text-xs text-slate-500 text-center mt-3">
          SOD = 슈퍼옥사이드 디스뮤타아제 (항산화 효소) · Fenton 반응으로 가장 위험한 OH· 생성
        </p>
      </section>

      {/* ── 산성 vs 산화력 비교 ── */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-green-950/30 border border-green-700/40 rounded-xl p-4">
          <div className="text-green-300 font-bold mb-2 text-sm">🧪 산성</div>
          <div className="text-xs text-slate-400 space-y-1">
            <div>• H⁺를 내놓는 성질</div>
            <div>• pH로 측정</div>
            <div className="font-mono text-green-400 text-[11px]">HA → H⁺ + A⁻</div>
          </div>
        </div>
        <div className="bg-red-950/30 border border-red-700/40 rounded-xl p-4">
          <div className="text-red-300 font-bold mb-2 text-sm">⚡ 산화력</div>
          <div className="text-xs text-slate-400 space-y-1">
            <div>• 전자를 빼앗는 능력</div>
            <div>• 산화환원전위(E°)</div>
            <div className="font-mono text-red-400 text-[11px]">ROS + e⁻ → 안정화</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-4 mb-2">
        <p className="text-blue-300 text-sm font-medium">
          💡 한 줄 요약: ROS는 전자 배열이 불안정해서 DNA·세포막·단백질에서 전자를 빼앗고 연쇄 손상을 일으킨다. 항산화제는 이 전자를 대신 내줘서 연쇄를 끊는다.
        </p>
      </div>

      <MiniQuiz
        question="오존(O₃)은 산성이 강하기 때문에 위험하다."
        answer="X"
        explanation="오존의 위험성은 강한 산화전위(전자를 빼앗는 능력)에 있다. 산성(H⁺ 농도)과는 다른 성질이다."
      />
    </ModuleLayout>
  )
}
