import { useState } from 'react';
import { useCricketStore } from '../store/cricketStore';
import { format } from '../utils/date';
import { MapPin, Star, ChevronLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Venues() {
  const { venues, matches, toggleVenueFavorite } = useCricketStore();
  const [showFavorites, setShowFavorites] = useState(false);

  const sortedVenues = [...venues]
    .filter(v => showFavorites ? v.isFavorite : true)
    .sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.matchCount - a.matchCount;
    });

  const getVenueWins = (venueName: string) => {
    const venueMatches = matches.filter(
      m => m.location.toLowerCase() === venueName.toLowerCase()
    );
    return {
      teamA: venueMatches.filter(m => m.result?.winner === 'A').length,
      teamB: venueMatches.filter(m => m.result?.winner === 'B').length,
    };
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold flex-1">Venues</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowFavorites(false)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !showFavorites
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          All ({venues.length})
        </button>
        <button
          onClick={() => setShowFavorites(true)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            showFavorites
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          Favorites ({venues.filter(v => v.isFavorite).length})
        </button>
      </div>

      {sortedVenues.length > 0 ? (
        <div className="space-y-3">
          {sortedVenues.map((venue) => {
            const wins = getVenueWins(venue.name);
            return (
              <div
                key={venue.id}
                className="bg-slate-800 rounded-xl p-4 border border-slate-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <MapPin size={20} className="text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">{venue.name}</h3>
                      <p className="text-sm text-slate-400">
                        {venue.matchCount} matches • Last: {format(venue.lastUsed)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleVenueFavorite(venue.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      venue.isFavorite
                        ? 'text-yellow-400 bg-yellow-400/10'
                        : 'text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                    }`}
                  >
                    <Star size={18} fill={venue.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-slate-100">{venue.matchCount}</p>
                    <p className="text-xs text-slate-400">Matches</p>
                  </div>
                  <div className="bg-emerald-500/10 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-emerald-400">{wins.teamA}</p>
                    <p className="text-xs text-slate-400">Team A</p>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-blue-400">{wins.teamB}</p>
                    <p className="text-xs text-slate-400">Team B</p>
                  </div>
                </div>

                {wins.teamA > wins.teamB && (
                  <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm">
                    <Trophy size={14} />
                    <span>Team A dominates here</span>
                  </div>
                )}
                {wins.teamB > wins.teamA && (
                  <div className="mt-3 flex items-center gap-2 text-blue-400 text-sm">
                    <Trophy size={14} />
                    <span>Team B dominates here</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          <MapPin size={48} className="mx-auto mb-4 opacity-50" />
          <p>{showFavorites ? 'No favorite venues yet' : 'No venues recorded yet'}</p>
          <p className="text-sm mt-2">Venues are auto-added when you create matches</p>
        </div>
      )}
    </div>
  );
}
