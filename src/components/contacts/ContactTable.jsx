import { Edit2, Trash2, Eye, ExternalLink, Mail } from 'lucide-react';
import { formatDate } from '../../utils/dates';

export default function ContactTable({ contacts, onEdit, onDelete, onView }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th className="d-none d-md-table-cell">First Contacted</th>
            <th className="d-none d-sm-table-cell">Type</th>
            <th>Response</th>
            <th className="d-none d-lg-table-cell">Follow-up</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c.id}>
              <td>
                <div className="fw-semibold d-flex align-items-center gap-2">
                  {c.fullName}
                  {c.linkedinUrl && (
                    <a href={c.linkedinUrl.startsWith('http') ? c.linkedinUrl : `https://${c.linkedinUrl}`} target="_blank" rel="noreferrer" className="text-primary" title="LinkedIn Profile">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="text-danger" title="Send Email">
                      <Mail size={14} />
                    </a>
                  )}
                </div>
              </td>
              <td>{c.company || '—'}</td>
              <td className="d-none d-md-table-cell text-muted">{formatDate(c.firstContacted)}</td>
              <td className="d-none d-sm-table-cell text-muted">{c.contactType}</td>
              <td>
                <span className={`badge ${c.responseStatus === 'Replied' ? 'bg-success' : c.responseStatus === 'No Response' ? 'bg-danger' : 'bg-secondary'}`} style={{ fontWeight: 500 }}>
                  {c.responseStatus}
                </span>
              </td>
              <td className="d-none d-lg-table-cell text-muted">{formatDate(c.nextFollowUp)}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-link text-secondary p-1" onClick={() => onView(c.id)} title="View"><Eye size={16}/></button>
                <button className="btn btn-sm btn-link text-primary p-1" onClick={() => onEdit(c)} title="Edit"><Edit2 size={16}/></button>
                <button className="btn btn-sm btn-link text-danger p-1" onClick={() => onDelete(c)} title="Delete"><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}