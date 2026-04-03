import { useState, useEffect } from 'react';
import { useCricketStore } from '../store/cricketStore';
import { createMatchesFromSeed } from '../data/seedMatches';
import { ChevronLeft, Database, Download, Upload, Check, AlertCircle, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function ImportData() {
  const navigate = useNavigate();
  const { players, matches, addMatch, exportData, importData } = useCricketStore();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error' | 'partial'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (players.length > 0 || matches.length > 0) {
      setIsReady(true);
    }
  }, [players, matches]);

  const seedMatches = isReady ? createMatchesFromSeed(players) : [];
  const matchedCount = seedMatches.filter(m => m.players.length > 0).length;
  const validToImport = seedMatches.filter(m => 
    (m.players.length > 0 || m.format === 'individual' || m.format === 'spt')
  );

  const handleSeedImport = () => {
    if (matches.length > 0) {
      setShowConfirm(true);
      return;
    }
    importSeedData();
  };

  const importSeedData = () => {
    if (!isReady || seedMatches.length === 0) {
      setImportStatus('error');
      setImportMessage('Please refresh and try again when players are loaded.');
      return;
    }

    let imported = 0;
    validToImport.forEach(match => {
      addMatch(match);
      imported++;
    });

    if (imported === validToImport.length) {
      setImportStatus('success');
      setImportMessage(`Successfully imported ${imported} matches!`);
    } else if (imported > 0) {
      setImportStatus('partial');
      setImportMessage(`Imported ${imported} of ${validToImport.length} matches.`);
    } else {
      setImportStatus('error');
      setImportMessage('No matches imported. Add players first.');
    }
    
    setShowConfirm(false);
    setTimeout(() => {
      navigate('/');
    }, 2000);
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

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      const success = importData(data);
      if (success) {
        setImportStatus('success');
        setImportMessage('Data imported successfully!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setImportStatus('error');
        setImportMessage('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/settings" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Import Data</h1>
      </div>

      {!isReady ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Database size={24} className="text-emerald-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-400 mb-1">Your Match Records</h3>
                <p className="text-slate-300 text-sm">
                  Import {validToImport.length} matches from your recorded history.
                </p>
                <div className="mt-3 bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-blue-400" />
                      <span className="text-slate-300">{players.length} players</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database size={16} className="text-purple-400" />
                      <span className="text-slate-300">{matches.length} existing matches</span>
                    </div>
                  </div>
                </div>
                {matchedCount < seedMatches.length && (
                  <p className="text-yellow-400 text-xs mt-2">
                    {seedMatches.length - matchedCount} matches need additional players.
                  </p>
                )}
              </div>
            </div>
            
            {matches.length > 0 && (
              <div className="mt-4 pt-4 border-t border-emerald-500/20">
                <p className="text-yellow-400 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  You have {matches.length} existing matches. Importing will add more.
                </p>
              </div>
            )}
            
            <button
              onClick={handleSeedImport}
              disabled={validToImport.length === 0}
              className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Import {validToImport.length} Matches
            </button>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="font-semibold mb-4">Backup / Restore</h3>
            
            <button
              onClick={handleExport}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <Download size={18} />
              Export Current Data
            </button>
            
            <label className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
              <Upload size={18} />
              <span>Import from File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>

          {importStatus !== 'idle' && (
            <div className={`rounded-xl p-4 border ${
              importStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
              importStatus === 'partial' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
              'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <div className="flex items-center gap-2">
                <Check size={20} />
                <span>{importMessage}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Import Matches?</h3>
            <p className="text-slate-400 text-sm mb-6">
              This will add {validToImport.length} matches to your existing {matches.length} matches.
              Your current data won't be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={importSeedData}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
