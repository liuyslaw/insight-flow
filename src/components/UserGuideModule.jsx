import { BookOpen, ShieldCheck, FileText, Users, Activity, UserPlus, UserCog, Headset, LayoutDashboard, Link2 } from 'lucide-react'

const guide = [
  {
    Icon: LayoutDashboard, color: 'var(--white)', title: 'Overview',
    what: 'A snapshot of what needs attention right now — compliance alerts, document counts, and quick links into the module that needs it.',
    tip: 'Good first stop each time you open HRinsight.',
  },
  {
    Icon: ShieldCheck, color: 'var(--red)', title: 'Comply',
    what: 'Tracks foreign worker permits (PLKS), FOMEMA screening, levy payments, and EPF/SOCSO/EIS enrolment — with deadlines flagged before they become a problem.',
    tip: 'Click a summary tile (Overdue, Urgent, etc.) to filter the list to just that group.',
  },
  {
    Icon: FileText, color: 'var(--gold)', title: 'Document',
    what: 'The shared repository — policies, talent exports, onboarding templates. Talent Management and Admin Services both read from what\'s published here.',
    tip: 'New uploads start as drafts — publish them so other modules can actually use them.',
  },
  {
    Icon: Users, color: 'var(--magenta)', title: 'Talent Management',
    what: 'Workforce-wide appraisal analysis (calibration, rating movement) under Workforce Overview, or one person\'s full profile and history under Individual Lookup.',
    tip: 'Start typing a name in Individual Lookup — the list only appears once you search.',
  },
  {
    Icon: Activity, color: '#fbbf24', title: 'Workforce Insights',
    what: 'Headcount composition and trends across site, function, and demographics for a selected period.',
    tip: 'Pairs well with Talent Management\'s calibration view for the same period.',
  },
  {
    Icon: UserPlus, color: 'var(--green)', title: 'Onboarding',
    what: 'Search for a specific person (or create a new employee on the spot) and generate their onboarding plan — pulled from templates, policies, and their role data.',
    tip: 'A person created here immediately shows up in Talent Management too — one shared roster, not separate lists.',
  },
  {
    Icon: UserCog, color: '#16a34a', title: 'Hiring',
    what: 'Job postings, CV screening, interview prep, offer letters, and the pipeline board — Screened through Hired.',
    tip: 'Moving someone to "Hired" on the Pipeline adds them to the shared roster automatically — no re-entry needed in Onboarding.',
  },
  {
    Icon: Headset, color: 'var(--blue)', title: 'Admin Services',
    what: 'Employees ask HR questions directly — the assistant answers from whatever\'s published in Document, and only from that.',
    tip: 'If the assistant says it doesn\'t know, the answer usually just isn\'t published yet — check Document.',
  },
]

export default function UserGuideModule() {
  return (
    <div style={{ padding: '28px 32px', maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <BookOpen size={17} color="var(--text2)" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>User Guide</h2>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 620, marginBottom: 22 }}>
        A quick reference for what each module does — not a full manual, just enough to explore
        confidently. Everything here is Phase 1: manual document upload, no connection to a live
        HR or payroll system.
      </p>

      <div style={{
        background: 'var(--card-gradient)', border: '1px solid var(--border)', borderLeft: '3px solid var(--text3)',
        boxShadow: 'var(--shadow-card)', borderRadius: 10, padding: '16px 20px', marginBottom: 24,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <Link2 size={15} color="var(--text3)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
            The modules are connected, not separate silos
          </div>
          <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
            Hire someone in the Hiring pipeline, or add them directly in Onboarding — either way,
            they immediately become searchable everywhere else that looks people up. One shared
            list of people, not a different one per module.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {guide.map((g) => (
          <div key={g.title} style={{
            background: 'var(--card-gradient)', border: '1px solid var(--border)', borderRadius: 10,
            padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: `${g.color}18`, border: `1px solid ${g.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <g.Icon size={14} color={g.color} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{g.title}</div>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.55, marginBottom: 6 }}>{g.what}</p>
              <p style={{ fontSize: 11.5, color: g.color, lineHeight: 1.5 }}>💡 {g.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
