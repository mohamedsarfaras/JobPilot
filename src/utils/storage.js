import { STORAGE_KEYS, DATA_VERSION } from '../data/constants';
import { defaultCollections, defaultProfile, defaultCategories } from '../data/defaults';

export function safeParse(json, fallback) {
  try { const v = JSON.parse(json); return v == null ? fallback : v; }
  catch { return fallback; }
}
export function readKey(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = safeParse(raw, fallback);
    return parsed == null ? fallback : parsed;
  } catch { return fallback; }
}
export function writeKey(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (e) { console.error('localStorage write failed', e); return false; }
}
export function removeKey(key) { try { localStorage.removeItem(key); } catch {} }
export function loadAll() {
  return {
    applications:  readKey(STORAGE_KEYS.APPLICATIONS, defaultCollections[STORAGE_KEYS.APPLICATIONS]),
    contacts:      readKey(STORAGE_KEYS.CONTACTS,     defaultCollections[STORAGE_KEYS.CONTACTS]),
    tasks:         readKey(STORAGE_KEYS.TASKS,        defaultCollections[STORAGE_KEYS.TASKS]),
    dailyNotes:    readKey(STORAGE_KEYS.DAILY_NOTES,  defaultCollections[STORAGE_KEYS.DAILY_NOTES]),
    preferences:   readKey(STORAGE_KEYS.PREFERENCES,  defaultCollections[STORAGE_KEYS.PREFERENCES]),
    profile:       readKey(STORAGE_KEYS.PROFILE,      defaultProfile),
    categories:    readKey(STORAGE_KEYS.CATEGORIES,   defaultCategories),
    version:       readKey(STORAGE_KEYS.VERSION, DATA_VERSION),
  };
}
export function saveAll(state) {
  writeKey(STORAGE_KEYS.APPLICATIONS, state.applications ?? []);
  writeKey(STORAGE_KEYS.CONTACTS,     state.contacts ?? []);
  writeKey(STORAGE_KEYS.TASKS,        state.tasks ?? []);
  writeKey(STORAGE_KEYS.DAILY_NOTES,  state.dailyNotes ?? []);
  writeKey(STORAGE_KEYS.PREFERENCES,  state.preferences ?? {});
  writeKey(STORAGE_KEYS.PROFILE,      state.profile ?? {});
  writeKey(STORAGE_KEYS.CATEGORIES,   state.categories ?? {});
  writeKey(STORAGE_KEYS.VERSION,      DATA_VERSION);
}
export function clearAll() { Object.values(STORAGE_KEYS).forEach(removeKey); }