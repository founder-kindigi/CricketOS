import { useParams, Link } from 'react-router-dom';
import { useCricketStore } from '../store/cricketStore';
import { ChevronLeft, Trophy, Users, TrendingUp, User } from 'lucide-react';

export function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const { players, getPlayerStats, getHeadToHead, matches } = useCricketStore();
  
  const player = players.find((p) => p.id === id);
  
  if (!player) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">Player not found</p>
        <Link to="/players" className="text-emerald-400 hover:text-emerald-300">
          Back to Players
        </Link>
      </div>
    );
  }

  const stats = getPlayerStats(player.id);
  const recentMatches = matches
    .filter((m) => m.players.includes(player.id))
    .slice(0, 5);

  const otherPlayers = players.filter((p) => p.id !== player.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/players" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Player Profile</h1>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <User size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-1">{player.name}</h2>
        {player.aliases.length > 0 && (
          <p className="text-slate-400 text-sm">
            Also known as: {player.aliases.join(', ')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
          <Trophy className="mx-auto mb-2 text-emerald-400" size={20} />
          <p className="text-2xl font-bold text-slate-100">{stats.winsAsCaptain + stats.winsAsCaptainB}</p>
          <p className="text-xs text-slate-400">Captain Wins</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
          <Users className="mx-auto mb-2 text-blue-400" size={20} />
          <p className="text-2xl font-bold text-slate-100">{stats.appearances}</p>
          <p className="text-xs text-slate-400">Matches</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-center">
          <TrendingUp className="mx-auto mb-2 text-purple-400" size={20} />
          <p className="text-2xl font-bold text-slate-100">{stats.totalTeamWins}</p>
          <p className="text-xs text-slate-400">Team Wins</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users size={18} className="text-blue-400" />
          Head to Head Stats
        </h3>
        <div className="space-y-2">
          {otherPlayers.slice(0, 8).map((other) => {
            const h2h = getHeadToHead(player.id, other.id);
            if (h2h.matches === 0) return null;
            
            return (
              <div
                key={other.id}
                className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
              >
                <span className="text-slate-300 text-sm">{other.name}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-emerald-400 font-medium">{h2h.wins1}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-blue-400 font-medium">{h2h.wins2}</span>
                  <span className="text-slate-500 text-xs">({h2h.matches} matches)</span>
                </div>
              </div>
            );
          })}
          {otherPlayers.every((other) => getHeadToHead(player.id, other.id).matches === 0) && (
            <p className="text-slate-400 text-sm text-center py-4">
              No head-to-head matches yet
            </p>
          )}
        </div>
      </div>

      {recentMatches.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="font-semibold mb-4">Recent Matches</h3>
          <div className="space-y-2">
            {recentMatches.map((match) => {
              const inTeamA = match.teamA.players.includes(player.id);
              const won = (inTeamA && match.result?.winner === 'A') || 
                         (!inTeamA && match.result?.winner === 'B');
              
              return (
                <div
                  key={match.id}
                  className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
                >
                  <div>
                    <p className="text-slate-200 text-sm">{match.location}</p>
                    <p className="text-slate-500 text-xs">{new Date(match.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-sm font-medium ${won ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {match.result?.winner === 'draw' ? 'Draw' : won ? 'Won' : 'Lost'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
