import { useState } from 'react';
import { useCricketStore } from '../store/cricketStore';
import { Plus, Edit2, User, X, Crown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Player } from '../types';

const PLAYER_AVATARS = [
  'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
  'bg-orange-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Players() {
  const { players, addPlayer, updatePlayer, getPlayerStats } = useCricketStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [name, setName] = useState('');
  const [aliases, setAliases] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'matches' | 'wins'>('name');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = () => {
    const aliasList = aliases
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
    addPlayer(name, aliasList);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingPlayer) return;
    const aliasList = aliases
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
    updatePlayer(editingPlayer.id, name, aliasList);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setAliases('');
    setShowAddModal(false);
    setEditingPlayer(null);
  };

  const openEdit = (player: Player) => {
    setEditingPlayer(player);
    setName(player.name);
    setAliases(player.aliases.join(', '));
    setShowAddModal(true);
  };

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.aliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortBy === 'matches') {
      const aStats = getPlayerStats(a.id);
      const bStats = getPlayerStats(b.id);
      return bStats.appearances - aStats.appearances;
    }
    if (sortBy === 'wins') {
      const aStats = getPlayerStats(a.id);
      const bStats = getPlayerStats(b.id);
      return (bStats.winsAsCaptain + bStats.winsAsCaptainB) - (aStats.winsAsCaptain + aStats.winsAsCaptainB);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Players</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Add</span>
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search players..."
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="flex gap-2 mb-4">
        {(['name', 'matches', 'wins'] as const).map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              sortBy === sort
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            {sort === 'name' ? 'Name' : sort === 'matches' ? 'Matches' : 'Wins'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {sortedPlayers.map((player, index) => {
          const stats = getPlayerStats(player.id);
          const totalWins = stats.winsAsCaptain + stats.winsAsCaptainB;
          const avatarColor = PLAYER_AVATARS[index % PLAYER_AVATARS.length];
          
          return (
            <Link
              key={player.id}
              to={`/player/${player.id}`}
              className="block bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {getInitials(player.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-100">{player.name}</p>
                  {player.aliases.length > 0 && (
                    <p className="text-xs text-slate-500 truncate">
                      {player.aliases.slice(0, 3).join(', ')}
                      {player.aliases.length > 3 && ` +${player.aliases.length - 3}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-100">{stats.appearances}</p>
                    <p className="text-[10px] text-slate-500">matches</p>
                  </div>
                  {totalWins > 0 && (
                    <div className="flex items-center gap-1 bg-amber-500/20 px-2.5 py-1.5 rounded-lg">
                      <Crown size={14} className="text-amber-400" />
                      <span className="font-bold text-amber-400 text-sm">{totalWins}</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      openEdit(player);
                    }}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {sortedPlayers.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-slate-600" />
          </div>
          <p className="text-slate-400">
            {searchQuery ? 'No players found' : 'No players yet'}
          </p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50">
          <div className="bg-slate-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 border-t sm:border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editingPlayer ? 'Edit Player' : 'Add Player'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Muhammad Ali"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nicknames / Aliases
                </label>
                <input
                  type="text"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                  placeholder="MBQ, Ali Bhai (comma separated)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={editingPlayer ? handleUpdate : handleAdd}
                disabled={!name.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
              >
                {editingPlayer ? 'Update Player' : 'Add Player'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
