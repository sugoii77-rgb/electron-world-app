import { useState, useEffect } from 'react'
import './index.css'
import Home from './components/Home'
import LearningMap from './components/LearningMap'
import Module1 from './components/modules/Module1'
import Module2 from './components/modules/Module2'
import Module3 from './components/modules/Module3'
import Module4 from './components/modules/Module4'
import Module5 from './components/modules/Module5'
import Module6 from './components/modules/Module6'
import Module7 from './components/modules/Module7'
import Module8 from './components/modules/Module8'
import Module9 from './components/modules/Module9'
import Module10 from './components/modules/Module10'
import Quiz from './components/Quiz'
import Summary from './components/Summary'
import NavBar from './components/NavBar'

const MODULE_ORDER = ['home','map','module1','module2','module3','module4','module5','module6','module7','module8','module9','module10','quiz','summary']
const MODULE_PAGES = ['module1','module2','module3','module4','module5','module6','module7','module8','module9','module10']

export default function App() {
  const [page, setPage] = useState('home')
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ew_completed') || '[]') } catch { return [] }
  })
  const [analogyMode, setAnalogyMode] = useState(true)

  useEffect(() => {
    localStorage.setItem('ew_completed', JSON.stringify(completed))
  }, [completed])

  const markCompleted = (id) => {
    setCompleted(prev => prev.includes(id) ? prev : [...prev, id])
  }

  const navigate = (dest) => {
    setPage(dest)
    window.scrollTo(0, 0)
  }

  const goNext = (current) => {
    const idx = MODULE_ORDER.indexOf(current)
    if (idx >= 0 && idx < MODULE_ORDER.length - 1) {
      markCompleted(current)
      navigate(MODULE_ORDER[idx + 1])
    }
  }

  const progress = MODULE_PAGES.filter(m => completed.includes(m)).length
  const progressPct = Math.round((progress / MODULE_PAGES.length) * 100)

  const sharedProps = { analogyMode, setAnalogyMode, onNext: goNext, navigate, markCompleted, completed }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-slate-100">
      {page !== 'home' && (
        <NavBar
          currentPage={page}
          completed={completed}
          navigate={navigate}
          analogyMode={analogyMode}
          setAnalogyMode={setAnalogyMode}
          progress={progressPct}
        />
      )}
      <main>
        {page === 'home'     && <Home onStart={() => navigate('map')} />}
        {page === 'map'      && <LearningMap completed={completed} navigate={navigate} />}
        {page === 'module1'  && <Module1  {...sharedProps} />}
        {page === 'module2'  && <Module2  {...sharedProps} />}
        {page === 'module3'  && <Module3  {...sharedProps} />}
        {page === 'module4'  && <Module4  {...sharedProps} />}
        {page === 'module5'  && <Module5  {...sharedProps} />}
        {page === 'module6'  && <Module6  {...sharedProps} />}
        {page === 'module7'  && <Module7  {...sharedProps} />}
        {page === 'module8'  && <Module8  {...sharedProps} />}
        {page === 'module9'  && <Module9  {...sharedProps} />}
        {page === 'module10' && <Module10 {...sharedProps} />}
        {page === 'quiz'     && <Quiz     {...sharedProps} />}
        {page === 'summary'  && <Summary  {...sharedProps} />}
      </main>
    </div>
  )
}
