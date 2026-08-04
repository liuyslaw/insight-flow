import { useEffect, useMemo, useState } from 'react'
import { FileText, Users, Activity, UserPlus, Headset, ArrowRight, Database, Server, Bell, Link2, ShieldCheck, Building2 } from 'lucide-react'
import { getDocuments, getDocumentsByType } from '../data/documentStore.js'
import { parseTalentRecords } from '../lib/parseTalentDocs.js'

const moduleCards = [
  {
    id: 'talent', label: 'Talent Management', Icon: Users, color: 'var(--magenta)', tint: 'rgba(184,68,128,0.1)',
    desc: 'Is the job level, JD, and appraisal data internally consistent across sites?',
  },
  {
    id: 'workforce', label: 'Workforce Insights', Icon: Activity, color: '#fbbf24', tint: 'rgba(251,191,36,0.1)',
    desc: 'Does the age, gender, and tenure mix of the workforce look healthy?',
  },
  {
    id: 'onboarding', label: 'Onboarding', Icon: UserPlus, color: 'var(--green)', tint: 'rgba(34,197,94,0.1)',
    desc: 'Generate a tailored onboarding plan in seconds, from offer to Month 1.',
  },
  {
    id: 'admin', label: 'Admin Services', Icon: Headset, color: 'var(--blue)', tint: 'rgba(59,130,246,0.1)',
    desc: 'Answer generic employee HR questions instantly from the policy repository.',
  },
]

const roadmapItems = [
  { Icon: Database, title: 'Persistent database + authentication', detail: 'Move off browser-local storage so records survive across devices and users, with role-based logins (employee / manager / HR admin).' },
  { Icon: UserPlus, title: 'Live onboarding tracking', detail: 'New hires check off their own onboarding tasks as they complete them; managers see real-time progress instead of a static plan.' },
  { Icon: Bell, title: 'Notifications', detail: 'Email/Teams nudges for overdue onboarding steps or pending reviews — makes the tracking actually save time, not just display it.' },
  { Icon: Link2, title: 'Direct system integration', detail: 'Optional direct connection to Workday and other systems, once the manual-upload workflow has proven its value.' },
  { Icon: ShieldCheck, title: 'Compliance & audit logging', detail: 'Data residency handling for Singapore/EU/China, and a full audit trail of who viewed or uploaded what.' },
]

function StatCard({ label, value, accent }) {
  return (
    <div
      style={{
        background: 'var(--card-gradient)', border: '1px solid var(--border)', borderRadius: 10,
        borderTop: accent ? `2px solid ${accent}` : '1px solid var(--border)',
        padding: '16px 18px', boxShadow: 'var(--shadow-card)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
        e.currentTarget.style.borderColor = 'var(--border-strong)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'var(--shadow-card)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 700, color: accent || 'var(--text)', marginBottom: 4, letterSpacing: -0.4 }}>{value}</div>
      <div style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--text3)', lineHeight: 1.4 }}>{label}</div>
    </div>
  )
}

export default function OverviewModule({ onNavigate }) {
  const [docs, setDocs] = useState([])
  const [talentDocs, setTalentDocs] = useState([])

  useEffect(() => {
    setDocs(getDocuments())
    setTalentDocs(getDocumentsByType('talent'))
  }, [])

  const records = useMemo(
    () => parseTalentRecords(talentDocs.map((d) => d.body).join('\n\n---\n\n')),
    [talentDocs]
  )
  const latestCycle = useMemo(() => {
    const cycles = [...new Set(records.map((r) => r.appraisalCycle))].filter(Boolean)
    return cycles.length ? Math.max(...cycles) : null
  }, [records])
  const currentRecords = useMemo(
    () => records.filter((r) => r.status === 'Active' && (latestCycle == null || r.appraisalCycle === latestCycle)),
    [records, latestCycle]
  )

  const talentCount = docs.filter((d) => d.type === 'talent').length
  const policyCount = docs.filter((d) => d.type === 'policy').length
  const onboardingCount = docs.filter((d) => d.type === 'onboarding').length
  const promotionCandidates = currentRecords.filter((r) => r.rating >= 4).length
  const withDemographics = currentRecords.filter((r) => r.age != null || r.gender || r.yearsOfService != null).length
  const businessUnits = new Set(currentRecords.map((r) => r.businessUnit).filter(Boolean)).size

  const stats = [
    { label: 'Talent records (current)', value: currentRecords.length, accent: 'var(--magenta)' },
    { label: 'Promotion candidates', value: promotionCandidates, accent: 'var(--blue)' },
    { label: 'With demographic data', value: withDemographics, accent: 'var(--gold2)' },
    { label: 'Policy documents', value: policyCount, accent: 'var(--green2)' },
    { label: 'Onboarding templates', value: onboardingCount, accent: 'var(--green)' },
    { label: 'Business units covered', value: businessUnits },
  ]

  return (
    <div style={{ padding: '28px 32px', maxWidth: 960 }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(184,68,128,0.08))',
        border: '1px solid var(--border)', borderRadius: 12, padding: '26px 28px', marginBottom: 24,
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
          HRinsight — HR Intelligence Layer
        </div>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 640 }}>
          One shared document repository feeding four purpose-built views — consistency, workforce
          health, onboarding, and employee self-service. Phase 1: manual document upload, no
          connection to any live HR or payroll system.
        </p>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 26 }}>
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} accent={s.accent} />
        ))}
      </div>

      {/* Module cards */}
      <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
        Modules
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 28 }}>
        {moduleCards.map((m) => (
          <button
            key={m.id}
            onClick={() => onNavigate?.(m.id)}
            style={{
              textAlign: 'left', background: 'var(--card-gradient)', border: '1px solid var(--border)', borderRadius: 10,
              padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10,
              boxShadow: 'var(--shadow-card)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
              e.currentTarget.style.borderColor = m.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = 'var(--shadow-card)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: m.tint,
                  border: `1px solid ${m.color}33`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <m.Icon size={14} color={m.color} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{m.label}</span>
              </div>
              <ArrowRight size={13} color="var(--text3)" />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>{m.desc}</p>
          </button>
        ))}
      </div>

      {/* Roadmap */}
      <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 10 }}>
        What's Next — Phase 2
      </div>
      <div style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)', borderRadius: 10, padding: '4px 18px', boxShadow: 'var(--shadow-card)' }}>
        {roadmapItems.map((r, i) => (
          <div key={r.title} style={{
            display: 'flex', gap: 12, padding: '14px 0',
            borderBottom: i < roadmapItems.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <r.Icon size={15} color="var(--text3)" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)', marginBottom: 3 }}>{r.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text3)', lineHeight: 1.6 }}>{r.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
