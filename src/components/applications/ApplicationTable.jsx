import { Edit2, Trash2, Eye, ExternalLink } from 'lucide-react';
import { STATUS_CLASS_MAP } from '../../data/constants';
import { formatDate } from '../../utils/dates';

export default function ApplicationTable({ applications, onEdit, onDelete, onView }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>Company</th>
            <th>Job Title</th>
            <th className="d-none d-md-table-cell">Location</th>
            <th className="d-none d-sm-table-cell">Applied</th>
            <th>Status</th>
            <th className="d-none d-lg-table-cell">Follow-up</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>
                <div className="fw-semibold">{app.company}</div>
                {app.jobUrl && <a href={app.jobUrl} target="_blank" rel="noreferrer" className="text-muted small d-inline-flex align-items-center gap-1" title="Job Posting"><ExternalLink size={12}/> Link</a>}
              </td>
              <td>{app.jobTitle}</td>
              <td className="d-none d-md-table-cell text-muted">{app.location || '—'}</td>
              <td className="d-none d-sm-table-cell text-muted">{formatDate(app.appliedDate)}</td>
              <td><span className={`badge-status status-${STATUS_CLASS_MAP[app.status] || 'applied'}`}>{app.status}</span></td>
              <td className="d-none d-lg-table-cell text-muted">{formatDate(app.followUpDate)}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-link text-secondary p-1" onClick={() => onView(app)} title="View"><Eye size={16}/></button>
                <button className="btn btn-sm btn-link text-primary p-1" onClick={() => onEdit(app)} title="Edit"><Edit2 size={16}/></button>
                <button className="btn btn-sm btn-link text-danger p-1" onClick={() => onDelete(app)} title="Delete"><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}