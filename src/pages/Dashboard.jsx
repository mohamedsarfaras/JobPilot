import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Briefcase, Users, CalendarCheck, TrendingUp, Award, XCircle, ArrowRight, Flame, CheckCircle2, Circle, FileText, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatDate, todayISO } from '../utils/dates';
import { STATUS_CLASS_MAP } from '../data/constants';

export default function Dashboard() {
  const { applications, contacts, tasks, dailyNotes, streak, profile } = useData();

  const stats = useMemo(() => {
    let interviews = 0, offers = 0, rejections = 0;
    applications.forEach(app => {
      const statuses = (app.statusHistory || []).map(h => h.to);
      if (statuses.includes('Interview')) interviews++;
      if (statuses.includes('Selected')) offers++;
      if (statuses.includes('Rejected')) rejections++;
    });
    return { total: applications.length, interviews, offers, rejections, people: contacts.length };
  }, [applications, contacts]);

  const recentApps = useMemo(() => [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5), [applications]);
  const recentContacts = useMemo(() => [...contacts].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3), [contacts]);
  const chartData = useMemo(() => { const counts = {}; applications.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1; }); return Object.keys(counts).map(key => ({ name: key, count: counts[key] })); }, [applications]);
  const COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#d97706', '#059669', '#dc2626', '#64748b', '#475569'];

  const today = todayISO();
  const todaysTasks = useMemo(() => tasks.filter(t => t.date === today && !t.completed), [tasks, today]);
  const todaysNote = useMemo(() => dailyNotes.find(n => n.date === today), [dailyNotes, today]);
  
  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted mb-0">Here is what's happening with your job search.</p>
        </div>
        {streak > 0 && <div className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"><Flame size={16} /> {streak} Day Streak!</div>}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-4 col-xl-2"><div className="card h-100 border-0 shadow-sm border-start border-4 border-primary"><div className="card-body p-3"><div className="d-flex justify-content-between align-items-start mb-2"><span className="text-muted small fw-semibold">TOTAL APPS</span><Briefcase size={16} className="text-primary"/></div><h3 className="mb-0">{stats.total}</h3></div></div></div>
        <div className="col-6 col-md-4 col-xl-2"><div className="card h-100 border-0 shadow-sm border-start border-4 border-info"><div className="card-body p-3"><div className="d-flex justify-content-between align-items-start mb-2"><span className="text-muted small fw-semibold">INTERVIEWS</span><TrendingUp size={16} className="text-info"/></div><h3 className="mb-0">{stats.interviews}</h3></div></div></div>
        <div className="col-6 col-md-4 col-xl-2"><div className="card h-100 border-0 shadow-sm border-start border-4 border-success"><div className="card-body p-3"><div className="d-flex justify-content-between align-items-start mb-2"><span className="text-muted small fw-semibold">OFFERS</span><Award size={16} className="text-success"/></div><h3 className="mb-0">{stats.offers}</h3></div></div></div>
        <div className="col-6 col-md-4 col-xl-2"><div className="card h-100 border-0 shadow-sm border-start border-4 border-danger"><div className="card-body p-3"><div className="d-flex justify-content-between align-items-start mb-2"><span className="text-muted small fw-semibold">REJECTIONS</span><XCircle size={16} className="text-danger"/></div><h3 className="mb-0">{stats.rejections}</h3></div></div></div>
        <div className="col-6 col-md-4 col-xl-2"><div className="card h-100 border-0 shadow-sm border-start border-4 border-secondary"><div className="card-body p-3"><div className="d-flex justify-content-between align-items-start mb-2"><span className="text-muted small fw-semibold">CONTACTS</span><Users size={16} className="text-secondary"/></div><h3 className="mb-0">{stats.people}</h3></div></div></div>
        <div className="col-6 col-md-4 col-xl-2"><div className="card h-100 border-0 shadow-sm bg-primary text-white"><div className="card-body p-3"><div className="d-flex justify-content-between align-items-start mb-2"><span className="small fw-semibold" style={{opacity: 0.8}}>PROFILE</span><CalendarCheck size={16}/></div><Link to="/settings" className="text-white text-decoration-none small fw-bold">Edit Profile <ArrowRight size={14}/></Link></div></div></div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8"><div className="card h-100"><div className="card-header bg-transparent border-0 pt-4 pb-0"><h5 className="mb-0">Application Pipeline</h5></div><div className="card-body" style={{ height: 300 }}>{applications.length === 0 ? <div className="h-100 d-flex align-items-center justify-content-center text-muted">Add applications to see your pipeline.</div> : (<ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}><XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} /><Bar dataKey="count" radius={[4, 4, 0, 0]}>{chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Bar></BarChart></ResponsiveContainer>)}</div></div></div>
        <div className="col-lg-4"><div className="card h-100"><div className="card-header bg-transparent border-0 pt-4 pb-0 d-flex justify-content-between align-items-center"><h5 className="mb-0">Recent Applications</h5><Link to="/applications" className="small text-decoration-none">View All</Link></div><div className="card-body">{recentApps.length === 0 ? <div className="text-muted small">No applications yet.</div> : (<div className="d-flex flex-column gap-3">{recentApps.map(a => (<div key={a.id} className="d-flex justify-content-between align-items-center border-bottom pb-2"><div><div className="fw-semibold">{a.company}</div><div className="text-muted small">{a.jobTitle}</div></div><span className={`badge-status status-${STATUS_CLASS_MAP[a.status] || 'applied'}`}>{a.status}</span></div>))}</div>)}</div></div></div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6"><div className="card h-100"><div className="card-header bg-transparent border-0 pt-4 pb-0 d-flex justify-content-between align-items-center"><h5 className="mb-0">Recent Networking</h5><Link to="/people" className="small text-decoration-none">View All</Link></div><div className="card-body">{recentContacts.length === 0 ? <div className="text-muted small">No contacts yet.</div> : (<div className="d-flex flex-column gap-3">{recentContacts.map(c => (<div key={c.id} className="d-flex justify-content-between align-items-center border-bottom pb-2"><div><div className="fw-semibold">{c.fullName}</div><div className="text-muted small">{c.company} • {c.contactType}</div></div><span className={`badge ${c.responseStatus === 'Replied' ? 'bg-success' : c.responseStatus === 'No Response' ? 'bg-danger' : 'bg-secondary'}`}>{c.responseStatus}</span></div>))}</div>)}</div></div></div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="mb-3">Career Snapshot</h5>
              {profile.name ? (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <div className="fw-bold fs-5">{profile.name}</div>
                      <div className="text-muted mb-2">{profile.email}</div>
                    </div>
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm overflow-hidden" style={{ width: 64, height: 64, fontSize: 22, fontWeight: 600 }}>
                      {profile.profilePic ? <img src={profile.profilePic} alt="User" className="w-100 h-100 object-fit-cover" /> : initials}
                    </div>
                  </div>
                  <div className="text-muted small mb-4 text-truncate-2 flex-grow-1">{profile.aboutMe || 'No bio added yet. Update your profile in settings.'}</div>
                  
                  <div className="row g-2">
                    <div className="col-6 col-sm-3">
                      {profile.linkedin ? <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm w-100">LinkedIn</a> : <button className="btn btn-outline-secondary btn-sm w-100" disabled>LinkedIn</button>}
                    </div>
                    <div className="col-6 col-sm-3">
                      {profile.github ? <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-dark btn-sm w-100">GitHub</a> : <button className="btn btn-outline-secondary btn-sm w-100" disabled>GitHub</button>}
                    </div>
                    <div className="col-6 col-sm-3">
                      {profile.portfolio ? <a href={profile.portfolio} target="_blank" rel="noreferrer" className="btn btn-info btn-sm w-100 text-white">Portfolio</a> : <button className="btn btn-outline-secondary btn-sm w-100" disabled>Portfolio</button>}
                    </div>
                    <div className="col-6 col-sm-3">
                      {profile.resumeUrl ? <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-success btn-sm w-100">Resume</a> : <button className="btn btn-outline-secondary btn-sm w-100" disabled>Resume</button>}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-muted d-flex align-items-center justify-content-center h-100">Complete your <Link to="/settings" className="ms-1">profile</Link> to see your snapshot here.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-transparent border-0 pt-4 pb-0 d-flex justify-content-between align-items-center"><h5 className="mb-0">Today's Activity</h5><Link to="/daily-activity" className="small text-decoration-none">Go to Daily Activity</Link></div>
        <div className="card-body"><div className="row g-4">
          <div className="col-md-6 border-end-md"><h6 className="fw-semibold text-muted mb-3 d-flex align-items-center gap-2"><CheckCircle2 size={16}/> Pending Tasks ({todaysTasks.length})</h6>{todaysTasks.length === 0 ? <div className="text-muted small">No pending tasks for today. You're all caught up!</div> : (<div className="d-flex flex-column gap-2">{todaysTasks.slice(0, 4).map(t => (<div key={t.id} className="d-flex align-items-center gap-2 bg-light p-2 rounded"><Circle size={14} className="text-muted"/><span className="text-truncate">{t.title}</span><span className={`badge ms-auto priority-${t.priority.toLowerCase()}`}>{t.priority}</span></div>))}{todaysTasks.length > 4 && <div className="text-muted small mt-1">+ {todaysTasks.length - 4} more tasks</div>}</div>)}</div>
          <div className="col-md-6"><h6 className="fw-semibold text-muted mb-3 d-flex align-items-center gap-2"><FileText size={16}/> Today's Log</h6>{!todaysNote || (!todaysNote.accomplished && !todaysNote.tomorrow) ? <div className="text-muted small">No log written for today yet. <Link to="/daily-activity">Write one now</Link>.</div> : (<div className="bg-light p-3 rounded">{todaysNote.accomplished && <div className="mb-2"><strong className="small text-muted d-block">Accomplished:</strong> <span className="small">{todaysNote.accomplished}</span></div>}{todaysNote.tomorrow && <div><strong className="small text-muted d-block">Tomorrow:</strong> <span className="small">{todaysNote.tomorrow}</span></div>}</div>)}</div>
        </div></div>
      </div>
    </div>
  );
}