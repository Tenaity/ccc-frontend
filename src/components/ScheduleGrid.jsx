import { useMemo } from 'react'

function daysInMonth(year, month) {
    const d = new Date(year, month - 1, 1)
    const out = []
    while (d.getMonth() === month - 1) { out.push(new Date(d)); d.setDate(d.getDate() + 1) }
    return out
}

export default function ScheduleGrid({ year, month, data, shifts }) {
    const days = useMemo(() => daysInMonth(year, month), [year, month])
    const dayRows = useMemo(() => {
        const map = {}
            ; (data?.day_assignments || []).forEach(a => {
                const k = `${a.day}|${a.shift_code}`
                map[k] = map[k] || []
                map[k].push(a.staff_name)
            })
        return map
    }, [data])

    const nightMap = useMemo(() => {
        const map = {}
            ; (data?.night_assignments || []).forEach(a => {
                const k = `${a.day}|Đ`
                map[k] = map[k] || []
                map[k].push(a.staff_name)
            })
        return map
    }, [data])

    const shiftList = Object.keys(shifts).filter(k => k !== "P")

    return (
        <div className="grid">
            <table className="table">
                <thead className="header-sticky">
                    <tr>
                        <th style={{ minWidth: 100 }}>Ngày</th>
                        {shiftList.map(code => (
                            <th key={code} style={{ minWidth: 180, background: shifts[code].bg }}>{code}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map(d => {
                        const key = d.toISOString().slice(0, 10)
                        return (
                            <tr key={key}>
                                <td>{key}</td>
                                {shiftList.map(code => {
                                    const arr = (code === 'Đ' ? nightMap[`${key}|Đ`] : dayRows[`${key}|${code}`]) || []
                                    return (
                                        <td key={code}>
                                            {arr.length ? arr.join(', ') : ''}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}