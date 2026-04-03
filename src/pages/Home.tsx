import { useState } from 'react';
import { useCricketStore } from '../store/cricketStore';
import { MatchCard } from '../components/MatchCard';
import { Trophy, Users, Search, TrendingUp, Clock, MapPin, Target, Award, Zap } from 'lucide-react';
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
          className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-slate-800 transition-all"
        />
      </div>

      {searchQuery ? (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search size={18} className="text-emerald-400" />
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
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-600" />
              </div>
              <p className="text-slate-400">No matches found</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl p-4 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={18} className="text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Team A</span>
              </div>
              <p className="text-3xl font-bold text-emerald-400">{totalWinsA}</p>
              <p className="text-xs text-slate-400 mt-1">wins</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={18} className="text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">Team B</span>
              </div>
              <p className="text-3xl font-bold text-blue-400">{totalWinsB}</p>
              <p className="text-xs text-slate-400 mt-1">wins</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
              <Target className="mx-auto mb-1 text-purple-400" size={18} />
              <p className="text-xl font-bold text-slate-100">{matches.length}</p>
              <p className="text-[10px] text-slate-400">Matches</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
              <Users className="mx-auto mb-1 text-blue-400" size={18} />
              <p className="text-xl font-bold text-slate-100">{players.length}</p>
              <p className="text-[10px] text-slate-400">Players</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
              <Zap className="mx-auto mb-1 text-yellow-400" size={18} />
              <p className="text-xl font-bold text-slate-100">{totalDraws}</p>
              <p className="text-[10px] text-slate-400">Draws</p>
            </div>
          </div>

          {totalWinsA > totalWinsB && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent rounded-xl p-4 border border-emerald-500/20">
              <p className="text-emerald-400 text-sm flex items-center gap-2">
                <TrendingUp size={16} />
                Team A leads by {totalWinsA - totalWinsB}!
              </p>
            </div>
          )}
          {totalWinsB > totalWinsA && (
            <div className="bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl p-4 border border-blue-500/20">
              <p className="text-blue-400 text-sm flex items-center gap-2">
                <TrendingUp size={16} />
                Team B leads by {totalWinsB - totalWinsA}!
              </p>
            </div>
          )}

          {topVenues.length > 0 && (
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-orange-400" />
                Top Venues
              </h3>
              <div className="space-y-2">
                {topVenues.map((venue, i) => {
                  const venueMatches = matches.filter(m => m.location === venue);
                  return (
                    <Link
                      key={venue}
                      to="/venues"
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-700/50 transition-colors -mx-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400">
                          {i + 1}
                        </span>
                        <span className="text-slate-300 text-sm truncate max-w-[180px]">{venue}</span>
                      </div>
                      <span className="text-slate-500 text-sm">{venueMatches.length}</span>
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
                <Link to="/matches" className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  View All
                  <span className="bg-emerald-500/20 px-2 py-0.5 rounded-full text-xs">{matches.length}</span>
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
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy size={40} className="text-emerald-500/50" />
                </div>
                <p className="text-slate-400 mb-2">No matches yet</p>
                <Link
                  to="/add"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
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
