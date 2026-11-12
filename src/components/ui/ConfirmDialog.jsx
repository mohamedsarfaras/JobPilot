import { AlertTriangle } from 'lucide-react';
export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', isDestructive = true }) {
  if (!isOpen) return null;
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title d-flex align-items-center gap-2">
              {isDestructive && <AlertTriangle className="text-danger" size={20} />} {title}
            </h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body py-4 text-muted">{message}</div>
          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
            <button className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}