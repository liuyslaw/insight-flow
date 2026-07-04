import { useState } from 'react'
import ConsistencyModule from './components/ConsistencyModule.jsx'
import AssistantModule from './components/AssistantModule.jsx'
import AdminModule from './components/AdminModule.jsx'

const modules = [
  {
    id: 'consistency',
    number: '01',
    label: 'Job & Appraisal',
    sublabel: 'Consistency Intelligence',
    accent: 'magenta',
  },
  {
    id: 'assistant',
    number: '02',
    label: 'Employee',
    sublabel: 'Self-Service Assistant',
    accent: 'teal',
  },
  {
    id: 'admin',
    number: '03',
    label: 'Admin',
    sublabel: 'Knowledge Base',
    accent: 'gold',
  },
]

const accentText = {
  magenta: 'text-magenta',
  teal: 'text-teal',
  gold: 'text-gold',
}

const accentBg = {
  magenta: 'bg-magenta-soft text-magenta',
  teal: 'bg-teal-soft text-teal',
  gold: 'bg-gold/10 text-gold',
}

export default function App() {
  const [active, setActive] = useState('consistency')

  return (
    <div className="min-h-screen bg-ink text-text font-body flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-line bg-[#0e0e11] hidden md:flex md:flex-col">
        <div className="h-1 w-full bg-gradient-to-r from-gold via-magenta to-teal" />
        <div className="px-6 pt-7 pb-6 border-b border-line">
          <div className="font-display text-2xl text-white tracking-tight">InsightFlow</div>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-faint mt-1">
            HR Intelligence Layer
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={`w-full text-left px-3 py-3 rounded-md transition-colors group ${
                active === m.id ? 'bg-card' : 'hover:bg-card/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] font-mono w-6 shrink-0 ${
                    active === m.id ? accentText[m.accent] : 'text-text-faint'
                  }`}
                >
                  {m.number}
                </span>
                <div>
                  <div className={`text-sm leading-tight ${active === m.id ? 'text-white' : 'text-text-dim'}`}>
                    {m.label}
                  </div>
                  <div className="text-[11px] leading-tight text-text-faint">{m.sublabel}</div>
                </div>
              </div>
            </button>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-line">
          <p className="text-[11px] leading-relaxed text-text-faint font-mono">
            Phase 1 — manual document upload. No connection to Workday or any live HR system.
          </p>
          <p className="text-[10px] text-text-faint/70 mt-3">by SynerGrowth Consulting</p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-20 bg-[#0e0e11] border-b border-line">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-display text-xl text-white">InsightFlow</span>
        </div>
        <div className="flex px-2 pb-2 gap-1">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={`flex-1 text-center py-2 rounded-md text-xs font-mono uppercase tracking-wide ${
                active === m.id ? accentBg[m.accent] : 'text-text-faint'
              }`}
            >
              {m.number} · {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 px-6 md:px-10 py-8 md:py-10 mt-24 md:mt-0 max-w-5xl">
        {active === 'consistency' && <ConsistencyModule />}
        {active === 'assistant' && <AssistantModule />}
        {active === 'admin' && <AdminModule />}
      </main>
    </div>
  )
}
