export default function MonthPicker({ ym, setYm, onGenerate }) {
    const [y, m] = ym
    return (
        <div className="toolbar">
            <input type="number" value={y} onChange={e => setYm([+e.target.value, m])} style={{ width: 100 }} />
            <input type="number" min={1} max={12} value={m} onChange={e => setYm([y, +e.target.value])} style={{ width: 80 }} />
            <button onClick={() => onGenerate(y, m)}>Generate</button>
        </div>
    )
}