import { useState } from 'react';
import { useCricketStore } from '../store/cricketStore';
import { MatchCard } from '../components/MatchCard';
import { Trophy, Users, Search, TrendingUp, Clock, MapPin, Target, Award, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const { matches, players, settings } = useCricketStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const recentMatches = matches.slice(0, 5);
  const topVenues = [...new Set(matches.map(m => m.location))]
    .slice(0, 3);

  const totalWinsA = matches.filter(m => m.result?.winner === 'A').length;
  const totalWinsB = matches.filter(m => m.result?.winner === 'B').length;
  const totalDraws = matches.filter(m => m.result?.winner === 'draw').length;

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
        <h1 className="text-2xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-1">{settings.groupName}</h1>
        <p className="text-slate-400 dark:text-slate-400 light:text-slate-500 text-sm">
          {matches.length} matches • {players.length} players
        </p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 light:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search matches, players, venues..."
          className="w-full bg-slate-800/80 dark:bg-slate-800/80 light:bg-white border border-slate-700/50 dark:border-slate-700/50 light:border-slate-200/50 rounded-2xl pl-11 pr-4 py-4 text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 dark:placeholder-slate-500 light:placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-slate-800 dark:focus:bg-slate-800 light:focus:bg-white transition-all touch-target"
        />
      </div>

      {searchQuery ? (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-200 dark:text-slate-200 light:text-slate-700">
            <Search size={18} className="text-emerald-500" />
            Search Results ({filteredMatches.length})
          </h2>
          {filteredMatches.length > 0 ? (
            <div className="space-y-4">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-600 dark:text-slate-600 light:text-slate-400" />
              </div>
              <p className="text-slate-400 dark:text-slate-400 light:text-slate-500">No matches found</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 dark:from-emerald-500/15 dark:to-emerald-600/5 light:from-emerald-50 light:to-emerald-100/50 rounded-2xl p-4 border border-emerald-500/20 dark:border-emerald-500/20 light:border-emerald-200/50">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-emerald-500 dark:text-emerald-400 light:text-emerald-600" />
                <span className="text-xs text-emerald-500 dark:text-emerald-400 light:text-emerald-600 font-medium">Team A</span>
              </div>
              <p className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 light:text-emerald-600">{totalWinsA}</p>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">wins</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/5 dark:from-blue-500/15 dark:to-blue-600/5 light:from-blue-50 light:to-blue-100/50 rounded-2xl p-4 border border-blue-500/20 dark:border-blue-500/20 light:border-blue-200/50">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-blue-500 dark:text-blue-400 light:text-blue-600" />
                <span className="text-xs text-blue-500 dark:text-blue-400 light:text-blue-600 font-medium">Team B</span>
              </div>
              <p className="text-3xl font-bold text-blue-500 dark:text-blue-400 light:text-blue-600">{totalWinsB}</p>
              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">wins</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/50 dark:bg-slate-800/50 light:bg-white rounded-xl p-3 text-center border border-slate-700/30 dark:border-slate-700/30 light:border-slate-200/30">
              <Target className="mx-auto mb-1.5 text-purple-500 dark:text-purple-400 light:text-purple-600" size={18} />
              <p className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-700">{matches.length}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500">Matches</p>
            </div>
            <div className="bg-slate-800/50 dark:bg-slate-800/50 light:bg-white rounded-xl p-3 text-center border border-slate-700/30 dark:border-slate-700/30 light:border-slate-200/30">
              <Users className="mx-auto mb-1.5 text-blue-500 dark:text-blue-400 light:text-blue-600" size={18} />
              <p className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-700">{players.length}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500">Players</p>
            </div>
            <div className="bg-slate-800/50 dark:bg-slate-800/50 light:bg-white rounded-xl p-3 text-center border border-slate-700/30 dark:border-slate-700/30 light:border-slate-200/30">
              <Zap className="mx-auto mb-1.5 text-amber-500 dark:text-amber-400 light:text-amber-600" size={18} />
              <p className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-700">{totalDraws}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-500">Draws</p>
            </div>
          </div>

          {totalWinsA > totalWinsB && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent dark:from-emerald-500/10 dark:to-transparent light:from-emerald-50 light:to-transparent rounded-xl p-4 border border-emerald-500/20 dark:border-emerald-500/20 light:border-emerald-200/50">
              <p className="text-emerald-500 dark:text-emerald-400 light:text-emerald-600 text-sm flex items-center gap-2">
                <TrendingUp size={16} />
                Team A leads by {totalWinsA - totalWinsB}!
              </p>
            </div>
          )}
          {totalWinsB > totalWinsA && (
            <div className="bg-gradient-to-r from-blue-500/10 to-transparent dark:from-blue-500/10 dark:to-transparent light:from-blue-50 light:to-transparent rounded-xl p-4 border border-blue-500/20 dark:border-blue-500/20 light:border-blue-200/50">
              <p className="text-blue-500 dark:text-blue-400 light:text-blue-600 text-sm flex items-center gap-2">
                <TrendingUp size={16} />
                Team B leads by {totalWinsB - totalWinsA}!
              </p>
            </div>
          )}

          {topVenues.length > 0 && (
            <div className="bg-slate-800/50 dark:bg-slate-800/50 light:bg-white rounded-2xl p-4 border border-slate-700/30 dark:border-slate-700/30 light:border-slate-200/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-slate-200 dark:text-slate-200 light:text-slate-700">
                <MapPin size={16} className="text-orange-500 dark:text-orange-400 light:text-orange-600" />
                Top Venues
              </h3>
              <div className="space-y-1.5">
                {topVenues.map((venue, i) => {
                  const venueMatches = matches.filter(m => m.location === venue);
                  return (
                    <Link
                      key={venue}
                      to="/venues"
                      className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-700/30 dark:hover:bg-slate-700/30 light:hover:bg-slate-100 transition-colors -mx-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-orange-500/15 dark:bg-orange-500/15 light:bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-500 dark:text-orange-400 light:text-orange-600">
                          {i + 1}
                        </span>
                        <span className="text-slate-300 dark:text-slate-300 light:text-slate-600 text-sm truncate max-w-[180px]">{venue}</span>
                      </div>
                      <span className="text-slate-500 dark:text-slate-500 light:text-slate-400 text-sm">{venueMatches.length}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-200 dark:text-slate-200 light:text-slate-700">
                <Clock size={18} className="text-emerald-500" />
                Recent Matches
              </h2>
              {matches.length > 5 && (
                <Link to="/matches" className="text-sm text-emerald-500 dark:text-emerald-400 light:text-emerald-600 hover:text-emerald-400 dark:hover:text-emerald-300 light:hover:text-emerald-500 flex items-center gap-1">
                  View All
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
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={40} className="text-emerald-500/50 dark:text-emerald-500/50 light:text-emerald-400" />
                </div>
                <p className="text-slate-400 dark:text-slate-400 light:text-slate-500 mb-2">No matches yet</p>
                <Link
                  to="/add"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Award size={18} />
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
