import { useState } from 'react';
import { formatDate, formatDateTime } from '../../utils/dates';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Plus, ExternalLink, Mail } from 'lucide-react';

export default function ContactDetails({ contactId, applications }) {
  const { contacts, updateContact } = useData();
  const toast = useToast();
  const [newNote, setNewNote] = useState('');

  const contact = contacts.find(c => c.id === contactId);
  if (!contact) return null;

  const linkedApps = applications.filter(a => (contact.linkedApplicationIds || []).includes(a.id));

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const history = [...(contact.conversationHistory || []), { at: new Date().toISOString(), note: newNote.trim() }];
    updateContact(contact.id, { conversationHistory: history });
    setNewNote('');
    toast.success('Conversation logged');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h4 className="mb-1">{contact.fullName}</h4>
          <div className="text-muted">{contact.designation ? `${contact.designation} • ` : ''}{contact.company || 'Independent'}</div>
        </div>
        <span className={`badge ${contact.responseStatus === 'Replied' ? 'bg-success' : contact.responseStatus === 'No Response' ? 'bg-danger' : 'bg-secondary'}`} style={{ padding: '0.4rem 0.75rem' }}>
          {contact.responseStatus}
        </span>
      </div>
      
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">Contact Type</small>{contact.contactType}</div>
        <div className="col-sm-6 col-md-4">
          <small className="text-muted d-block">Email</small>
          {contact.email ? (
            <a href={`mailto:${contact.email}`} className="text-decoration-none d-inline-flex align-items-center gap-1">
              {contact.email} <Mail size={12} />
            </a>
          ) : '—'}
        </div>
        <div className="col-sm-6 col-md-4">
          <small className="text-muted d-block">LinkedIn</small>
          {contact.linkedinUrl ? (
            <a href={contact.linkedinUrl.startsWith('http') ? contact.linkedinUrl : `https://${contact.linkedinUrl}`} target="_blank" rel="noreferrer" className="text-decoration-none d-inline-flex align-items-center gap-1">
              Open Profile <ExternalLink size={12} />
            </a>
          ) : '—'}
        </div>
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">First Contacted</small>{formatDate(contact.firstContacted)}</div>
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">Next Follow-up</small>{formatDate(contact.nextFollowUp)}</div>
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">Referral Status</small>{contact.referralStatus}</div>
      </div>

      {contact.notes && (
        <div className="mb-4"><h6 className="mb-2">General Notes</h6><div className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>{contact.notes}</div></div>
      )}

      {linkedApps.length > 0 && (
        <div className="mb-4">
          <h6 className="mb-2">Linked Applications</h6>
          <div className="d-flex flex-wrap gap-2">
            {linkedApps.map(a => <span key={a.id} className="badge bg-primary text-decoration-none">{a.company} ({a.jobTitle})</span>)}
          </div>
        </div>
      )}

      <div>
        <h6 className="mb-3 d-flex align-items-center gap-2"><MessageSquare size={16}/> Conversation History</h6>
        <div className="d-flex gap-2 mb-3">
          <input type="text" className="form-control" placeholder="Log a new conversation..." value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddNote()} />
          <button className="btn btn-primary" onClick={handleAddNote}><Plus size={16}/></button>
        </div>
        <div className="border-start ms-2 ps-3 py-1" style={{ borderWidth: '2px !important' }}>
          {(!contact.conversationHistory || contact.conversationHistory.length === 0) ? (
            <div className="text-muted small">No conversations logged yet.</div>
          ) : (
            [...contact.conversationHistory].reverse().map((h, i) => (
              <div key={i} className="position-relative mb-3">
                <div className="position-absolute bg-secondary rounded-circle" style={{ width: 8, height: 8, left: '-1.3rem', top: 7 }}></div>
                <div>{h.note}</div>
                <div className="text-muted small">{formatDateTime(h.at)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}