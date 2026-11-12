import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import ContactTable from '../components/contacts/ContactTable';
import ContactForm from '../components/contacts/ContactForm';
import ContactDetails from '../components/contacts/ContactDetails';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Plus, Search } from 'lucide-react';
import { CONTACT_TYPES, RESPONSE_STATUSES } from '../data/constants';

export default function People() {
  const { contacts, applications, deleteContact } = useData();
  const toast = useToast();
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [viewingContactId, setViewingContactId] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      const matchSearch = c.fullName.toLowerCase().includes(search.toLowerCase()) || (c.company || '').toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'All' || c.contactType === typeFilter;
      const matchStatus = statusFilter === 'All' || c.responseStatus === statusFilter;
      return matchSearch && matchType && matchStatus;
    }).sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [contacts, search, typeFilter, statusFilter]);

  const handleDelete = () => {
    if (deletingContact) {
      deleteContact(deletingContact.id);
      toast.success('Contact deleted');
      setDeletingContact(null);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>People &amp; Networking</h1>
        <button className="btn btn-primary" onClick={() => { setEditingContact(null); setIsFormOpen(true); }}>
          <Plus size={16} className="me-1"/> Add Contact
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white"><Search size={16} className="text-muted"/></span>
                <input type="text" className="form-control border-start-0" placeholder="Search name or company..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-6 col-md-4">
              <select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="All">All Types</option>
                {CONTACT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-4">
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Response Statuses</option>
                {RESPONSE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {contacts.length === 0 ? (
          <EmptyState 
            title="No contacts yet" 
            message="Start building your network by adding recruiters, HRs, and referrals."
            actionLabel="Add Contact"
            onAction={() => { setEditingContact(null); setIsFormOpen(true); }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState 
            title="No results found" 
            message="Try adjusting your search or filters."
            actionLabel="Clear Filters"
            onAction={() => { setSearch(''); setTypeFilter('All'); setStatusFilter('All'); }}
          />
        ) : (
          <ContactTable 
            contacts={filtered} 
            onEdit={(c) => { setEditingContact(c); setIsFormOpen(true); }}
            onDelete={(c) => setDeletingContact(c)}
            onView={(id) => setViewingContactId(id)}
          />
        )}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingContact ? 'Edit Contact' : 'Add Contact'} size="lg">
        <ContactForm initialData={editingContact} onClose={() => setIsFormOpen(false)} />
      </Modal>

      <Modal isOpen={!!viewingContactId} onClose={() => setViewingContactId(null)} title="Contact Details" size="lg">
        <ContactDetails contactId={viewingContactId} applications={applications} />
      </Modal>

      <ConfirmDialog 
        isOpen={!!deletingContact} 
        title="Delete Contact" 
        message={`Are you sure you want to delete ${deletingContact?.fullName}? This cannot be undone.`} 
        onConfirm={handleDelete} 
        onCancel={() => setDeletingContact(null)} 
      />
    </div>
  );
}