import { useState } from 'react'
import ConsistencyModule from './components/ConsistencyModule.jsx'
import AssistantModule from './components/AssistantModule.jsx'

export default function App() {
  const [tab, setTab] = useState('consistency')

  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl tracking-tight">InsightFlow</span>
            <span className="hidden sm:inline text-xs font-mono uppercase tracking-widest text-ink/40">
              HR Intelligence Layer
            </span>
          </div>
          <span className="text-[11px] font-mono text-ink/40">by SynerGrowth Consulting</span>
        </div>
        <nav className="max-w-6xl mx-auto px-5 flex gap-1 -mb-px">
          <TabButton active={tab === 'consistency'} onClick={() => setTab('consistency')}>
            01 · Job &amp; Appraisal Consistency
          </TabButton>
          <TabButton active={tab === 'assistant'} onClick={() => setTab('assistant')}>
            02 · Employee Self-Service
          </TabButton>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        {tab === 'consistency' ? <ConsistencyModule /> : <AssistantModule />}
      </main>

      <footer className="max-w-6xl mx-auto px-5 py-10 text-xs text-ink/40 font-mono">
        Phase 1 demo — documents are uploaded manually, no connection to Workday or any live HR system.
      </footer>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-teal text-ink'
          : 'border-transparent text-ink/45 hover:text-ink/70'
      }`}
    >
      {children}
    </button>
  )
}
