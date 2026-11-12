import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { RESPONSE_STATUSES, REFERRAL_STATUSES } from '../../data/constants';
import { createEmptyContact } from '../../data/defaults';
import { todayISO } from '../../utils/dates';

export default function ContactForm({ initialData, onClose }) {
  const [form, setForm] = useState(createEmptyContact());
  const { addContact, updateContact, applications, categories } = useData();
  const toast = useToast();

  useEffect(() => {
    if (initialData) setForm({ ...createEmptyContact(), ...initialData });
    else setForm({ ...createEmptyContact(), firstContacted: todayISO() });
  }, [initialData]);

  const handleChange = (e) => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };
  const handleLinkToggle = (appId) => { setForm(prev => { const current = prev.linkedApplicationIds || []; return { ...prev, linkedApplicationIds: current.includes(appId) ? current.filter(id => id !== appId) : [...current, appId] }; }); };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) { toast.error('Full Name required.'); return; }
    if (initialData) { updateContact(initialData.id, form); toast.success('Contact updated'); }
    else { addContact(form); toast.success('Contact added'); }
    onClose();
  };

  const renderInput = (label, name, type = 'text', required = false) => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label} {required && <span className="required">*</span>}</label>
      <input type={type} className="form-control" name={name} value={form[name] || ''} onChange={handleChange} required={required} />
    </div>
  );
  const renderSelect = (label, name, options) => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>
      <select className="form-select" name={name} value={form[name] || ''} onChange={handleChange}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const matchingApps = applications.filter(a => form.company && a.company.toLowerCase().trim() === form.company.toLowerCase().trim());

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-2">
        {renderInput('Full Name', 'fullName', 'text', true)}
        {renderInput('Company Name', 'company')}
        {renderInput('Job Designation', 'designation')}
        {renderSelect('Contact Type', 'contactType', categories.contactTypes)}
        {renderInput('LinkedIn Profile URL', 'linkedinUrl', 'url')}
        {renderInput('Email', 'email', 'email')}
        {renderInput('Date First Contacted', 'firstContacted', 'date')}
        {renderSelect('Response Status', 'responseStatus', RESPONSE_STATUSES)}
        {renderSelect('Referral Status', 'referralStatus', REFERRAL_STATUSES)}
        <div className="col-md-6 mb-3"><label className="form-label">Next Follow-up Date</label><input type="date" className="form-control" name="nextFollowUp" value={form.nextFollowUp || ''} onChange={handleChange} /></div>
        <div className="col-12 mb-3"><label className="form-label">Notes</label><textarea className="form-control" name="notes" rows="2" value={form.notes || ''} onChange={handleChange}></textarea></div>
        {form.company.trim().length > 0 && (
          <div className="col-12 mb-3 border-top pt-3">
            <label className="form-label fw-bold">Linked Applications (Matches Company)</label>
            {matchingApps.length === 0 ? <div className="text-muted small">No applications found for "{form.company}".</div> : (
              <div className="d-flex flex-column gap-2 bg-light p-3 rounded">
                {matchingApps.map(a => (
                  <div className="form-check" key={a.id}>
                    <input className="form-check-input" type="checkbox" id={`app-${a.id}`} checked={(form.linkedApplicationIds || []).includes(a.id)} onChange={() => handleLinkToggle(a.id)} />
                    <label className="form-check-label" htmlFor={`app-${a.id}`}>{a.jobTitle} <span className="text-muted">({a.status})</span></label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Add Contact'}</button>
      </div>
    </form>
  );
}