import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, CalendarCheck, Settings, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

const navItems = [
  { to: '/',               label: 'Dashboard',       icon: LayoutDashboard, end: true },
  { to: '/applications',   label: 'Applications',    icon: Briefcase },
  { to: '/people',         label: 'People & Networking', icon: Users },
  { to: '/daily-activity', label: 'Daily Activity',  icon: CalendarCheck },
  { to: '/settings',       label: 'Settings',        icon: Settings },
];

export default function Sidebar({ onNavigate }) {
  const { profile } = useData();
  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U';

  return (
    <aside className="jp-sidebar">
      <div className="jp-sidebar-header">
        <div className="jp-logo">
          <span className="jp-logo-mark">JP</span>
          <span className="jp-logo-text">JobPilot</span>
        </div>
        <button className="jp-sidebar-close d-lg-none" onClick={onNavigate} aria-label="Close menu"><X size={20} /></button>
      </div>
      <nav className="jp-nav">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `jp-nav-item${isActive ? ' active' : ''}`}
            onClick={onNavigate}>
            <Icon size={18} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="jp-sidebar-footer">
        <div className="jp-user">
          <div className="jp-user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center overflow-hidden" style={{ width: 36, height: 36, fontSize: 13, fontWeight: 600 }}>
             {profile.profilePic ? <img src={profile.profilePic} alt="User" className="w-100 h-100 object-fit-cover" /> : initials}
          </div>
          <div className="jp-user-info">
            <div className="jp-user-name">{profile.name || 'My Account'}</div>
            <div className="jp-user-sub">Personal workspace</div>
          </div>
        </div>
      </div>
      <style>{`
        .jp-sidebar { width: var(--jp-sidebar-w); height: 100vh; background: #fff;
          border-right: 1px solid var(--jp-border); display: flex; flex-direction: column;
          position: fixed; top: 0; left: 0; z-index: 1040; }
        .jp-sidebar-header { height: var(--jp-topbar-h); padding: 0 1.25rem; border-bottom: 1px solid var(--jp-border);
          display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; }
        .jp-logo { display: flex; align-items: center; gap: 0.6rem; }
        .jp-logo-mark { width: 30px; height: 30px; border-radius: 8px; background: var(--jp-primary);
          color: #fff; display: grid; place-items: center; font-weight: 700; font-size: 13px; }
        .jp-logo-text { font-weight: 700; font-size: 17px; color: var(--jp-text); }
        .jp-sidebar-close { background: none; border: none; color: var(--jp-text-muted); cursor: pointer; padding: 4px; display: flex; }
        .jp-nav { flex: 1; padding: 0.75rem 0.75rem; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
        .jp-nav-item { display: flex; align-items: center; gap: 0.7rem; padding: 0.6rem 0.75rem;
          border-radius: var(--jp-radius-sm); color: var(--jp-text-muted); font-size: 14px;
          font-weight: 500; text-decoration: none; transition: all 0.15s ease; }
        .jp-nav-item:hover { background: #f1f5f9; color: var(--jp-text); text-decoration: none; }
        .jp-nav-item.active { background: var(--jp-primary-soft); color: var(--jp-primary); font-weight: 600; }
        .jp-sidebar-footer { padding: 0.85rem 1rem; border-top: 1px solid var(--jp-border); }
        .jp-user { display: flex; align-items: center; gap: 0.65rem; }
        .jp-user-avatar { flex-shrink: 0; }
        .jp-user-name { font-size: 13.5px; font-weight: 600; color: var(--jp-text); line-height: 1.2; }
        .jp-user-sub { font-size: 12px; color: var(--jp-text-muted); }
        @media (max-width: 991.98px) {
          .jp-sidebar { transform: translateX(-100%); transition: transform 0.25s ease; box-shadow: var(--jp-shadow-md); }
          .jp-sidebar.open { transform: translateX(0); }
        }
      `}</style>
    </aside>
  );
}