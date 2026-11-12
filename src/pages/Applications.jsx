import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import ApplicationTable from '../components/applications/ApplicationTable';
import ApplicationForm from '../components/applications/ApplicationForm';
import ApplicationDetails from '../components/applications/ApplicationDetails';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Plus, Search } from 'lucide-react';
import { APPLICATION_STATUSES, APPLICATION_SOURCES } from '../data/constants';

export default function Applications() {
  const { applications, deleteApplication } = useData();
  const toast = useToast();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [viewingApp, setViewingApp] = useState(null);
  const [deletingApp, setDeletingApp] = useState(null);

  const filtered = useMemo(() => {
    return applications.filter(a => {
      const matchSearch = a.company.toLowerCase().includes(search.toLowerCase()) || a.jobTitle.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchSource = sourceFilter === 'All' || a.source === sourceFilter;
      return matchSearch && matchStatus && matchSource;
    }).sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
  }, [applications, search, statusFilter, sourceFilter]);

  const handleDelete = () => {
    if (deletingApp) {
      deleteApplication(deletingApp.id);
      toast.success('Application deleted');
      setDeletingApp(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Applications</h1>
        <button className="btn btn-primary" onClick={() => { setEditingApp(null); setIsFormOpen(true); }}>
          <Plus size={16} className="me-1"/> Add Application
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white"><Search size={16} className="text-muted"/></span>
                <input type="text" className="form-control border-start-0" placeholder="Search company or title..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-6 col-md-4">
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                {APPLICATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-4">
              <select className="form-select" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
                <option value="All">All Sources</option>
                {APPLICATION_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {applications.length === 0 ? (
          <EmptyState title="No applications yet" message="Start tracking your job search by adding your first application." actionLabel="Add Application" onAction={() => { setEditingApp(null); setIsFormOpen(true); }} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No results found" message="Try adjusting your search or filters." actionLabel="Clear Filters" onAction={() => { setSearch(''); setStatusFilter('All'); setSourceFilter('All'); }} />
        ) : (
          <ApplicationTable 
            applications={filtered} 
            onEdit={(app) => { setEditingApp(app); setIsFormOpen(true); }}
            onDelete={(app) => setDeletingApp(app)}
            onView={(app) => setViewingApp(app)}
          />
        )}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingApp ? 'Edit Application' : 'Add Application'} size="lg">
        <ApplicationForm initialData={editingApp} onClose={() => setIsFormOpen(false)} />
      </Modal>

      <Modal isOpen={!!viewingApp} onClose={() => setViewingApp(null)} title="Application Details" size="lg">
        <ApplicationDetails app={viewingApp} />
      </Modal>

      <ConfirmDialog isOpen={!!deletingApp} title="Delete Application" message={`Are you sure you want to delete your application for ${deletingApp?.jobTitle} at ${deletingApp?.company}? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeletingApp(null)} />
    </div>
  );
}