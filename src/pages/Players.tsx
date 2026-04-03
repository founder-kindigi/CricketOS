import { useState } from 'react';
import { useCricketStore } from '../store/cricketStore';
import { Plus, Edit2, User, X, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Player } from '../types';

export function Players() {
  const { players, addPlayer, updatePlayer, getPlayerStats } = useCricketStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [name, setName] = useState('');
  const [aliases, setAliases] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'matches' | 'wins'>('name');

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

  const sortedPlayers = [...players].sort((a, b) => {
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
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Add</span>
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['name', 'matches', 'wins'] as const).map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              sortBy === sort
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {sort === 'name' ? 'Name' : sort === 'matches' ? 'Matches' : 'Wins'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {sortedPlayers.map((player) => {
          const stats = getPlayerStats(player.id);
          const totalWins = stats.winsAsCaptain + stats.winsAsCaptainB;
          
          return (
            <Link
              key={player.id}
              to={`/player/${player.id}`}
              className="block bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center gap-4 hover:bg-slate-750 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <User size={24} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-100">{player.name}</p>
                {player.aliases.length > 0 && (
                  <p className="text-xs text-slate-400 truncate">
                    {player.aliases.slice(0, 3).join(', ')}
                    {player.aliases.length > 3 && ` +${player.aliases.length - 3}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-100">{stats.appearances}</p>
                  <p className="text-xs text-slate-400">matches</p>
                </div>
                {totalWins > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Trophy size={16} />
                    <span className="font-bold">{totalWins}</span>
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  openEdit(player);
                }}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
              >
                <Edit2 size={16} />
              </button>
            </Link>
          );
        })}
      </div>

      {players.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <User size={48} className="mx-auto mb-4 opacity-50" />
          <p>No players yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-emerald-400 hover:text-emerald-300"
          >
            Add your first player
          </button>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
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
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Muhammad Ali"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Aliases (comma separated)
                </label>
                <input
                  type="text"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                  placeholder="e.g., MBQ, Ali Bhai"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={editingPlayer ? handleUpdate : handleAdd}
                disabled={!name.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
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
