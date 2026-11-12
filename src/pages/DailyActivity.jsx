import { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Plus, Calendar, Bell, Target, Sparkles } from 'lucide-react';
import { todayISO, toISODate, formatDate } from '../utils/dates';
import { QUOTES } from '../data/quotes';
import ApplicationForm from '../components/applications/ApplicationForm';
import ContactForm from '../components/contacts/ContactForm';

export default function DailyActivity() {
  const { tasks, applications, contacts, deleteTask, toggleTask, saveDailyNote, dailyNotes, preferences } = useData();
  const toast = useToast();
  
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  
  const [viewingAppId, setViewingAppId] = useState(null);
  const [viewingContactId, setViewingContactId] = useState(null);

  const currentNote = dailyNotes.find(n => n.date === selectedDate);
  const [accomplished, setAccomplished] = useState('');
  const [problems, setProblems] = useState('');
  const [tomorrow, setTomorrow] = useState('');
  const [otherNotes, setOtherNotes] = useState('');

  useEffect(() => {
    if (currentNote) {
      setAccomplished(currentNote.accomplished || ''); setProblems(currentNote.problems || ''); setTomorrow(currentNote.tomorrow || ''); setOtherNotes(currentNote.otherNotes || '');
    } else { setAccomplished(''); setProblems(''); setTomorrow(''); setOtherNotes(''); }
  }, [selectedDate, currentNote]);

  const handleSaveNote = () => { saveDailyNote(selectedDate, { accomplished, problems, tomorrow, otherNotes }); toast.success('Daily log saved'); };

  const filteredTasks = useMemo(() => {
    const target = toISODate(selectedDate);
    return tasks.filter(t => {
      const due = toISODate(t.date);
      if (t.completed) {
        const completedDate = toISODate(t.completedAt);
        return completedDate >= target;
      }
      return due >= target;
    });
  }, [tasks, selectedDate]);

  const pendingTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const dueFollowUps = useMemo(() => {
    const today = todayISO();
    const list = [];
    applications.forEach(a => {
      if (a.followUpDate && a.followUpDate <= today && !['Selected','Rejected','Withdrawn','No Response'].includes(a.status)) {
        list.push({ type: 'App', id: a.id, name: a.company, sub: a.jobTitle, date: a.followUpDate });
      }
    });
    contacts.forEach(c => {
      if (c.nextFollowUp && c.nextFollowUp <= today && c.responseStatus !== 'No Response') {
        list.push({ type: 'Contact', id: c.id, name: c.fullName, sub: c.company, date: c.nextFollowUp });
      }
    });
    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [applications, contacts]);

  const recApps = preferences?.recommendApps || 10;
  const recContacts = preferences?.recommendContacts || 5;
  const todaysApps = applications.filter(a => a.appliedDate === todayISO()).length;
  const todaysContacts = contacts.filter(c => c.firstContacted === todayISO()).length;
  
  const recTasks = [];
  if (preferences.showRecommendations !== false) {
    if (todaysApps < recApps) recTasks.push({ type: 'app', label: `Apply to ${recApps - todaysApps} more companies` });
    if (todaysContacts < recContacts) recTasks.push({ type: 'contact', label: `Contact ${recContacts - todaysContacts} more recruiters` });
  }

  // Quotes Logic
  const [quotes, setQuotes] = useState([]);
  useEffect(() => {
    if (preferences.showMotivationalPics === false) { setQuotes([]); return; }
    const updateQuotes = () => {
      const shuffled = [...QUOTES].sort(() => 0.5 - Math.random());
      setQuotes(shuffled.slice(0, 2));
    };
    updateQuotes();
    const interval = setInterval(updateQuotes, 3600000);
    return () => clearInterval(interval);
  }, [preferences.showMotivationalPics]);

  const handleDelete = () => {
    if (deletingTask) { deleteTask(deletingTask.id); toast.success('Task deleted'); setDeletingTask(null); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Daily Activity</h1>
        <button className="btn btn-primary" onClick={() => { setEditingTask(null); setIsFormOpen(true); }}>
          <Plus size={16} className="me-1"/> Add Task
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0 d-flex align-items-center gap-2"><Calendar size={18}/> Tasks for {formatDate(selectedDate)}</h5>
              <input type="date" className="form-control form-control-sm" style={{ width: 'auto' }} value={selectedDate} max={todayISO()} onChange={e => setSelectedDate(e.target.value)} />
            </div>
            <div className="card-body">
              <h6 className="text-muted mb-3">Pending ({pendingTasks.length})</h6>
              <TaskList tasks={pendingTasks} onToggle={toggleTask} onEdit={(t) => { setEditingTask(t); setIsFormOpen(true); }} onDelete={setDeletingTask} showDate={true} />
              <hr className="my-4" />
              <h6 className="text-muted mb-3">Completed ({completedTasks.length})</h6>
              <TaskList tasks={completedTasks} onToggle={toggleTask} onEdit={(t) => { setEditingTask(t); setIsFormOpen(true); }} onDelete={setDeletingTask} showDate={true} />
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-transparent py-3"><h5 className="mb-0">Daily Log - {formatDate(selectedDate)}</h5></div>
            <div className="card-body">
              <div className="mb-3"><label className="form-label fw-semibold">What did I accomplish?</label><textarea className="form-control" rows="2" value={accomplished} onChange={e => setAccomplished(e.target.value)}></textarea></div>
              <div className="mb-3"><label className="form-label fw-semibold">What problems occurred?</label><textarea className="form-control" rows="2" value={problems} onChange={e => setProblems(e.target.value)}></textarea></div>
              <div className="mb-3"><label className="form-label fw-semibold">What should be done tomorrow?</label><textarea className="form-control" rows="2" value={tomorrow} onChange={e => setTomorrow(e.target.value)}></textarea></div>
              <div className="mb-3"><label className="form-label fw-semibold">Other Notes</label><textarea className="form-control" rows="2" value={otherNotes} onChange={e => setOtherNotes(e.target.value)} placeholder="Any additional thoughts..."></textarea></div>
              <div className="d-flex justify-content-end"><button className="btn btn-primary" onClick={handleSaveNote}>Save Note</button></div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 d-flex flex-column gap-3">
          <div className="card bg-light border-0">
            <div className="card-body">
              <h6 className="d-flex align-items-center gap-2 mb-3 fw-bold"><Bell size={16} className="text-warning"/> Pending Follow-ups</h6>
              {dueFollowUps.length === 0 ? <div className="text-muted small">All caught up!</div> : (
                <div className="d-flex flex-column gap-2">
                  {dueFollowUps.map((f, i) => (
                    <div key={i} className="bg-white p-2 rounded border shadow-sm cursor-pointer" onClick={() => f.type === 'App' ? setViewingAppId(f.id) : setViewingContactId(f.id)}>
                      <div className="d-flex justify-content-between align-items-start mb-1"><span className="badge bg-secondary" style={{fontSize: '10px'}}>{f.type}</span><span className="text-danger fw-bold" style={{fontSize: '11px'}}>{formatDate(f.date)}</span></div>
                      <div className="fw-semibold text-truncate">{f.name}</div>
                      <div className="text-muted text-truncate" style={{fontSize: '12px'}}>{f.sub}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {recTasks.length > 0 && (
            <div className="card bg-light border-0">
              <div className="card-body">
                <h6 className="d-flex align-items-center gap-2 mb-3 fw-bold"><Target size={16} className="text-primary"/> Recommended</h6>
                <div className="d-flex flex-column gap-2">
                  {recTasks.map((r, i) => (
                    <div key={i} className="bg-white p-2 rounded border shadow-sm d-flex align-items-center justify-content-between cursor-pointer" onClick={() => window.location.href = r.type === 'app' ? '/applications' : '/people'}>
                      <span className="fw-medium" style={{fontSize: '13px'}}>{r.label}</span>
                      <Sparkles size={14} className="text-warning" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Motivational Quotes - With Text Overlay */}
          {quotes.length > 0 && (
            <div className="d-flex flex-column gap-3 flex-grow-1">
              {quotes.map((q, i) => (
                <div key={i} className="card border-0 shadow-sm overflow-hidden flex-grow-1 position-relative" style={{ minHeight: '150px' }}>
                  <img src={q.bg} alt="Motivation Bg" className="w-100 h-100 object-fit-cover position-absolute top-0 start-0" style={{ zIndex: 0 }} />
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center p-3" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1 }}>
                    <h6 className="text-white fw-bold mb-2" style={{ fontStyle: 'italic', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>"{q.text}"</h6>
                    <div className="text-white-50 small">— {q.author}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingTask ? 'Edit Task' : 'Add Task'}>
        <TaskForm initialData={editingTask} onClose={() => setIsFormOpen(false)} />
      </Modal>

      <Modal isOpen={!!viewingAppId} onClose={() => setViewingAppId(null)} title="Application Details" size="lg">
        <ApplicationForm initialData={applications.find(a => a.id === viewingAppId)} onClose={() => setViewingAppId(null)} />
      </Modal>

      <Modal isOpen={!!viewingContactId} onClose={() => setViewingContactId(null)} title="Contact Details" size="lg">
        <ContactForm initialData={contacts.find(c => c.id === viewingContactId)} onClose={() => setViewingContactId(null)} />
      </Modal>

      <ConfirmDialog isOpen={!!deletingTask} title="Delete Task" message="Are you sure you want to delete this task?" onConfirm={handleDelete} onCancel={() => setDeletingTask(null)} />
    </div>
  );
}