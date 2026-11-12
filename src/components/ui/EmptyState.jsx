import { Inbox } from 'lucide-react';
export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="text-center py-5">
      <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3" style={{ width: 64, height: 64 }}>
        <Inbox size={32} className="text-muted" />
      </div>
      <h5>{title}</h5>
      <p className="text-muted mb-4">{message}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}