import { useState, useEffect } from 'react'
import { FileText, Users, Headset, UserPlus, Activity, LayoutDashboard, UserCog } from 'lucide-react'
import TopBar from './components/TopBar.jsx'
import OverviewModule from './components/OverviewModule.jsx'
import DocumentModule from './components/DocumentModule.jsx'
import TalentManagementModule from './components/TalentManagementModule.jsx'
import AdminServicesModule from './components/AdminServicesModule.jsx'
import OnboardingModule from './components/OnboardingModule.jsx'
import WorkforceInsightsModule from './components/WorkforceInsightsModule.jsx'
import HiringModule from './components/HiringModule.jsx'
import { getDocuments } from './data/documentStore.js'

const accentVar = { white: 'var(--white)', gold: 'var(--gold)', magenta: 'var(--magenta)', blue: 'var(--blue)', green: 'var(--green)', amber: '#fbbf24', green2: '#16a34a' }
const accentTint = {
  white: 'rgba(255,255,255,0.08)',
  gold: 'rgba(245,158,11,0.1)',
  magenta: 'rgba(184,68,128,0.1)',
  blue: 'rgba(59,130,246,0.1)',
  green: 'rgba(34,197,94,0.1)',
  amber: 'rgba(251,191,36,0.1)',
  green2: 'rgba(22,163,74,0.1)',
}

export default function App() {
  const [active, setActive] = useState('overview')
  const [docCount, setDocCount] = useState(0)

  useEffect(() => {
    setDocCount(getDocuments().length)
  }, [active])

  const modules = [
    { id: 'overview', label: 'Overview', Icon: LayoutDashboard, accent: 'white', badge: null },
    { id: 'document', label: 'Document', Icon: FileText, accent: 'gold', badge: docCount },
    { id: 'talent', label: 'Talent Management', Icon: Users, accent: 'magenta', badge: null },
    { id: 'workforce', label: 'Workforce Insights', Icon: Activity, accent: 'amber', badge: null },
    { id: 'onboarding', label: 'Onboarding', Icon: UserPlus, accent: 'green', badge: null },
    { id: 'hiring', label: 'Hiring', Icon: UserCog, accent: 'green2', badge: null },
    { id: 'admin', label: 'Admin Services', Icon: Headset, accent: 'blue', badge: null },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          width: 228, minWidth: 228, background: 'var(--bg2)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 10px 6px' }}>
            <div style={{
              fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase',
              letterSpacing: 0.8, padding: '4px 6px 6px', fontWeight: 600,
            }}>
              Modules
            </div>
            {modules.map(({ id, label, Icon, accent, badge }) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                    padding: '9px 8px', borderRadius: 6, border: 'none',
                    background: isActive ? accentTint[accent] : 'none',
                    color: isActive ? accentVar[accent] : 'var(--text2)',
                    fontSize: 12.5, fontWeight: isActive ? 500 : 400,
                    marginBottom: 2, textAlign: 'left', transition: 'all 0.12s',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text)' }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--text2)' }}
                >
                  <Icon size={14} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {badge > 0 && (
                    <span style={{
                      background: accentTint[accent], color: accentVar[accent],
                      fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 4,
                    }}>{badge}</span>
                  )}
                </button>
              )
            })}
          </div>

          <div style={{ marginTop: 'auto', padding: '14px 14px 16px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 10.5, color: 'var(--text3)', lineHeight: 1.6, fontFamily: 'var(--mono)' }}>
              Phase 1 — manual document upload. No connection to any live HR or payroll system.
            </p>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
          {active === 'overview' && <OverviewModule onNavigate={setActive} />}
          {active === 'document' && <DocumentModule onChange={() => setDocCount(getDocuments().length)} />}
          {active === 'talent' && <TalentManagementModule />}
          {active === 'workforce' && <WorkforceInsightsModule />}
          {active === 'onboarding' && <OnboardingModule />}
          {active === 'hiring' && <HiringModule />}
          {active === 'admin' && <AdminServicesModule />}
        </main>
      </div>
    </div>
  )
}
