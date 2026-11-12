import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { APPLICATION_STATUSES, EMPLOYMENT_TYPES, WORK_MODES } from '../../data/constants';
import { createEmptyApplication } from '../../data/defaults';
import { todayISO } from '../../utils/dates';

export default function ApplicationForm({ initialData, onClose }) {
  const [form, setForm] = useState(createEmptyApplication());
  const { addApplication, updateApplication, categories } = useData();
  const toast = useToast();

  useEffect(() => {
    if (initialData) setForm({ ...createEmptyApplication(), ...initialData });
    else setForm({ ...createEmptyApplication(), appliedDate: todayISO() });
  }, [initialData]);

  const handleChange = (e) => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.jobTitle.trim() || !form.appliedDate) { toast.error('Required fields missing.'); return; }
    if (initialData) { updateApplication(initialData.id, form); toast.success('Application updated'); }
    else { addApplication(form); toast.success('Application added'); }
    onClose();
  };

  const renderInput = (label, name, type = 'text', required = false, placeholder = '', readOnly = false) => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label} {required && <span className="required">*</span>}</label>
      <input type={type} className={`form-control ${readOnly ? 'bg-light text-muted' : ''}`} name={name} value={form[name] || ''} onChange={handleChange} required={required} placeholder={placeholder} readOnly={readOnly} />
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-2">
        {renderInput('Company Name', 'company', 'text', true)}
        {renderInput('Job Title', 'jobTitle', 'text', true)}
        {renderInput('Location', 'location')}
        {renderInput('Applied Date', 'appliedDate', 'date', true)}
        {renderSelect('Employment Type', 'employmentType', EMPLOYMENT_TYPES)}
        {renderSelect('Work Mode', 'workMode', WORK_MODES)}
        {renderSelect('Source', 'source', categories.sources)}
        {renderSelect('Status', 'status', APPLICATION_STATUSES)}
        {renderInput('Salary / CTC', 'salary')}
        {renderInput('Follow-up Date (Auto)', 'followUpDate', 'text', false, '', true)}
        {renderInput('Job Posting URL', 'jobUrl', 'url')}
        {renderInput('Recruiter Name', 'recruiterName')}
        <div className="col-12 mb-3"><label className="form-label">Notes</label><textarea className="form-control" name="notes" rows="3" value={form.notes || ''} onChange={handleChange}></textarea></div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Add Application'}</button>
      </div>
    </form>
  );
}