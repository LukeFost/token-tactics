import React, { useState, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { GameContext } from '@/contexts/GameContext';

interface Player {
  id: string;
  name: string;
  color: string;
}

const PlayerManagementButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { players, setPlayers } = useContext(GameContext);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const handleAddPlayer = () => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: `Player ${players.length + 1}`,
      color: 'rgba(255, 0, 0, 1)',
    };
    setPlayers([...players, newPlayer]);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
  };

  const handleRemovePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const handleSaveEdit = (updatedPlayer: Player) => {
    setPlayers(players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    setEditingPlayer(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Players</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Player Management</DialogTitle>
        </DialogHeader>
        {editingPlayer ? (
          <div>
            <Button variant="ghost" onClick={() => setEditingPlayer(null)}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Input
              value={editingPlayer.name}
              onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
              className="mt-4"
              placeholder="Player Name"
            />
            <Input
              value={editingPlayer.color}
              onChange={(e) => setEditingPlayer({ ...editingPlayer, color: e.target.value })}
              className="mt-2"
              placeholder="RGBA Color (e.g., rgba(255, 0, 0, 1))"
            />
            <Button onClick={() => handleSaveEdit(editingPlayer)} className="mt-4">
              Save Changes
            </Button>
          </div>
        ) : (
          <div>
            {players.map(player => (
              <div key={player.id} className="flex items-center justify-between mt-2">
                <span>{player.name}</span>
                <div>
                  <Button variant="ghost" onClick={() => handleEditPlayer(player)}>Edit</Button>
                  <Button variant="ghost" onClick={() => handleRemovePlayer(player.id)}>Remove</Button>
                </div>
              </div>
            ))}
            <Button onClick={handleAddPlayer} className="mt-4">Add Player</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerManagementButton;