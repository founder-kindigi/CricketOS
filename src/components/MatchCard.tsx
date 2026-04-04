import { Link } from 'react-router-dom';
import { format } from '../utils/date';
import { useCricketStore, formatLabels } from '../store/cricketStore';
import type { Match } from '../types';
import { MapPin, Calendar, Clock, Trophy, ChevronRight, Users, Star } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  showLink?: boolean;
}

export function MatchCard({ match, showLink = true }: MatchCardProps) {
  const { getPlayerName } = useCricketStore();

  const getResultColor = () => {
    if (!match.result) return 'text-slate-400 dark:text-slate-400 light:text-slate-500';
    if (match.result.winner === 'draw') return 'text-purple-400 dark:text-purple-400 light:text-purple-600';
    return match.result.winner === 'A' ? 'text-emerald-500 dark:text-emerald-400 light:text-emerald-600' : 'text-blue-500 dark:text-blue-400 light:text-blue-600';
  };

  const cardContent = (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-slate-500 dark:text-slate-500 light:text-slate-400" />
          <span className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600">{format(match.date)}</span>
          <span className="text-slate-600 dark:text-slate-600 light:text-slate-300">•</span>
          <span className="text-sm text-slate-500 dark:text-slate-500 light:text-slate-400">{match.day}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-slate-700/80 dark:bg-slate-700/80 light:bg-slate-100 px-2 py-1 rounded-full text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">
            {formatLabels[match.format]}
          </span>
          {showLink && <ChevronRight size={16} className="text-slate-500" />}
        </div>
      </div>

      <div className="flex items-start gap-2 mb-3 text-slate-400 dark:text-slate-400 light:text-slate-500 text-sm">
        <MapPin size={14} className="mt-0.5 flex-shrink-0 text-orange-500 dark:text-orange-400 light:text-orange-600" />
        <span className="line-clamp-1 text-slate-300 dark:text-slate-300 light:text-slate-600">{match.location}</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 light:text-slate-500 text-sm">
          <Clock size={14} />
          <span>{match.time}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 light:text-slate-500 text-sm">
          <Users size={14} />
          <span>{match.players.length} players</span>
        </div>
        {match.rating && (
          <div className="flex items-center gap-0.5">
            {[...Array(match.rating)].map((_, i) => (
              <Star key={i} size={12} className="text-amber-500 dark:text-amber-400 light:text-amber-500 fill-current" />
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-700/20 dark:bg-slate-700/20 light:bg-slate-100/80 rounded-xl p-3 mb-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-left">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 light:bg-emerald-500"></div>
              <span className="text-[10px] text-emerald-500 dark:text-emerald-400 light:text-emerald-600 font-semibold uppercase tracking-wide">Team A</span>
            </div>
            <p className="font-medium text-slate-200 dark:text-slate-200 light:text-slate-700 text-sm">
              {getPlayerName(match.teamA.captain)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-400 truncate">
              {match.teamA.players
                .filter(id => id !== match.teamA.captain)
                .map(id => getPlayerName(id).split(' ')[0])
                .join(', ')}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 mb-1 justify-end">
              <span className="text-[10px] text-blue-500 dark:text-blue-400 light:text-blue-600 font-semibold uppercase tracking-wide">Team B</span>
              <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 light:bg-blue-500"></div>
            </div>
            <p className="font-medium text-slate-200 dark:text-slate-200 light:text-slate-700 text-sm">
              {getPlayerName(match.teamB.captain)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-400 truncate">
              {match.teamB.players
                .filter(id => id !== match.teamB.captain)
                .map(id => getPlayerName(id).split(' ')[0])
                .join(', ')}
            </p>
          </div>
        </div>
      </div>

      {match.result && (
        <div className={`flex items-center gap-2 ${getResultColor()}`}>
          <Trophy size={16} />
          <span className="font-semibold text-sm">
            {match.result.winner === 'A' && `Team A wins${match.result.score ? ` (${match.result.score})` : ''}`}
            {match.result.winner === 'B' && `Team B wins${match.result.score ? ` (${match.result.score})` : ''}`}
            {match.result.winner === 'draw' && 'Match Draw'}
          </span>
        </div>
      )}

      {match.summary && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-500 light:text-slate-400 italic border-t border-slate-700/30 dark:border-slate-700/30 light:border-slate-200/50 pt-3 line-clamp-2">
          {match.summary}
        </p>
      )}
    </>
  );

  if (showLink) {
    return (
      <Link
        to={`/match/${match.id}`}
        className="block bg-slate-800/80 dark:bg-slate-800/80 light:bg-white rounded-2xl p-4 border border-slate-700/30 dark:border-slate-700/30 light:border-slate-200/30 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-50 hover:border-slate-600/30 dark:hover:border-slate-600/30 light:hover:border-slate-300/50 transition-all hover:shadow-lg dark:hover:shadow-emerald-500/5 light:hover:shadow-emerald-500/10"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-white rounded-2xl p-4 border border-slate-700/30 dark:border-slate-700/30 light:border-slate-200/30">
      {cardContent}
    </div>
  );
}
