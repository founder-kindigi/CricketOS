import { useCricketStore, formatLabels } from '../store/cricketStore';
import { Trophy, Users, MapPin, Calendar, Crown, Flame } from 'lucide-react';

export function Stats() {
  const { matches, players, getPlayerStats } = useCricketStore();

  const formatStats = matches.reduce((acc, m) => {
    acc[m.format] = (acc[m.format] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const venueStats = matches.reduce((acc, m) => {
    acc[m.location] = (acc[m.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedVenues = Object.entries(venueStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const playerStats = players
    .map((p) => ({
      ...getPlayerStats(p.id),
      player: p,
    }))
    .filter((p) => p.appearances > 0)
    .sort((a, b) => b.appearances - a.appearances);

  const captainWins = players
    .map((p) => ({
      ...getPlayerStats(p.id),
      player: p,
    }))
    .filter((p) => p.winsAsCaptain + p.winsAsCaptainB > 0)
    .sort((a, b) => (b.winsAsCaptain + b.winsAsCaptainB) - (a.winsAsCaptain + a.winsAsCaptainB));

  const totalWinsA = matches.filter((m) => m.result?.winner === 'A').length;
  const totalWinsB = matches.filter((m) => m.result?.winner === 'B').length;

  const topPlayer = playerStats[0];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Statistics</h1>

      {topPlayer && (
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-2xl p-5 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={20} className="text-amber-400" />
            <span className="text-amber-400 text-sm font-semibold">MVP</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Crown size={28} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-100">{topPlayer.player.name}</p>
              <p className="text-slate-400 text-sm">
                {topPlayer.appearances} matches • {topPlayer.winsAsCaptain + topPlayer.winsAsCaptainB} captain wins
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 rounded-2xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={18} className="text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">Team A</span>
          </div>
          <p className="text-4xl font-bold text-emerald-400">{totalWinsA}</p>
          <p className="text-xs text-slate-400 mt-1">wins</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/5 rounded-2xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={18} className="text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Team B</span>
          </div>
          <p className="text-4xl font-bold text-blue-400">{totalWinsB}</p>
          <p className="text-xs text-slate-400 mt-1">wins</p>
        </div>
      </div>

      {captainWins.length > 0 && (
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Crown size={18} className="text-amber-400" />
            Captain Leaderboard
          </h3>
          <div className="space-y-2">
            {captainWins.slice(0, 5).map((p, i) => (
              <div
                key={p.player.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    i === 0 ? 'bg-amber-500/20 text-amber-400' :
                    i === 1 ? 'bg-slate-400/20 text-slate-300' :
                    i === 2 ? 'bg-orange-600/20 text-orange-400' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-slate-200 text-sm">{p.player.name}</span>
                </div>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Trophy size={14} />
                  {p.winsAsCaptain + p.winsAsCaptainB}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-purple-400" />
          Format Breakdown
        </h3>
        <div className="space-y-2">
          {Object.entries(formatStats).map(([format, count]) => (
            <div
              key={format}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-700/30 transition-colors"
            >
              <span className="text-slate-300 text-sm">{formatLabels[format as keyof typeof formatLabels]}</span>
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-orange-400" />
          Top Venues
        </h3>
        {sortedVenues.length > 0 ? (
          <div className="space-y-2">
            {sortedVenues.map(([venue, count], i) => (
              <div
                key={venue}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-orange-500/20 flex items-center justify-center text-xs font-medium text-orange-400">
                    {i + 1}
                  </span>
                  <span className="text-slate-300 text-sm truncate max-w-[180px]">{venue}</span>
                </div>
                <span className="text-slate-400 text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-4">No venue data yet</p>
        )}
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users size={18} className="text-emerald-400" />
          Most Active Players
        </h3>
        {playerStats.length > 0 ? (
          <div className="space-y-2">
            {playerStats.slice(0, 5).map((p, i) => (
              <div
                key={p.player.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-medium text-emerald-400">
                    {i + 1}
                  </span>
                  <span className="text-slate-200 text-sm">{p.player.name}</span>
                </div>
                <span className="text-slate-400 text-sm font-medium">{p.appearances} matches</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-4">No match data yet</p>
        )}
      </div>
    </div>
  );
}
