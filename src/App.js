import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { DataProvider, useData } from './context/DataContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import People from './pages/People';
import DailyActivity from './pages/DailyActivity';
import Settings from './pages/Settings';

function ThemeLoader({ children }) {
  const { preferences } = useData();
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', preferences.theme || 'light');
  }, [preferences.theme]);
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <DataProvider>
          <ThemeLoader>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="applications" element={<Applications />} />
                <Route path="people" element={<People />} />
                <Route path="daily-activity" element={<DailyActivity />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </ThemeLoader>
        </DataProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}