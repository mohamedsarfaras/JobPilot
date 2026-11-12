import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { TASK_PRIORITIES } from '../../data/constants';
import { createEmptyTask } from '../../data/defaults';
import { todayISO } from '../../utils/dates';

export default function TaskForm({ initialData, onClose }) {
  const [form, setForm] = useState(createEmptyTask());
  const { addTask, updateTask, categories } = useData();
  const toast = useToast();

  useEffect(() => {
    if (initialData) setForm({ ...createEmptyTask(), ...initialData });
    else setForm({ ...createEmptyTask(), date: todayISO() });
  }, [initialData]);

  const handleChange = (e) => { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) { toast.error('Title and Date required.'); return; }
    if (initialData) { updateTask(initialData.id, form); toast.success('Task updated'); }
    else { addTask(form); toast.success('Task added'); }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-2">
        <div className="col-12 mb-3"><label className="form-label">Task Title <span className="required">*</span></label><input type="text" className="form-control" name="title" value={form.title || ''} onChange={handleChange} required /></div>
        <div className="col-12 mb-3"><label className="form-label">Description</label><textarea className="form-control" name="description" rows="2" value={form.description || ''} onChange={handleChange}></textarea></div>
        <div className="col-md-6 mb-3"><label className="form-label">Date <span className="required">*</span></label><input type="date" className="form-control" name="date" value={form.date || ''} onChange={handleChange} required /></div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Category</label>
          <select className="form-select" name="category" value={form.category || ''} onChange={handleChange}>
            {categories.taskCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Priority</label>
          <select className="form-select" name="priority" value={form.priority || ''} onChange={handleChange}>
            {TASK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Add Task'}</button>
      </div>
    </form>
  );
}