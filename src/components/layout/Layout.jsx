import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  return (
    <div className="jp-shell">
      <Sidebar onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="jp-backdrop d-lg-none" onClick={() => setSidebarOpen(false)} />}
      <div className="jp-main">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="jp-content"><Outlet /></main>
      </div>
      <style>{`
        .jp-shell { min-height: 100vh; }
        .jp-main { margin-left: var(--jp-sidebar-w); min-height: 100vh; display: flex; flex-direction: column; }
        .jp-content { flex: 1; }
        .jp-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.4); z-index: 1030; }
        @media (max-width: 991.98px) {
          .jp-main { margin-left: 0; }
          .jp-shell:has(.jp-backdrop) .jp-sidebar { transform: translateX(0) !important; }
        }
      `}</style>
    </div>
  );
}