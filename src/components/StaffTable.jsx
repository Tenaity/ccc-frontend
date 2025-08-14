import { useState } from 'react'

export default function StaffTable({ staff, onAdd, onDelete }) {
    const [name, setName] = useState('')
    const [role, setRole] = useState('GDV')
    const [canNight, setCanNight] = useState(true)

    return (
        <div>
            <h3>Staff</h3>
            <table className="table">
                <thead className="header-sticky">
                    <tr>
                        <th>#</th><th>Họ tên</th><th>Vai trò</th><th>Được làm đêm</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map((s, i) => (
                        <tr key={s.id}>
                            <td>{i + 1}</td>
                            <td>{s.full_name}</td>
                            <td>{s.role}</td>
                            <td>{s.can_night ? '✓' : '✗'}</td>
                            <td><button onClick={() => onDelete(s.id)}>Xóa</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="toolbar">
                <input placeholder="Họ tên" value={name} onChange={e => setName(e.target.value)} />
                <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="GDV">GDV</option>
                    <option value="TC">Trưởng ca</option>
                </select>
                <label><input type="checkbox" checked={canNight} onChange={e => setCanNight(e.target.checked)} /> Làm đêm</label>
                <button onClick={() => { if (!name.trim()) return; onAdd({ full_name: name, role, can_night: canNight }); setName(''); }}>Thêm</button>
            </div>
        </div>
    )
}