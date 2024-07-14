"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { Web3Modal } from '../../context/web3modal';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { gameIdAtom } from '@/atoms/gameAtoms';
import ConnectButton from '@/components/ConnectButton';

interface Game {
  id: string;
  name: string;
  owner: string;
}

const LockScreen: React.FC = () => {
  const router = useRouter();
  const [gameId, setGameId] = useAtom(gameIdAtom);
  const [games, setGames] = useState<Game[]>([]);
  const web3Modal = Web3Modal();

  useEffect(() => {
    if (isConnected && address) {
      setUserId(address);
    } else {
      setUserId(null);
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (gameId) {
      router.push('/');
    } else {
      // Reset all state if game ID is empty
      setIsSignedIn(false);
      setUserId(null);
      setGames([]);
    }
  }, [gameId, router]);


  const handleEnterGame = (selectedGameId: string) => {
    setGameId(selectedGameId);
  };

  const handleContinueGame = () => {
    // TODO: In the future, this will interact with the actual contract
    const latestGameId = "game123"; // Replace with actual latest game ID from contract
    setGameId(latestGameId);
  };

  const handleCreateGame = () => {
    // Implement game creation logic here
    console.log("Creating new game...");
    const newGameId = `game${games.length + 1}`;
    setGames([...games, { id: newGameId, name: `Game ${games.length + 1}`, owner: userId || 'Unknown' }]);
  };

  // Dummy data for games (replace with actual data fetching)
  useEffect(() => {
    setGames([
      { id: "game1", name: "Game 1", owner: "Player 1" },
      { id: "game2", name: "Game 2", owner: "Player 2" },
      { id: "game3", name: "Game 3", owner: "Player 3" },
    ]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-animate">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Game Logo</h1>
          {isSignedIn && <p className="text-xl">User ID: {userId}</p>}
        </div>
        
        {!isConnected ? (
          <ConnectButton />
        ) : (
          <>
            <Button onClick={handleContinueGame} className="w-full mb-4">Continue Game</Button>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game ID</TableHead>
                  <TableHead>Game Name</TableHead>
                  <TableHead>Game Owner</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.id}</TableCell>
                    <TableCell>{game.name}</TableCell>
                    <TableCell>{game.owner}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEnterGame(game.id)}>Enter</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={handleCreateGame} className="w-full mt-4">Create Game</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default LockScreen;
