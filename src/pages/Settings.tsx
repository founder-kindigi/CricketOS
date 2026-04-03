import { useState, useRef } from 'react';
import { useCricketStore } from '../store/cricketStore';
import { ChevronLeft, Download, Upload, Moon, Sun, Monitor, Database, Check, X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Settings() {
  const { settings, updateSettings, exportData, importData, matches, clearAllData } = useCricketStore();
  const [groupName, setGroupName] = useState(settings.groupName);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
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

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    window.location.reload();
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="p-2 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-100 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-white rounded-2xl p-4 border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200/50">
          <h3 className="font-semibold mb-4">Group Name</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="My Cricket Crew"
              className="flex-1 bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-50 border border-slate-700 dark:border-slate-700 light:border-slate-200 rounded-xl px-4 py-3 text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSaveGroupName}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>

        <div className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-white rounded-2xl p-4 border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200/50">
          <h3 className="font-semibold mb-4">Appearance</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                settings.theme === 'dark'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 dark:bg-emerald-500/20 dark:border-emerald-500 dark:text-emerald-400'
                  : 'bg-slate-700/50 dark:bg-slate-700/50 dark:border-slate-600 text-slate-400 dark:text-slate-400 hover:border-slate-500 dark:hover:border-slate-500 light:bg-slate-100 light:border-slate-200 light:text-slate-500 light:hover:border-slate-300'
              }`}
            >
              <Moon size={20} />
              <span className="text-sm">Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                settings.theme === 'light'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:bg-emerald-500/20 dark:border-emerald-500 dark:text-emerald-400'
                  : 'bg-slate-700/50 dark:bg-slate-700/50 dark:border-slate-600 text-slate-400 dark:text-slate-400 hover:border-slate-500 dark:hover:border-slate-500 light:bg-slate-100 light:border-slate-200 light:text-slate-500 light:hover:border-slate-300'
              }`}
            >
              <Sun size={20} />
              <span className="text-sm">Light</span>
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                settings.theme === 'system'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 dark:bg-emerald-500/20 dark:border-emerald-500 dark:text-emerald-400'
                  : 'bg-slate-700/50 dark:bg-slate-700/50 dark:border-slate-600 text-slate-400 dark:text-slate-400 hover:border-slate-500 dark:hover:border-slate-500 light:bg-slate-100 light:border-slate-200 light:text-slate-500 light:hover:border-slate-300'
              }`}
            >
              <Monitor size={20} />
              <span className="text-sm">System</span>
            </button>
          </div>
        </div>

        <div className="bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-50 border border-emerald-500/30 dark:border-emerald-500/30 light:border-emerald-200/50 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Database size={24} className="text-emerald-500" />
            <div>
              <h3 className="font-semibold text-emerald-500 dark:text-emerald-400 light:text-emerald-600">Import Match Records</h3>
              <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm">
                {matches.length > 0 
                  ? `${matches.length} matches currently. Import your history?`
                  : 'Import your match records from notes'}
              </p>
            </div>
          </div>
          <Link
            to="/import"
            className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Go to Import
          </Link>
        </div>

        <div className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-white rounded-2xl p-4 border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200/50">
          <h3 className="font-semibold mb-4">Data Backup</h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-50 hover:bg-emerald-500/30 dark:hover:bg-emerald-500/30 border border-emerald-500/30 dark:border-emerald-500/30 light:border-emerald-200/50 text-emerald-500 dark:text-emerald-400 light:text-emerald-600 py-3 rounded-xl transition-colors"
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
              className="w-full flex items-center justify-center gap-2 bg-blue-500/20 dark:bg-blue-500/20 light:bg-blue-50 hover:bg-blue-500/30 dark:hover:bg-blue-500/30 border border-blue-500/30 dark:border-blue-500/30 light:border-blue-200/50 text-blue-500 dark:text-blue-400 light:text-blue-600 py-3 rounded-xl transition-colors"
            >
              <Upload size={18} />
              <span className="font-medium">Import from File</span>
            </button>

            {importStatus && (
              <div className={`flex items-center justify-center gap-2 p-3 rounded-xl ${
                importStatus.includes('success') 
                  ? 'bg-emerald-500/20 text-emerald-400 dark:text-emerald-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {importStatus.includes('success') ? <Check size={16} /> : <X size={16} />}
                <span className="text-sm">{importStatus}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-white rounded-2xl p-4 border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200/50">
          <h3 className="font-semibold mb-4">Danger Zone</h3>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-500/20 dark:bg-red-500/20 light:bg-red-50 hover:bg-red-500/30 dark:hover:bg-red-500/30 border border-red-500/30 dark:border-red-500/30 light:border-red-200/50 text-red-500 dark:text-red-400 light:text-red-600 py-3 rounded-xl transition-colors"
          >
            <Trash2 size={18} />
            <span className="font-medium">Clear All Data</span>
          </button>
        </div>

        <div className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-white rounded-2xl p-4 border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200/50">
          <h3 className="font-semibold mb-2">About CricketOS</h3>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm">
            Indoor cricket match tracker for your crew. Track matches, players, venues, and more.
          </p>
          <p className="text-slate-500 dark:text-slate-500 light:text-slate-400 text-xs mt-2">Version 1.0.0</p>
        </div>
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-2xl p-6 border border-slate-700 dark:border-slate-700 light:border-slate-200 max-w-sm w-full">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Clear All Data?</h3>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm text-center mb-6">
              This will permanently delete all matches, players, and settings. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-slate-700 dark:bg-slate-700 light:bg-slate-100 hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-slate-200 text-white dark:text-slate-100 light:text-slate-900 font-medium py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
