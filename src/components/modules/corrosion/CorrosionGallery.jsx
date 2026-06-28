import { useState } from 'react'

const TYPES = [
  {
    id: 'uniform',
    icon: '🟥',
    name: '균일부식',
    eng: 'Uniform Corrosion',
    color: '#f97316',
    def: '금속 표면 전체가 비교적 고르게 부식되는 형태.',
    where: '탄소강·주철이 습기/산에 노출될 때, 산성 용액 속 재료',
    care: '도금, 도장, 방청 코팅, 내식 합금 선택으로 대응',
    risk: '낮음~중간',
  },
  {
    id: 'pitting',
    icon: '🕳️',
    name: '점부식 (Pitting)',
    eng: 'Pitting Corrosion',
    color: '#ef4444',
    def: '표면 일부에만 작은 구멍(pit)이 집중적으로 생기는 국부 부식.',
    where: '스테인리스의 Cl⁻ 노출 환경 (해수, 수영장, 식품 가공 등)',
    care: 'Mo 함유 316 선택, 고 Cr·Ni 등급, 염화물 접촉 최소화',
    risk: '높음 (작지만 깊어서 위험)',
  },
  {
    id: 'crevice',
    icon: '🔩',
    name: '틈부식 (Crevice)',
    eng: 'Crevice Corrosion',
    color: '#f59e0b',
    def: '볼트·리벳·가스켓 등 좁은 틈 안에서 용액이 고여 생기는 집중 부식.',
    where: '틈이 있는 구조물, 패킹 주변, 나사산 접촉면',
    care: '틈이 생기지 않는 설계, 틈 실링, 올바른 체결 방법',
    risk: '중간~높음 (내부라 발견 어려움)',
  },
  {
    id: 'galvanic',
    icon: '⚡',
    name: '갈바닉 부식 (전식)',
    eng: 'Galvanic Corrosion',
    color: '#8b5cf6',
    def: '이종 금속 접촉 + 전해질 → 더 활성인 금속이 우선 산화.',
    where: '이종 금속 배관 접합부, 선박 구조물, 자동차 이종 금속 접촉부',
    care: '이종 금속 절연, 희생양극(아연 등) 사용, 동일 금속계 유지',
    risk: '높음 (작은 양극 + 큰 음극 조합 특히 위험)',
  },
  {
    id: 'igc',
    icon: '🌾',
    name: '입계부식 (IGC)',
    eng: 'Intergranular Corrosion',
    color: '#22c55e',
    def: '금속 결정립 경계를 따라 선택적으로 부식되는 형태. 오스테나이트계에서 C가 입계에 탄화크롬으로 석출되면 Cr 결핍 구역 발생 → 민감화(sensitization).',
    where: '400~800°C 범위 용접 열영향부, 부적절하게 열처리된 SS',
    care: '저탄소(L grade) 사용(304L, 316L), 안정화 강종(321, 347), 용접 후 열처리',
    risk: '높음 (용접부 내부에서 진행, 겉보기엔 정상)',
  },
  {
    id: 'scc',
    icon: '💥',
    name: '응력부식균열 (SCC)',
    eng: 'Stress Corrosion Cracking',
    color: '#a78bfa',
    def: '인장 응력 + 특정 부식 환경의 동시 작용으로 균열이 빠르게 전파되는 파손 형태.',
    where: '오스테나이트 SS + Cl⁻ + 인장 응력 (온수·해수 환경 압력용기 등)',
    care: '응력 제거 열처리, Ferritic SS 또는 Duplex SS 선택, Cl⁻ 농도 관리',
    risk: '매우 높음 (갑작스럽고 심각한 파손 가능)',
  },
]

export default function CorrosionGallery() {
  const [open, setOpen] = useState(null)

  return (
    <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-5">
      <h2 className="text-slate-100 font-bold text-lg mb-1">📚 대표 부식 형태 갤러리</h2>
      <p className="text-slate-500 text-xs mb-4">카드를 클릭하면 상세 설명이 펼쳐집니다.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TYPES.map(t => (
          <div key={t.id}>
            <button onClick={() => setOpen(open === t.id ? null : t.id)}
              className={`w-full rounded-xl border p-3 text-left transition-all hover:scale-[1.02] ${open === t.id ? 'scale-[1.02]' : ''}`}
              style={{ borderColor: open === t.id ? t.color : '#334155', backgroundColor: open === t.id ? t.color + '15' : '#0f172a', boxShadow: open === t.id ? `0 0 12px ${t.color}40` : 'none' }}>
              <div className="text-2xl mb-1">{t.icon}</div>
              <div className="font-bold text-sm" style={{ color: t.color }}>{t.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{t.eng}</div>
              <div className={`mt-1.5 text-[10px] px-1.5 py-0.5 rounded-full inline-block ${
                t.risk.includes('매우') ? 'bg-red-950/60 text-red-400' :
                t.risk.includes('높음') ? 'bg-orange-950/60 text-orange-400' :
                'bg-yellow-950/60 text-yellow-400'
              }`}>
                위험: {t.risk}
              </div>
            </button>

            {open === t.id && (
              <div className="mt-1 rounded-xl border p-3 text-xs space-y-2 transition-all"
                style={{ borderColor: t.color + '40', backgroundColor: t.color + '08' }}>
                <p className="text-slate-300 leading-relaxed">{t.def}</p>
                <div><span className="text-slate-500 font-medium">발생 위치: </span><span className="text-slate-400">{t.where}</span></div>
                <div><span className="text-slate-500 font-medium">대응책: </span><span className="text-slate-400">{t.care}</span></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
