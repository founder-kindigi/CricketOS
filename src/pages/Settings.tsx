import { useState, useRef } from 'react';
import { useCricketStore } from '../store/cricketStore';
import { Link2, ChevronLeft, Download, Upload, Moon, Sun, Monitor, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Settings() {
  const { settings, updateSettings, exportData, importData, matches } = useCricketStore();
  const [groupName, setGroupName] = useState(settings.groupName);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveGroupName = () => {
    updateSettings({ groupName });
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cricketos-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      const success = importData(data);
      setImportStatus(success ? 'Data imported successfully!' : 'Invalid file format');
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleThemeChange = (theme: 'dark' | 'light' | 'system') => {
    updateSettings({ theme });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="font-semibold mb-4">Group Name</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="My Cricket Crew"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSaveGroupName}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="font-semibold mb-4">Appearance</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-lg border transition-colors flex flex-col items-center gap-2 ${
                settings.theme === 'dark'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Moon size={20} />
              <span className="text-sm">Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-lg border transition-colors flex flex-col items-center gap-2 ${
                settings.theme === 'light'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Sun size={20} />
              <span className="text-sm">Light</span>
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`p-4 rounded-lg border transition-colors flex flex-col items-center gap-2 ${
                settings.theme === 'system'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Monitor size={20} />
              <span className="text-sm">System</span>
            </button>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Database size={24} className="text-emerald-400" />
            <div>
              <h3 className="font-semibold text-emerald-400">Import Match Records</h3>
              <p className="text-slate-400 text-sm">
                {matches.length > 0 
                  ? `${matches.length} matches currently. Import your history?`
                  : 'Import your 18 match records from notes'}
              </p>
            </div>
          </div>
          <Link
            to="/import"
            className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Go to Import
          </Link>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="font-semibold mb-4">Data Backup</h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 py-3 rounded-lg transition-colors"
            >
              <Download size={18} />
              <span className="font-medium">Export Data</span>
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 py-3 rounded-lg transition-colors"
            >
              <Upload size={18} />
              <span className="font-medium">Import from File</span>
            </button>

            {importStatus && (
              <p className={`text-center text-sm ${importStatus.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
                {importStatus}
              </p>
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/venues"
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 px-4 rounded-lg transition-colors"
            >
              <Link2 size={18} />
              <span className="text-sm">Venues</span>
            </Link>
            <Link
              to="/presets"
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 px-4 rounded-lg transition-colors"
            >
              <Link2 size={18} />
              <span className="text-sm">Team Presets</span>
            </Link>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="font-semibold mb-2">About CricketOS</h3>
          <p className="text-slate-400 text-sm">
            Indoor cricket match tracker for your crew. Track matches, players, venues, and more.
          </p>
          <p className="text-slate-500 text-xs mt-2">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
