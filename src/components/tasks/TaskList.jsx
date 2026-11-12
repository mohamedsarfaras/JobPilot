import { CheckCircle2, Circle, Trash2, Edit2 } from 'lucide-react';
import { formatDate } from '../../utils/dates';

export default function TaskList({ tasks, onToggle, onEdit, onDelete, showDate = false }) {
  if (tasks.length === 0) return <div className="text-muted p-3 text-center">No tasks found.</div>;

  return (
    <div className="list-group list-group-flush">
      {tasks.map(t => (
        <div key={t.id} className="list-group-item d-flex align-items-start gap-3 py-3 px-0 border-bottom">
          <button className="btn btn-link p-0 text-decoration-none mt-1" onClick={() => onToggle(t.id)}>
            {t.completed ? <CheckCircle2 className="text-success" size={20} /> : <Circle className="text-muted" size={20} />}
          </button>
          <div className="flex-grow-1">
            <div className={`fw-semibold ${t.completed ? 'text-decoration-line-through text-muted' : ''}`}>
              {t.title}
            </div>
            {t.description && <div className="text-muted small mt-1">{t.description}</div>}
            <div className="d-flex gap-2 mt-2 flex-wrap">
              {showDate && <span className="badge bg-light text-dark border">{formatDate(t.date)}</span>}
              <span className="badge bg-light text-dark border">{t.category}</span>
              <span className={`badge priority-${t.priority.toLowerCase()}`}>{t.priority} Priority</span>
            </div>
          </div>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-link text-primary p-1" onClick={() => onEdit(t)}><Edit2 size={16}/></button>
            <button className="btn btn-sm btn-link text-danger p-1" onClick={() => onDelete(t)}><Trash2 size={16}/></button>
          </div>
        </div>
      ))}
    </div>
  );
}