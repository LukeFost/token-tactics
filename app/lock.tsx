"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { gameIdAtom } from '@/atoms/gameAtoms';

interface Game {
  id: string;
  name: string;
  owner: string;
}

const LockScreen: React.FC = () => {
  const router = useRouter();
  const [gameId, setGameId] = useAtom(gameIdAtom);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is signed in (replace with actual auth check)
    const checkAuth = async () => {
      // Simulating an async auth check
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSignedIn(true);
      setUserId("user123"); // Replace with actual user ID
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (gameId) {
      router.push('/');
    }
  }, [gameId, router]);

  const handleConnect = () => {
    // Implement connection logic here
    console.log("Connecting...");
  };

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
        
        {!isSignedIn ? (
          <Button onClick={handleConnect} className="w-full">Connect</Button>
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
