import React, { useEffect, useState } from 'react';
import { useFixedOff } from '../../hooks/useFixedOff';
import type { ShiftCode, Position } from '../../types';

export default function FixedOffPanel({
  year,
  month,
  open,
  onClose,
}: {
  year: number;
  month: number;
  open: boolean;
  onClose: () => void;
}) {
  const {
    fixed,
    off,
    load,
    createFixed,
    deleteFixed,
    createOff,
    deleteOff,
  } = useFixedOff(year, month);
  const [tab, setTab] = useState<'fixed' | 'off'>('fixed');
  const [staffId, setStaffId] = useState('');
  const [day, setDay] = useState('');
  const [shift, setShift] = useState<ShiftCode>('CA1');
  const [position, setPosition] = useState<Position | ''>('');
  const [offReason, setOffReason] = useState('');

  useEffect(() => {
    if (open) load();
  }, [open, year, month]);

  if (!open) return null;

  const submitFixed = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFixed({
      staff_id: Number(staffId),
      day,
      shift_code: shift,
      position: position || null,
    });
    setStaffId('');
    setDay('');
  };

  const submitOff = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOff({ staff_id: Number(staffId), day, reason: offReason || null });
    setStaffId('');
    setDay('');
    setOffReason('');
  };

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: 320, height: '100%', background: '#fff', borderLeft: '1px solid #ddd', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 8, borderBottom: '1px solid #ddd' }}>
        <strong>Fixed & Off</strong>
        <button onClick={onClose}>×</button>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
        <button onClick={() => setTab('fixed')} style={{ flex: 1, padding: 8, background: tab === 'fixed' ? '#eee' : '#fff' }}>Fixed</button>
        <button onClick={() => setTab('off')} style={{ flex: 1, padding: 8, background: tab === 'off' ? '#eee' : '#fff' }}>Off</button>
      </div>
      {tab === 'fixed' ? (
        <div style={{ padding: 8 }}>
          <form onSubmit={submitFixed} style={{ marginBottom: 12 }}>
            <input placeholder="staff id" value={staffId} onChange={(e) => setStaffId(e.target.value)} />
            <input placeholder="YYYY-MM-DD" value={day} onChange={(e) => setDay(e.target.value)} />
            <select value={shift} onChange={(e) => setShift(e.target.value as ShiftCode)}>
              <option value="CA1">CA1</option>
              <option value="CA2">CA2</option>
              <option value="K">K</option>
              <option value="HC">HC</option>
              <option value="Đ">Đ</option>
            </select>
            <select value={position} onChange={(e) => setPosition(e.target.value as Position | '')}>
              <option value="">--</option>
              <option value="TD">TD</option>
              <option value="PGD">PGD</option>
            </select>
            <button type="submit">Add</button>
          </form>
          <ul>
            {fixed.map((f) => (
              <li key={f.id}>
                {f.day} #{f.staff_id} {f.shift_code} {f.position || ''}
                <button onClick={() => deleteFixed(f.id)}>Del</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div style={{ padding: 8 }}>
          <form onSubmit={submitOff} style={{ marginBottom: 12 }}>
            <input placeholder="staff id" value={staffId} onChange={(e) => setStaffId(e.target.value)} />
            <input placeholder="YYYY-MM-DD" value={day} onChange={(e) => setDay(e.target.value)} />
            <input placeholder="reason" value={offReason} onChange={(e) => setOffReason(e.target.value)} />
            <button type="submit">Add</button>
          </form>
          <ul>
            {off.map((o) => (
              <li key={o.id}>
                {o.day} #{o.staff_id} {o.reason || ''}
                <button onClick={() => deleteOff(o.id)}>Del</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
