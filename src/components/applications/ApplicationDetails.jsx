import { STATUS_CLASS_MAP } from '../../data/constants';
import { formatDate, formatDateTime } from '../../utils/dates';

export default function ApplicationDetails({ app }) {
  if (!app) return null;
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h4 className="mb-1">{app.jobTitle}</h4>
          <div className="text-muted">{app.company} • {app.location || 'No location'}</div>
        </div>
        <span className={`badge-status status-${STATUS_CLASS_MAP[app.status] || 'applied'}`}>{app.status}</span>
      </div>
      
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">Applied Date</small>{formatDate(app.appliedDate)}</div>
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">Employment Type</small>{app.employmentType}</div>
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">Work Mode</small>{app.workMode}</div>
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">Source</small>{app.source}</div>
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">Follow-up Date</small>{formatDate(app.followUpDate)}</div>
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">Recruiter</small>{app.recruiterName || '—'}</div>
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">Salary</small>{app.salary || '—'}</div>
        <div className="col-sm-6 col-md-4"><small className="text-muted d-block">Job URL</small>{app.jobUrl ? <a href={app.jobUrl} target="_blank" rel="noreferrer">Open Link</a> : '—'}</div>
      </div>

      {app.notes && (
        <div className="mb-4">
          <h6 className="mb-2">Notes</h6>
          <div className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>{app.notes}</div>
        </div>
      )}

      <div>
        <h6 className="mb-2">Status History</h6>
        <div className="border-start ms-2 ps-3 py-1" style={{ borderWidth: '2px !important' }}>
          {(app.statusHistory || []).map((h, i) => (
            <div key={i} className="position-relative mb-3">
              <div className="position-absolute bg-primary rounded-circle" style={{ width: 10, height: 10, left: '-1.35rem', top: 6 }}></div>
              <div className="fw-semibold">{h.from ? `${h.from} → ${h.to}` : `Created as ${h.to}`}</div>
              <div className="text-muted small">{formatDateTime(h.at)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}