export function generateId(prefix = 'id') {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${t}${r}`;
}