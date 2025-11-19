import SettingsHeader from '../components/settings/SettingsHeader';
import SettingsProfile from '../components/settings/SettingsProfile';
import SettingsPreferences from '../components/settings/SettingsPreferences';
import { useEffect, useState } from 'react';

export default function Settings() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aroma_user') || '{}'); } catch { return {}; }
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('aroma_theme') || 'light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => (localStorage.getItem('aroma_notify') === '1'));

  useEffect(() => { localStorage.setItem('aroma_theme', theme); document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('aroma_notify', notificationsEnabled ? '1' : '0'); }, [notificationsEnabled]);

  function saveProfile(profile) {
    localStorage.setItem('aroma_user', JSON.stringify(profile)); setUser(profile); alert('Profile saved');
  }

  function resetApp() { if (!confirm('Reset all app local settings (won\'t delete DB)?')) return; localStorage.removeItem('aroma_theme'); localStorage.removeItem('aroma_notify'); setTheme('light'); setNotificationsEnabled(false); alert('Settings reset'); }

  return (
    <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto">
      <SettingsHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <SettingsProfile user={user} onSave={saveProfile} />
        <SettingsPreferences theme={theme} setTheme={setTheme} notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled} resetApp={resetApp} />
      </div>
    </div>
  );
}