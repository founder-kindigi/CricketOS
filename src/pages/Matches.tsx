import { useState } from 'react';
import { useCricketStore, formatLabels } from '../store/cricketStore';
import { MatchCard } from '../components/MatchCard';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MatchFormat } from '../types';

export function Matches() {
  const { matches, deleteMatch } = useCricketStore();
  const [filterFormat, setFilterFormat] = useState<MatchFormat | 'all'>('all');

  const filteredMatches = filterFormat === 'all'
    ? matches
    : matches.filter((m) => m.format === filterFormat);

  const handleDelete = (id: string) => {
    if (confirm('Delete this match?')) {
      deleteMatch(id);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/"
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">All Matches</h1>
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        <button
          onClick={() => setFilterFormat('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            filterFormat === 'all'
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          All ({matches.length})
        </button>
        {(['team', 'individual', 'series', 'spt'] as MatchFormat[]).map((f) => {
          const count = matches.filter((m) => m.format === f).length;
          if (count === 0) return null;
          return (
            <button
              key={f}
              onClick={() => setFilterFormat(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterFormat === f
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {formatLabels[f]} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <div key={match.id} className="relative">
            <MatchCard match={match} />
            <button
              onClick={() => handleDelete(match.id)}
              className="absolute top-4 right-4 p-2 bg-slate-700/80 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No matches found</p>
        </div>
      )}
    </div>
  );
}
