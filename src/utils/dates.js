export function todayISO() { return toISODate(new Date()); }
export function toISODate(d) {
  if (!d) return '';
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt.getTime())) return '';
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const y = d.getFullYear();
  return `${day}/${m}/${y}`;
}
export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const y = d.getFullYear();
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${day}/${m}/${y}, ${time}`;
}
export function isToday(iso) { return iso && toISODate(iso) === todayISO(); }
export function isOverdue(iso) { if (!iso) return false; return toISODate(iso) < todayISO(); }
export function isUpcoming(iso) { if (!iso) return false; return toISODate(iso) > todayISO(); }
export function addDays(iso, days) {
  if (!iso) return '';
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}
export function relativeDay(iso) {
  if (!iso) return '—';
  const today = todayISO();
  const target = toISODate(iso);
  if (target === today) return 'Today';
  const diff = Math.round((new Date(target) - new Date(today)) / (1000*60*60*24));
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  if (diff < -1 && diff > -7) return `${Math.abs(diff)} days ago`;
  return formatDate(iso);
}