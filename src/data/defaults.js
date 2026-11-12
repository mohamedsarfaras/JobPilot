import { STORAGE_KEYS, APPLICATION_SOURCES, CONTACT_TYPES, TASK_CATEGORIES } from './constants';

export const defaultPreferences = { 
  theme: 'light', 
  recommendApps: 10, 
  recommendContacts: 5, 
  showRecommendations: true,
  showMotivationalPics: true 
};
export const defaultProfile = { 
  name: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', resumeUrl: '', aboutMe: '', 
  profilePic: '' 
};
export const defaultCategories = {
  sources: APPLICATION_SOURCES.map(s => s === 'Indeed' ? 'Emails' : s),
  contactTypes: [...CONTACT_TYPES],
  taskCategories: TASK_CATEGORIES.filter(c => c !== 'Networking'),
};

export const defaultCollections = {
  [STORAGE_KEYS.APPLICATIONS]: [],
  [STORAGE_KEYS.CONTACTS]:     [],
  [STORAGE_KEYS.TASKS]:        [],
  [STORAGE_KEYS.DAILY_NOTES]:  [],
  [STORAGE_KEYS.PREFERENCES]:  defaultPreferences,
  [STORAGE_KEYS.PROFILE]:      defaultProfile,
  [STORAGE_KEYS.CATEGORIES]:   defaultCategories,
};

export function createEmptyApplication() {
  return { company:'', jobTitle:'', location:'Chennai', employmentType:'Full-time', workMode:'On-site',
    appliedDate:'', jobUrl:'', source:'LinkedIn', recruiterName:'', salary:'', status:'Applied',
    followUpDate:'', notes:'', linkedContactIds:[], statusHistory:[] };
}
export function createEmptyContact() {
  return { fullName:'', company:'', designation:'', contactType:'Recruiter', linkedinUrl:'',
    email:'', firstContacted:'', responseStatus:'Not Contacted', referralStatus:'Not Requested',
    nextFollowUp:'', notes:'', conversationHistory:[] };
}
export function createEmptyTask() {
  return { title:'', description:'', date:'', category:'Job Applications', priority:'Medium',
    completed:false, completedAt:null };
}
export function createEmptyDailyNote() {
  return { date:'', accomplished:'', problems:'', tomorrow:'', otherNotes:'' };
}