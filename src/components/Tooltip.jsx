import { useState } from 'react'

export default function Tooltip({ term, definition, children }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline">
      <span
        className="border-b border-dotted border-cyan-400 text-cyan-300 cursor-help"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onTouchStart={() => setShow(s => !s)}
      >
        {children || term}
      </span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-800 border border-cyan-700/50 text-slate-200 text-xs rounded-lg px-3 py-2 z-50 shadow-xl pointer-events-none">
          <strong className="text-cyan-400">{term}</strong>: {definition}
        </span>
      )}
    </span>
  )
}
