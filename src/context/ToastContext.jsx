import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  // We use a ref to hold the notification callback so we can link them without circular dependency
  const notifyRef = useRef(null);

  const remove = useCallback((id) => setToasts(ts => ts.filter(t => t.id !== id)), []);
  
  const push = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++idCounter;
    setToasts(ts => [...ts, { id, message, type }]);
    
    // If the DataProvider has hooked into this, also create a permanent notification
    if (notifyRef.current) {
      notifyRef.current(message, type);
    }

    if (duration > 0) setTimeout(() => remove(id), duration);
  }, [remove]);

  const api = {
    success: (msg) => push(msg, 'success'),
    error:   (msg) => push(msg, 'error'),
    info:    (msg) => push(msg, 'info'),
    // Internal use only: Link the DataProvider's notify function here
    _setNotify: (fn) => { notifyRef.current = fn; }
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="jp-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`jp-toast jp-toast-${t.type}`}>
            {t.type === 'success' && <CheckCircle2 size={18} />}
            {t.type === 'error'   && <AlertCircle size={18} />}
            {t.type === 'info'    && <Info size={18} />}
            <span className="jp-toast-msg">{t.message}</span>
            <button className="jp-toast-close" onClick={() => remove(t.id)} aria-label="Close"><X size={14} /></button>
          </div>
        ))}
      </div>
      <style>{`
        .jp-toast-container { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 2000;
          display: flex; flex-direction: column-reverse; gap: 0.5rem; pointer-events: none; }
        .jp-toast { display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 0.9rem;
          background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(15,23,42,0.12);
          border-left: 3px solid; min-width: 260px; max-width: 380px; font-size: 13.5px;
          pointer-events: auto; animation: jpSlideIn 0.2s ease; }
        .jp-toast-success { border-left-color: #059669; color: #065f46; }
        .jp-toast-error   { border-left-color: #dc2626; color: #991b1b; }
        .jp-toast-info    { border-left-color: #2563eb; color: #1e40af; }
        .jp-toast-msg { flex: 1; color: #0f172a; }
        .jp-toast-close { background: none; border: none; color: #64748b; cursor: pointer; padding: 2px; display: flex; }
        .jp-toast-close:hover { color: #0f172a; }
        @keyframes jpSlideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @media (max-width: 575.98px) {
          .jp-toast-container { bottom: 0.5rem; right: 0.5rem; left: 0.5rem; }
          .jp-toast { min-width: 0; max-width: none; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}