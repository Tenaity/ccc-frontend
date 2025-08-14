export async function api(path, options={}) {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
export const listStaff = () => api('/api/staff')
export const addStaff = (body) => api('/api/staff', { method:'POST', body: JSON.stringify(body) })
export const delStaff = (id) => api(`/api/staff/${id}`, { method:'DELETE' })
export const getShifts = () => api('/api/shifts')
export const generate = (y,m) => api('/api/schedule/generate', { method:'POST', body: JSON.stringify({ year:y, month:m }) })
export const addFixed = (body) => api('/api/fixed', { method:'POST', body: JSON.stringify(body) })
export const addOff = (body) => api('/api/off', { method:'POST', body: JSON.stringify(body) })