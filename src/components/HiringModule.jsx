import { useState } from 'react'
import { UserCog, FileText, ScanSearch, MessagesSquare, Mail } from 'lucide-react'
import JobPostingView from './hiring/JobPostingView.jsx'
import CvScreeningView from './hiring/CvScreeningView.jsx'
import InterviewQuestionsView from './hiring/InterviewQuestionsView.jsx'
import OfferLetterView from './hiring/OfferLetterView.jsx'

const tabs = [
  { id: 'posting', label: 'Job Posting', Icon: FileText },
  { id: 'screening', label: 'CV Screening', Icon: ScanSearch },
  { id: 'questions', label: 'Interview Questions', Icon: MessagesSquare },
  { id: 'offer', label: 'Offer Letter', Icon: Mail },
]

export default function HiringModule() {
  const [tab, setTab] = useState('posting')

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <UserCog size={17} color="#16a34a" />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Hiring</h2>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 580, marginBottom: 18 }}>
        Job posting drafts, CV screening, interview prep, and offer letters — phase 1, manual and
        document-driven, same as the rest of InsightFlow. Not a replacement for an ATS.
      </p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 22, flexWrap: 'wrap' }}>
        {tabs.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              borderRadius: 7, fontSize: 12.5, fontWeight: active ? 500 : 400,
              background: active ? 'rgba(22,163,74,0.12)' : 'var(--card)',
              border: `1px solid ${active ? 'rgba(22,163,74,0.35)' : 'var(--border)'}`,
              color: active ? '#16a34a' : 'var(--text2)',
            }}>
              <Icon size={13} /> {label}
            </button>
          )
        })}
      </div>

      {tab === 'posting' && <JobPostingView />}
      {tab === 'screening' && <CvScreeningView />}
      {tab === 'questions' && <InterviewQuestionsView />}
      {tab === 'offer' && <OfferLetterView />}
    </div>
  )
}
