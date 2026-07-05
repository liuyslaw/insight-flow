import { Sparkles, CheckCircle } from 'lucide-react'

export default function TopBar() {
  return (
    <header style={{
      height: 52, minHeight: 52, background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14,
      position: 'relative', zIndex: 50, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'linear-gradient(135deg, #f59e0b, #B84480)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={15} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>InsightFlow</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.3 }}>by SynerGrowth</div>
        </div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 6, padding: '5px 12px',
          color: 'var(--green)', fontSize: 12, fontWeight: 500,
        }}>
          <CheckCircle size={13} />
          AI Ready
        </div>
        <div style={{
          background: 'var(--card2)', border: '1px solid var(--border)',
          borderRadius: 6, padding: '5px 12px',
          fontSize: 12, color: 'var(--text2)', fontWeight: 500,
        }}>
          Phase 1
        </div>
      </div>
    </header>
  )
}
