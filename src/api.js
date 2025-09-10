export async function api(path, options = {}) {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const listStaff = () => api('/api/staff');
export const addStaff = (body) => api('/api/staff', { method: 'POST', body: JSON.stringify(body) });
export const delStaff = (id) => api(`/api/staff/${id}`, { method: 'DELETE' });
export const getShifts = () => api('/api/shifts');
export const generate = (y, m) => api('/api/schedule/generate', { method: 'POST', body: JSON.stringify({ year: y, month: m }) });

export const getFixed = (y, m) => api(`/api/fixed?year=${y}&month=${m}`);
export const createFixed = (body) => api('/api/fixed', { method: 'POST', body: JSON.stringify(body) });
export const deleteFixed = (id) => api(`/api/fixed/${id}`, { method: 'DELETE' });

export const getOffdays = (y, m) => api(`/api/offdays?year=${y}&month=${m}`);
export const createOff = (body) => api('/api/offdays', { method: 'POST', body: JSON.stringify(body) });
export const deleteOff = (id) => api(`/api/offdays/${id}`, { method: 'DELETE' });

