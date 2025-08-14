import { useState } from 'react'

export default function FixedAssignmentEditor({ staff, shifts, onAddFixed, onAddOff }) {
    const [sid, setSid] = useState('')
    const [day, setDay] = useState('')
    const [code, setCode] = useState('CA1')
    const [reason, setReason] = useState('')

    return (
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
                <h4>Cố định ca (ví dụ: CA1 ngày 10)</h4>
                <div className="toolbar">
                    <select value={sid} onChange={e => setSid(e.target.value)}>
                        <option value="">Chọn nhân sự</option>
                        {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                    </select>
                    <input type="date" value={day} onChange={e => setDay(e.target.value)} />
                    <select value={code} onChange={e => setCode(e.target.value)}>
                        {Object.keys(shifts).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                    <button onClick={() => sid && day && code && onAddFixed({ staff_id: +sid, day, shift_code: code })}>Thêm</button>
                </div>
            </div>
            <div>
                <h4>Đăng ký nghỉ (P)</h4>
                <div className="toolbar">
                    <select value={sid} onChange={e => setSid(e.target.value)}>
                        <option value="">Chọn nhân sự</option>
                        {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                    </select>
                    <input type="date" value={day} onChange={e => setDay(e.target.value)} />
                    <input placeholder="Lý do" value={reason} onChange={e => setReason(e.target.value)} />
                    <button onClick={() => sid && day && onAddOff({ staff_id: +sid, day, reason })}>Thêm</button>
                </div>
            </div>
        </div>
    )
}