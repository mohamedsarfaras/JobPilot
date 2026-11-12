export const APPLICATION_STATUSES = ['Applied','Assessment','Interview','Follow-up','Selected','Rejected','No Response','Withdrawn'];
export const EMPLOYMENT_TYPES = ['Full-time','Internship','Contract'];
export const WORK_MODES = ['On-site','Hybrid','Remote'];
export const APPLICATION_SOURCES = ['LinkedIn','Naukri','Indeed','Referral','Company Website','Other'];
export const CONTACT_TYPES = ['Recruiter','HR','Employee','Developer','Alumni','Other'];
export const RESPONSE_STATUSES = ['Not Contacted','Message Sent','Seen','Replied','No Response'];
export const REFERRAL_STATUSES = ['Not Requested','Requested','Referred','Not Available'];
export const TASK_CATEGORIES = ['Job Applications','Recruiter Outreach','Networking','Interview Preparation','Technical Learning','Project Development','Other'];
export const TASK_PRIORITIES = ['Low','Medium','High'];
export const STATUS_CLASS_MAP = {
  'Applied':'applied','Assessment':'assessment','Interview':'interview','Follow-up':'followup',
  'Selected':'selected','Rejected':'rejected','No Response':'noresponse','Withdrawn':'withdrawn',
};
export const STORAGE_KEYS = {
  APPLICATIONS: 'jobpilot:applications',
  CONTACTS:     'jobpilot:contacts',
  TASKS:        'jobpilot:tasks',
  DAILY_NOTES:  'jobpilot:dailyNotes',
  PREFERENCES:  'jobpilot:preferences',
  PROFILE:      'jobpilot:profile',
  CATEGORIES:   'jobpilot:categories',
  VERSION:      'jobpilot:version',
};
export const DATA_VERSION = '1';