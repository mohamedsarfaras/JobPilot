import { todayISO, toISODate } from './dates';

export function getApplicationStats(applications) {
  const total = applications.length;
  const interviews = applications.filter(a => a.status === 'Interview').length;
  const offers = applications.filter(a => a.status === 'Selected').length;
  const rejections = applications.filter(a => a.status === 'Rejected').length;
  return { total, interviews, offers, rejections };
}
export function getContactStats(contacts) { return { peopleContacted: contacts.length }; }
export function getFollowUpsDue(applications, contacts) {
  const today = todayISO();
  let due = 0;
  applications.forEach(a => {
    if (a.followUpDate && toISODate(a.followUpDate) <= today &&
        !['Selected','Rejected','Withdrawn'].includes(a.status)) due++;
  });
  contacts.forEach(c => {
    if (c.nextFollowUp && toISODate(c.nextFollowUp) <= today) due++;
  });
  return { followUpsDue: due };
}
export function getPipelineCounts(applications) {
  const counts = {};
  applications.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1; });
  return counts;
}
export function getRecentApplications(applications, n = 5) {
  return [...applications].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, n);
}
export function getRecentContacts(contacts, n = 5) {
  return [...contacts].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')).slice(0, n);
}
export function getTodayTasks(tasks) {
  const today = todayISO();
  const todays = tasks.filter(t => toISODate(t.date) === today);
  return { pending: todays.filter(t => !t.completed), completed: todays.filter(t => t.completed) };
}