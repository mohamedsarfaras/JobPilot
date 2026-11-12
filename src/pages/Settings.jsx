import { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { User, Sliders, Tag, Download, AlertTriangle, Plus, Trash2, Edit2, Check, X, FileJson, FileText, BrainCircuit, Camera } from 'lucide-react';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function Settings() {
  const { profile, updateProfile, preferences, updatePreferences, categories, updateCategories, moveCategoryItems, applications, contacts, tasks, dailyNotes, replaceAll, clearAllData } = useData();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [catTab, setCatTab] = useState('sources');
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState(profile);
  const handleProfileSave = (e) => { e.preventDefault(); updateProfile(profileForm); toast.success('Profile saved'); };
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    updatePreferences({ [name]: type === 'checkbox' ? checked : value });
  };

  // Image Upload Logic (Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be less than 2MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm(prev => ({ ...prev, profilePic: reader.result }));
      toast.success('Image loaded. Click "Save Profile" to apply.');
    };
    reader.readAsDataURL(file);
  };

  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState({ oldName: '', newName: '' });
  const [targetCategory, setTargetCategory] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const getCategoryList = () => categories[catTab];

  const handleAddCategory = () => {
    const name = newCatName.trim();
    if (!name) return;
    const currentList = getCategoryList();
    if (currentList.includes(name)) { toast.error('Category already exists'); return; }
    const otherIndex = currentList.indexOf('Other');
    const newList = [...currentList];
    if (otherIndex !== -1) newList.splice(otherIndex, 0, name);
    else newList.push(name);
    updateCategories({ ...categories, [catTab]: newList }, {});
    setNewCatName(''); toast.success('Category added');
  };

  const handleDeleteCategory = (cat) => {
    if (cat === 'Other') { toast.error('Cannot delete "Other"'); return; }
    const newList = getCategoryList().filter(c => c !== cat);
    updateCategories({ ...categories, [catTab]: newList }, { [catTab]: { [cat]: 'Other' } });
    toast.success('Category deleted. Items moved to Other.');
  };

  const handleSaveRename = (oldName) => {
    const newName = editingCat.newName.trim();
    if (!newName || newName === oldName) { setEditingCat({ oldName: '', newName: '' }); return; }
    const newList = getCategoryList().map(c => c === oldName ? newName : c);
    updateCategories({ ...categories, [catTab]: newList }, { [catTab]: { [oldName]: newName } });
    setEditingCat({ oldName: '', newName: '' }); toast.success('Category renamed');
  };

  const handleMoveItems = () => {
    if (!targetCategory) { toast.error('Select a target category'); return; }
    moveCategoryItems(catTab, targetCategory, selectedItems);
    setSelectedItems([]); setTargetCategory('');
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const backup = { applications, contacts, tasks, dailyNotes, preferences, profile, categories, version: '1' };
    downloadFile(JSON.stringify(backup, null, 2), `jobpilot-backup-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    toast.success('Backup downloaded');
  };

  const handleExportCSV = () => {
    if (applications.length === 0) { toast.error('No applications to export'); return; }
    const headers = ['Company', 'Job Title', 'Location', 'Applied Date', 'Status', 'Source', 'Follow-up Date', 'Recruiter', 'Salary', 'Job URL', 'Notes'];
    const rows = applications.map(a => [a.company, a.jobTitle, a.location, a.appliedDate, a.status, a.source, a.followUpDate, a.recruiterName, a.salary, a.jobUrl, a.notes].map(v => `"${(v || '').toString().replace(/"/g, '""')}"`).join(','));
    downloadFile([headers.join(','), ...rows].join('\n'), `jobpilot-applications-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    toast.success('CSV downloaded');
  };

  const handleExportAI = () => {
    let md = `# AI Career Brief\n\n**Generated:** ${new Date().toLocaleString()}\n\n`;
    md += `## The Prompt\n> Act as an expert career coach. Review the following data about my job search, my resume profile, and my pending applications. Provide actionable advice on what I should focus on this week, how to improve my applications, and where I am falling short.\n\n`;
    md += `## My Profile\n- **Name:** ${profile.name || 'N/A'}\n- **Email:** ${profile.email || 'N/A'}\n- **Phone:** ${profile.phone || 'N/A'}\n- **LinkedIn:** ${profile.linkedin || 'N/A'}\n- **GitHub:** ${profile.github || 'N/A'}\n- **Portfolio:** ${profile.portfolio || 'N/A'}\n- **Resume URL:** ${profile.resumeUrl || 'N/A'}\n- **About Me:** ${profile.aboutMe || 'N/A'}\n\n`;
    md += `## Job Search Stats\n- **Total Applications:** ${applications.length}\n- **Interviews:** ${applications.filter(a => a.status === 'Interview' || (a.statusHistory || []).some(h => h.to === 'Interview')).length}\n- **Offers:** ${applications.filter(a => a.status === 'Selected' || (a.statusHistory || []).some(h => h.to === 'Selected')).length}\n- **Rejections:** ${applications.filter(a => a.status === 'Rejected' || (a.statusHistory || []).some(h => h.to === 'Rejected')).length}\n- **Contacts:** ${contacts.length}\n\n`;
    md += `## Applications\n`; applications.forEach(a => { md += `- **${a.company}** - ${a.jobTitle} (${a.status}) - Applied: ${a.appliedDate}\n`; });
    md += `\n## Contacts\n`; contacts.forEach(c => { md += `- **${c.fullName}** (${c.contactType}) at ${c.company} - Status: ${c.responseStatus}\n`; });
    downloadFile(md, `ai-career-brief-${new Date().toISOString().split('T')[0]}.md`, 'text/markdown');
    toast.success('AI Brief downloaded');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.applications || !data.contacts) throw new Error('Invalid backup file');
        if (window.confirm('This will replace ALL current data. Are you sure?')) {
          replaceAll(data); toast.success('Data restored successfully');
        }
      } catch (err) { toast.error('Invalid JSON backup file'); }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const handleClear = () => { clearAllData(); setShowClearConfirm(false); };

  const getOtherItems = () => {
    if (catTab === 'sources') return applications.filter(a => a.source === 'Other');
    if (catTab === 'contactTypes') return contacts.filter(c => c.contactType === 'Other');
    if (catTab === 'taskCategories') return tasks.filter(t => t.category === 'Other');
    return [];
  };

  return (
    <div className="page-container">
      <div className="page-header"><h1>Settings</h1></div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item"><button className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><User size={16} className="me-1"/> Profile</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`} onClick={() => setActiveTab('preferences')}><Sliders size={16} className="me-1"/> Preferences</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}><Tag size={16} className="me-1"/> Categories</button></li>
        <li className="nav-item"><button className={`nav-link ${activeTab === 'export' ? 'active' : ''}`} onClick={() => setActiveTab('export')}><Download size={16} className="me-1"/> Data & Export</button></li>
        <li className="nav-item"><button className={`nav-link text-danger ${activeTab === 'danger' ? 'active' : ''}`} onClick={() => setActiveTab('danger')}><AlertTriangle size={16} className="me-1"/> Danger Zone</button></li>
      </ul>

      <div className="tab-content">
        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div className="card"><div className="card-body">
            <h5 className="mb-4">Career Profile</h5>
            <form onSubmit={handleProfileSave}>
              <div className="row g-4 mb-4 align-items-center">
                <div className="col-auto">
                  <div className="position-relative">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm overflow-hidden" style={{ width: 80, height: 80, fontSize: 28, fontWeight: 600 }}>
                      {profileForm.profilePic ? <img src={profileForm.profilePic} alt="Profile" className="w-100 h-100 object-fit-cover" /> : (profileForm.name ? profileForm.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                    </div>
                    <button type="button" className="btn btn-sm btn-light border position-absolute bottom-0 end-0 rounded-circle p-1 shadow-sm" onClick={() => imageInputRef.current.click()} title="Upload Photo">
                      <Camera size={14} />
                    </button>
                    <input type="file" ref={imageInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>
                <div className="col">
                  <h6 className="mb-1">Profile Picture</h6>
                  <div className="text-muted small">Upload a square image (max 2MB). This will be used in the Header, Sidebar, and Dashboard.</div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6"><label className="form-label">Full Name</label><input type="text" className="form-control" value={profileForm.name || ''} onChange={e => setProfileForm({...profileForm, name: e.target.value})} /></div>
                <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" value={profileForm.email || ''} onChange={e => setProfileForm({...profileForm, email: e.target.value})} /></div>
                <div className="col-md-6"><label className="form-label">Phone</label><input type="text" className="form-control" value={profileForm.phone || ''} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} /></div>
                <div className="col-md-6"><label className="form-label">LinkedIn URL</label><input type="url" className="form-control" value={profileForm.linkedin || ''} onChange={e => setProfileForm({...profileForm, linkedin: e.target.value})} /></div>
                <div className="col-md-6"><label className="form-label">GitHub URL</label><input type="url" className="form-control" value={profileForm.github || ''} onChange={e => setProfileForm({...profileForm, github: e.target.value})} /></div>
                <div className="col-md-6"><label className="form-label">Portfolio URL</label><input type="url" className="form-control" value={profileForm.portfolio || ''} onChange={e => setProfileForm({...profileForm, portfolio: e.target.value})} /></div>
                <div className="col-12"><label className="form-label">Resume URL</label><input type="url" className="form-control" value={profileForm.resumeUrl || ''} onChange={e => setProfileForm({...profileForm, resumeUrl: e.target.value})} /></div>
                <div className="col-12"><label className="form-label">About Me</label><textarea className="form-control" rows="3" value={profileForm.aboutMe || ''} onChange={e => setProfileForm({...profileForm, aboutMe: e.target.value})}></textarea></div>
              </div>
              <div className="d-flex justify-content-end mt-4"><button type="submit" className="btn btn-primary">Save Profile</button></div>
            </form>
          </div></div>
        )}

        {/* PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="card"><div className="card-body">
            <h5 className="mb-4">Preferences</h5>
            <div className="mb-4">
              <label className="form-label fw-bold">Theme</label>
              <div className="d-flex gap-3">
                <button className={`btn ${preferences.theme === 'light' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => updatePreferences({ theme: 'light' })}>Light</button>
                <button className={`btn ${preferences.theme === 'dark' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => updatePreferences({ theme: 'dark' })}>Dark</button>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold">Daily Goals</label>
              <div className="row g-3">
                <div className="col-md-6"><label className="form-label">Apply to X companies</label><input type="number" className="form-control" name="recommendApps" value={preferences.recommendApps || 10} onChange={handlePreferenceChange} /></div>
                <div className="col-md-6"><label className="form-label">Contact X recruiters</label><input type="number" className="form-control" name="recommendContacts" value={preferences.recommendContacts || 5} onChange={handlePreferenceChange} /></div>
              </div>
            </div>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="showRecs" name="showRecommendations" checked={preferences.showRecommendations !== false} onChange={handlePreferenceChange} />
              <label className="form-check-label" htmlFor="showRecs">Show Recommended Tasks</label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="showMotivational" name="showMotivationalPics" checked={preferences.showMotivationalPics !== false} onChange={handlePreferenceChange} />
              <label className="form-check-label" htmlFor="showMotivational">Show Motivational Quotes (Daily Activity)</label>
            </div>
          </div></div>
        )}

        {/* CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="card"><div className="card-body">
            <h5 className="mb-4">Categories</h5>
            <ul className="nav nav-pills mb-4">
              <li className="nav-item"><button className={`nav-link ${catTab === 'sources' ? 'active' : ''}`} onClick={() => { setCatTab('sources'); setSelectedItems([]); }}>Application Sources</button></li>
              <li className="nav-item"><button className={`nav-link ${catTab === 'contactTypes' ? 'active' : ''}`} onClick={() => { setCatTab('contactTypes'); setSelectedItems([]); }}>Contact Types</button></li>
              <li className="nav-item"><button className={`nav-link ${catTab === 'taskCategories' ? 'active' : ''}`} onClick={() => { setCatTab('taskCategories'); setSelectedItems([]); }}>Task Categories</button></li>
            </ul>
            <div className="d-flex gap-2 mb-4">
              <input type="text" className="form-control" placeholder="Add new category..." value={newCatName} onChange={e => setNewCatName(e.target.value)} />
              <button className="btn btn-primary" onClick={handleAddCategory}><Plus size={16} className="me-1"/> Add</button>
            </div>
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <tbody>
                  {getCategoryList().map(cat => (
                    <tr key={cat}>
                      <td>
                        {editingCat.oldName === cat ? (
                          <div className="d-flex gap-2">
                            <input type="text" className="form-control form-control-sm" value={editingCat.newName} onChange={e => setEditingCat({...editingCat, newName: e.target.value})} autoFocus />
                            <button className="btn btn-sm btn-success" onClick={() => handleSaveRename(cat)}><Check size={14}/></button>
                            <button className="btn btn-sm btn-secondary" onClick={() => setEditingCat({ oldName: '', newName: '' })}><X size={14}/></button>
                          </div>
                        ) : (<span className="fw-medium">{cat}</span>)}
                      </td>
                      <td className="text-end">
                        {cat !== 'Other' && (
                          <>
                            <button className="btn btn-sm btn-link text-primary" onClick={() => setEditingCat({ oldName: cat, newName: cat })}><Edit2 size={14}/></button>
                            <button className="btn btn-sm btn-link text-danger" onClick={() => handleDeleteCategory(cat)}><Trash2 size={14}/></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {getOtherItems().length > 0 && (
              <div className="bg-light p-3 rounded mt-4 border">
                <h6 className="mb-3">Move items out of "Other"</h6>
                <div className="d-flex gap-2 mb-3">
                  <select className="form-select form-select-sm" style={{ maxWidth: 250 }} value={targetCategory} onChange={e => setTargetCategory(e.target.value)}>
                    <option value="">Select target category...</option>
                    {getCategoryList().filter(c => c !== 'Other').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button className="btn btn-sm btn-primary" disabled={selectedItems.length === 0 || !targetCategory} onClick={handleMoveItems}>Move Selected ({selectedItems.length})</button>
                </div>
                <div className="table-responsive" style={{ maxHeight: 200, overflowY: 'auto' }}>
                  <table className="table table-sm table-hover">
                    <thead><tr><th style={{width: 40}}></th><th>Item</th></tr></thead>
                    <tbody>
                      {getOtherItems().map(item => (
                        <tr key={item.id}>
                          <td><input type="checkbox" className="form-check-input" checked={selectedItems.includes(item.id)} onChange={e => {
                            if (e.target.checked) setSelectedItems([...selectedItems, item.id]);
                            else setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }} /></td>
                          <td>{catTab === 'sources' ? `${item.company} - ${item.jobTitle}` : catTab === 'contactTypes' ? `${item.fullName} - ${item.company}` : item.title}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div></div>
        )}

        {/* EXPORT */}
        {activeTab === 'export' && (
          <div className="card"><div className="card-body">
            <h5 className="mb-4">Data Management</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="border rounded p-3 h-100">
                  <h6 className="fw-bold"><FileJson size={16} className="me-1"/> JSON Backup (Recommended)</h6>
                  <p className="text-muted small">Preserves all data, history, and links. Use this to backup or move to another device.</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm flex-grow-1" onClick={handleExportJSON}>Export</button>
                    <button className="btn btn-outline-success btn-sm flex-grow-1" onClick={() => fileInputRef.current.click()}>Import</button>
                  </div>
                  <input type="file" ref={fileInputRef} hidden accept=".json" onChange={handleImportJSON} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="border rounded p-3 h-100">
                  <h6 className="fw-bold"><FileText size={16} className="me-1"/> CSV Export</h6>
                  <p className="text-muted small">Export your applications in a spreadsheet-friendly format for Excel or Google Sheets.</p>
                  <button className="btn btn-outline-secondary btn-sm w-100" onClick={handleExportCSV}>Download CSV</button>
                </div>
              </div>
              <div className="col-12">
                <div className="border rounded p-3 bg-light">
                  <h6 className="fw-bold"><BrainCircuit size={16} className="me-1"/> AI Career Brief</h6>
                  <p className="text-muted small">Export your profile and job search data as a Markdown file to feed into ChatGPT or Claude for personalized advice.</p>
                  <button className="btn btn-primary btn-sm" onClick={handleExportAI}>Download AI Brief</button>
                </div>
              </div>
            </div>
          </div></div>
        )}

        {/* DANGER ZONE */}
        {activeTab === 'danger' && (
          <div className="card border-danger"><div className="card-body">
            <h5 className="text-danger mb-3"><AlertTriangle size={20} className="me-2"/> Danger Zone</h5>
            <p className="text-muted">Once you clear your data, it cannot be recovered. Please make sure you have exported a JSON backup.</p>
            <button className="btn btn-danger" onClick={() => setShowClearConfirm(true)}>Clear All Data</button>
          </div></div>
        )}
      </div>

      <ConfirmDialog isOpen={showClearConfirm} title="Clear All Data" message="This will permanently delete ALL applications, contacts, tasks, and notes. Are you sure?" onConfirm={handleClear} onCancel={() => setShowClearConfirm(false)} confirmText="Yes, Delete Everything" />
    </div>
  );
}