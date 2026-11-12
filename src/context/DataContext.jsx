import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadAll, saveAll, clearAll } from '../utils/storage';
import { generateId } from '../utils/ids';
import { todayISO, addDays } from '../utils/dates';
import { useToast } from './ToastContext';

const DataContext = createContext(null);
function nowISO() { return new Date().toISOString(); }

const calcFollowUp = (status, dateStr) => {
  if (['Rejected', 'Withdrawn', 'Selected', 'No Response'].includes(status)) return '';
  const baseDate = dateStr ? dateStr.split('T')[0] : todayISO();
  return addDays(baseDate, 5);
};
const calcContactFollowUp = (status, dateStr) => {
  if (['Replied', 'No Response'].includes(status)) return '';
  const baseDate = dateStr ? dateStr.split('T')[0] : todayISO();
  return addDays(baseDate, 3);
};

export function DataProvider({ children }) {
  const [state, setState] = useState(() => loadAll());
  const [notifications, setNotifications] = useState([]);
  const toast = useToast();

  // Link the Toast system to the Notification system
  useEffect(() => {
    if (toast._setNotify) {
      toast._setNotify((message, type) => {
        setNotifications(prev => [{
          id: generateId('notif'),
          message,
          type,
          read: false,
          createdAt: nowISO()
        }, ...prev]);
      });
    }
  }, [toast]);

  const markAllRead = useCallback(() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); }, []);
  const clearAllNotifications = useCallback(() => { setNotifications([]); }, []);
  const unreadCount = notifications.filter(n => !n.read).length;

  // --- STREAK & AUTO-ENGINE ---
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    const today = todayISO();
    const dates = new Set();
    state.applications.forEach(a => dates.add(a.createdAt?.split('T')[0]));
    state.contacts.forEach(c => { if(c.conversationHistory) c.conversationHistory.forEach(h => dates.add(h.at?.split('T')[0])) });
    state.tasks.forEach(t => dates.add(t.createdAt?.split('T')[0]));
    state.dailyNotes.forEach(n => dates.add(n.date));

    let count = 0;
    let checkDate = new Date(today);
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (dates.has(dateStr)) {
        count++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else break;
    }
    setStreak(count);
  }, [state.applications, state.contacts, state.tasks, state.dailyNotes]);

  useEffect(() => {
    setState(prev => {
      let changed = false;
      const today = todayISO();
      const updatedApps = prev.applications.map(app => {
        if (['Rejected', 'Withdrawn', 'Selected', 'No Response'].includes(app.status)) return app;
        if (app.followUpDate && app.followUpDate < today && app.status !== 'Follow-up') {
          changed = true;
          return { ...app, status: 'Follow-up', followUpDate: calcFollowUp('Follow-up', today), statusHistory: [...(app.statusHistory || []), { from: app.status, to: 'Follow-up', at: nowISO(), note: 'Auto-updated' }] };
        }
        if (app.followUpDate && app.followUpDate < today && app.status === 'Follow-up') {
          changed = true;
          return { ...app, status: 'No Response', followUpDate: '', statusHistory: [...(app.statusHistory || []), { from: app.status, to: 'No Response', at: nowISO(), note: 'Auto-updated' }] };
        }
        return app;
      });
      const updatedContacts = prev.contacts.map(c => {
        if (['Replied', 'No Response'].includes(c.responseStatus)) return c;
        if (c.nextFollowUp && c.nextFollowUp < today) {
          changed = true;
          return { ...c, responseStatus: 'No Response', nextFollowUp: '', updatedAt: nowISO() };
        }
        return c;
      });
      return changed ? { ...prev, applications: updatedApps, contacts: updatedContacts } : prev;
    });
  }, []);

  useEffect(() => { saveAll(state); }, [state]);

  // --- CRUD (Applications, Contacts, Tasks) ---
  const addApplication = useCallback((data) => {
    const app = { ...data, id: generateId('app'), followUpDate: calcFollowUp(data.status, data.appliedDate || todayISO()), statusHistory: [{ from: null, to: data.status || 'Applied', at: nowISO() }], createdAt: nowISO(), updatedAt: nowISO() };
    setState(s => ({ ...s, applications: [app, ...s.applications] }));
    return app;
  }, []);
  const updateApplication = useCallback((id, updates) => {
    setState(s => ({ ...s, applications: s.applications.map(a => {
      if (a.id !== id) return a;
      const statusChanged = updates.status && updates.status !== a.status;
      const nextHistory = statusChanged ? [...(a.statusHistory || []), { from: a.status, to: updates.status, at: nowISO() }] : (a.statusHistory || []);
      let nextFollowUp = a.followUpDate;
      if (statusChanged) nextFollowUp = calcFollowUp(updates.status, todayISO());
      return { ...a, ...updates, followUpDate: nextFollowUp, statusHistory: nextHistory, updatedAt: nowISO() };
    }) }));
  }, []);
  const deleteApplication = useCallback((id) => { setState(s => ({ ...s, applications: s.applications.filter(a => a.id !== id) })); }, []);

  const addContact = useCallback((data) => {
    const newContact = { ...data, id: generateId('cnt'), nextFollowUp: data.nextFollowUp || calcContactFollowUp(data.responseStatus, data.firstContacted || todayISO()), createdAt: nowISO(), updatedAt: nowISO() };
    setState(s => ({ ...s, contacts: [newContact, ...s.contacts] }));
    return newContact;
  }, []);
  const updateContact = useCallback((id, updates) => {
    setState(s => ({ ...s, contacts: s.contacts.map(c => {
      if (c.id !== id) return c;
      let nextFollowUp = updates.nextFollowUp !== undefined ? updates.nextFollowUp : c.nextFollowUp;
      if (updates.responseStatus && updates.responseStatus !== c.responseStatus) {
        if (['Replied', 'No Response'].includes(updates.responseStatus)) nextFollowUp = '';
        else if (!updates.nextFollowUp) nextFollowUp = calcContactFollowUp(updates.responseStatus, todayISO());
      }
      return { ...c, ...updates, nextFollowUp, updatedAt: nowISO() };
    }) }));
  }, []);
  const deleteContact = useCallback((id) => { setState(s => ({ ...s, contacts: s.contacts.filter(c => c.id !== id) })); }, []);

  const addTask = useCallback((data) => { const t = { ...data, id: generateId('task'), createdAt: nowISO(), updatedAt: nowISO() }; setState(s => ({ ...s, tasks: [t, ...s.tasks] })); return t; }, []);
  const updateTask = useCallback((id, updates) => { setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: nowISO() } : t) })); }, []);
  const deleteTask = useCallback((id) => { setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) })); }, []);
  const toggleTask = useCallback((id) => { setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? nowISO() : null, updatedAt: nowISO() } : t) })); }, []);

  const saveDailyNote = useCallback((dateISO, data) => {
    setState(s => {
      const existing = s.dailyNotes.find(n => n.date === dateISO);
      if (existing) return { ...s, dailyNotes: s.dailyNotes.map(n => n.date === dateISO ? { ...n, ...data, updatedAt: nowISO() } : n) };
      return { ...s, dailyNotes: [{ id: generateId('note'), date: dateISO, ...data, createdAt: nowISO(), updatedAt: nowISO() }, ...s.dailyNotes] };
    });
  }, []);
  const deleteDailyNote = useCallback((id) => { setState(s => ({ ...s, dailyNotes: s.dailyNotes.filter(n => n.id !== id) })); }, []);

  const updateProfile = useCallback((updates) => { setState(s => ({ ...s, profile: { ...s.profile, ...updates } })); }, []);
  const updatePreferences = useCallback((updates) => { setState(s => ({ ...s, preferences: { ...s.preferences, ...updates } })); }, []);
  const updateCategories = useCallback((newCats, changedItems) => {
    setState(s => {
      const { sources, contactTypes, taskCategories } = newCats;
      let newApps = s.applications, newContacts = s.contacts, newTasks = s.tasks;
      if (changedItems?.sources) newApps = s.applications.map(a => changedItems.sources[a.source] ? { ...a, source: changedItems.sources[a.source] } : a);
      if (changedItems?.contactTypes) newContacts = s.contacts.map(c => changedItems.contactTypes[c.contactType] ? { ...c, contactType: changedItems.contactTypes[c.contactType] } : c);
      if (changedItems?.taskCategories) newTasks = s.tasks.map(t => changedItems.taskCategories[t.category] ? { ...t, category: changedItems.taskCategories[t.category] } : t);
      return { ...s, categories: { sources, contactTypes, taskCategories }, applications: newApps, contacts: newContacts, tasks: newTasks };
    });
    toast.success('Categories updated');
  }, [toast]);

  const moveCategoryItems = useCallback((type, targetCategory, itemIds) => {
    setState(s => {
      let newApps = s.applications, newContacts = s.contacts, newTasks = s.tasks;
      if (type === 'sources') newApps = s.applications.map(a => itemIds.includes(a.id) ? { ...a, source: targetCategory } : a);
      if (type === 'contactTypes') newContacts = s.contacts.map(c => itemIds.includes(c.id) ? { ...c, contactType: targetCategory } : c);
      if (type === 'taskCategories') newTasks = s.tasks.map(t => itemIds.includes(t.id) ? { ...t, category: targetCategory } : t);
      return { ...s, applications: newApps, contacts: newContacts, tasks: newTasks };
    });
    toast.success('Items moved');
  }, [toast]);

  const clearAllData = useCallback(() => { clearAll(); setState(loadAll()); toast.success('All data cleared'); }, [toast]);
  const replaceAll = useCallback((incoming) => { setState({ ...loadAll(), ...incoming }); }, []);

  const value = {
    ...state, streak, unreadCount,
    notifications, markAllRead, clearAllNotifications,
    addApplication, updateApplication, deleteApplication,
    addContact, updateContact, deleteContact,
    addTask, updateTask, deleteTask, toggleTask,
    saveDailyNote, deleteDailyNote,
    updateProfile, updatePreferences, updateCategories, moveCategoryItems,
    clearAllData, replaceAll,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
}