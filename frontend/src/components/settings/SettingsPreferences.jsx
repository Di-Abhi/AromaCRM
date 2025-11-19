export default function SettingsPreferences({ theme, setTheme, notificationsEnabled, setNotificationsEnabled, resetApp }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Preferences</h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Theme</div>
            <div className="text-xs text-gray-500">Appearance of the app</div>
          </div>
          <select value={theme} onChange={(e)=>setTheme(e.target.value)} className="border rounded px-2 py-2">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Notifications</div>
            <div className="text-xs text-gray-500">Enable in-app notifications</div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={notificationsEnabled} onChange={e=>setNotificationsEnabled(e.target.checked)} />
            <span className="text-sm">Enabled</span>
          </label>
        </div>

        <div className="pt-2">
          <button onClick={resetApp} className="px-3 py-2 border rounded text-red-600">Reset preferences</button>
        </div>
      </div>
    </div>
  );
}
