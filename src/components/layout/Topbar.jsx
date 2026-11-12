import { Menu, Bell, Plus, Briefcase, Users, CalendarPlus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal';

export default function Topbar({ onMenuClick }) {
  const { profile, notifications, markAllRead, clearAllNotifications, unreadCount } = useData();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Real-time clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U';
  const formattedTime = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = time.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="jp-topbar">
      <button className="jp-menu-btn d-lg-none" onClick={onMenuClick}><Menu size={22} /></button>
      
      <div className="jp-topbar-welcome d-none d-lg-block">
        <h5 className="mb-0">Welcome, {profile.name || 'User'} 👋</h5>
        <div className="text-muted small">Let's build your career today.</div>
      </div>

      <div className="jp-clock d-none d-md-flex flex-column align-items-center mx-auto" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="fw-bold fs-4 text-primary" style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '1px' }}>{formattedTime}</div>
        <div className="text-muted small">{formattedDate}</div>
      </div>

      <div className="jp-topbar-spacer" />

      <div className="d-flex align-items-center gap-3">
        <div className="position-relative">
          <button className="btn btn-primary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }} onClick={() => setShowQuickAdd(!showQuickAdd)}>
            <Plus size={18} />
          </button>
          {showQuickAdd && (
            <>
              <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1025 }} onClick={() => setShowQuickAdd(false)}></div>
              <div className="position-absolute end-0 mt-2 bg-white shadow rounded border" style={{ zIndex: 1030, minWidth: 180 }}>
                <Link to="/applications" className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark hover-bg" onClick={() => setShowQuickAdd(false)}><Briefcase size={16}/> Add Application</Link>
                <Link to="/people" className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark hover-bg" onClick={() => setShowQuickAdd(false)}><Users size={16}/> Add Contact</Link>
                <Link to="/daily-activity" className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark hover-bg" onClick={() => setShowQuickAdd(false)}><CalendarPlus size={16}/> Add Task</Link>
              </div>
            </>
          )}
        </div>

        <button className="btn btn-outline-secondary btn-sm rounded-circle p-2 position-relative" onClick={() => setShowNotifications(true)} title="Notifications">
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '9px' }}>{unreadCount}</span>
          )}
        </button>

        <Link to="/settings" className="jp-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center text-decoration-none overflow-hidden" style={{ width: 36, height: 36, fontWeight: 600, fontSize: 14 }}>
          {profile.profilePic ? <img src={profile.profilePic} alt="User" className="w-100 h-100 object-fit-cover" /> : initials}
        </Link>
      </div>

      <Modal isOpen={showNotifications} onClose={() => setShowNotifications(false)} title="Notifications">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted small">{unreadCount} unread</span>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-secondary" onClick={markAllRead}>Mark all read</button>
            <button className="btn btn-sm btn-outline-danger" onClick={clearAllNotifications}>Clear</button>
          </div>
        </div>
        
        {notifications.length === 0 ? (
          <div className="text-center text-muted py-4">No new notifications. You're all caught up!</div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {notifications.map((n, i) => (
              <div key={n.id || i} className={`p-3 rounded border ${n.read ? 'bg-white' : 'bg-light border-primary'}`}>
                <div className="d-flex align-items-start gap-2">
                  <div className={`rounded-circle mt-1 ${n.type === 'success' ? 'bg-success' : n.type === 'error' ? 'bg-danger' : 'bg-info'}`} style={{ width: 8, height: 8, flexShrink: 0 }}></div>
                  <div className="flex-grow-1">
                    <div className={n.read ? 'text-muted' : 'fw-semibold'}>{n.message}</div>
                    <div className="text-muted small mt-1">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <style>{`
        .jp-topbar { height: var(--jp-topbar-h); background: #fff; border-bottom: 1px solid var(--jp-border);
          display: flex; align-items: center; padding: 0 1.5rem; position: sticky; top: 0; z-index: 1020; gap: 1rem; }
        .jp-topbar-spacer { flex: 1; }
        .jp-menu-btn { background: none; border: 1px solid var(--jp-border); border-radius: var(--jp-radius-sm);
          padding: 0.4rem 0.5rem; color: var(--jp-text); display: flex; align-items: center; cursor: pointer; }
        .hover-bg:hover { background: #f1f5f9; }
        [data-bs-theme="dark"] .jp-topbar { background: #1e293b; border-color: #334155; }
        [data-bs-theme="dark"] .position-absolute.bg-white { background: #1e293b !important; border-color: #334155 !important; }
        [data-bs-theme="dark"] .text-dark { color: #f1f5f9 !important; }
        [data-bs-theme="dark"] .hover-bg:hover { background: #334155; }
        [data-bs-theme="dark"] .bg-light { background: #0f172a !important; }
      `}</style>
    </header>
  );
}