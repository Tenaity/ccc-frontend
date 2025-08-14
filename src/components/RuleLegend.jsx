export default function RuleLegend({ shifts }) {
    return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(shifts).map(([code, def]) => (
                <span key={code} className="badge" style={{ background: def.bg }}>{code} — {def.label}</span>
            ))}
        </div>
    )
}