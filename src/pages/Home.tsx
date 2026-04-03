import { useState } from 'react';
import { useCricketStore } from '../store/cricketStore';
import { MatchCard } from '../components/MatchCard';
import { Trophy, Users, Search, TrendingUp, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const { matches, players, settings } = useCricketStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const recentMatches = matches.slice(0, 5);
  const topVenues = [...new Set(matches.map(m => m.location))]
    .slice(0, 3);

  const totalWinsA = matches.filter(m => m.result?.winner === 'A').length;
  const totalWinsB = matches.filter(m => m.result?.winner === 'B').length;

  const filteredMatches = searchQuery
    ? matches.filter(
        (m) =>
          m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.players.some((pId) => {
            const player = players.find((p) => p.id === pId);
            return player?.name.toLowerCase().includes(searchQuery.toLowerCase());
          })
      )
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-1">{settings.groupName}</h1>
        <p className="text-slate-400 text-sm">
          {matches.length} matches • {players.length} players
        </p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search matches, players, venues..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {searchQuery ? (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Search Results ({filteredMatches.length})
          </h2>
          {filteredMatches.length > 0 ? (
            <div className="space-y-4">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p>No matches found</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <Trophy className="mx-auto mb-2 text-emerald-400" size={20} />
              <p className="text-2xl font-bold text-slate-100">{matches.length}</p>
              <p className="text-xs text-slate-400">Matches</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <Users className="mx-auto mb-2 text-blue-400" size={20} />
              <p className="text-2xl font-bold text-slate-100">{players.length}</p>
              <p className="text-xs text-slate-400">Players</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <MapPin className="mx-auto mb-2 text-orange-400" size={20} />
              <p className="text-2xl font-bold text-slate-100">{topVenues.length}</p>
              <p className="text-xs text-slate-400">Venues</p>
            </div>
          </div>

          {matches.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-400" />
                Team Battle
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center">
                  <p className="text-3xl font-bold text-emerald-400">{totalWinsA}</p>
                  <p className="text-xs text-slate-400">Team A</p>
                </div>
                <div className="text-slate-500 text-xl">vs</div>
                <div className="flex-1 text-center">
                  <p className="text-3xl font-bold text-blue-400">{totalWinsB}</p>
                  <p className="text-xs text-slate-400">Team B</p>
                </div>
              </div>
              {totalWinsA > totalWinsB && (
                <p className="text-center text-emerald-400 text-sm mt-3">
                  Team A leads by {totalWinsA - totalWinsB}
                </p>
              )}
              {totalWinsB > totalWinsA && (
                <p className="text-center text-blue-400 text-sm mt-3">
                  Team B leads by {totalWinsB - totalWinsA}
                </p>
              )}
              {totalWinsA === totalWinsB && totalWinsA > 0 && (
                <p className="text-center text-slate-400 text-sm mt-3">
                  Series level!
                </p>
              )}
            </div>
          )}

          {topVenues.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-orange-400" />
                Top Venues
              </h3>
              <div className="space-y-2">
                {topVenues.map((venue, i) => {
                  const venueMatches = matches.filter(m => m.location === venue);
                  return (
                    <Link
                      key={venue}
                      to="/venues"
                      className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-medium text-orange-400">
                          {i + 1}
                        </span>
                        <span className="text-slate-300 text-sm truncate max-w-[200px]">{venue}</span>
                      </div>
                      <span className="text-slate-400 text-sm">{venueMatches.length} matches</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock size={18} className="text-emerald-400" />
                Recent Matches
              </h2>
              {matches.length > 5 && (
                <Link to="/matches" className="text-sm text-emerald-400 hover:text-emerald-300">
                  View All ({matches.length})
                </Link>
              )}
            </div>

            {recentMatches.length > 0 ? (
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Trophy size={48} className="mx-auto mb-4 opacity-50" />
                <p className="mb-4">No matches yet</p>
                <Link
                  to="/add"
                  className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                  Add Your First Match
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
