// components/RecentGames.tsx
import React, { useContext } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { riskABI, riskAddress } from '@/abi/riskABI';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GameContext } from '@/contexts/GameContext';

interface RecentGamesProps {
  isGameStarted: boolean;
}

const RecentGames: React.FC<RecentGamesProps> = ({ isGameStarted }) => {
  const { data: userGames, isSuccess } = useReadContract({
    abi: riskABI,
    address: riskAddress,
    functionName: 'returnUserGames',
    args: [],
  });

  const { writeContract } = useWriteContract();
  const { setCurrentGameID } = useContext(GameContext);

  const handleJoinGame = async (gameId: string) => {
    try {
      await writeContract({
        abi: riskABI,
        address: riskAddress,
        functionName: 'joinGame',
        args: [BigInt(gameId)],
      });
      setCurrentGameID(gameId);
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  const handleCreateGame = async () => {
    try {
      const result = await writeContract({
        abi: riskABI,
        address: riskAddress,
        functionName: 'createGame',
        args: [],
      });
      console.log("Game created:", result);
      // You might want to refresh the list of games or navigate to the new game
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  if (isGameStarted || !isSuccess || !userGames) {
    return null;
  }

  const recentGames = [...userGames].reverse().slice(0, 5); // Get last 5 games

  return (
    <Card className="w-[350px] mx-auto mb-4 relative" style={{ zIndex: 10 }}>
      <CardHeader>
        <CardTitle>Recent Games</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Join</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentGames.map((gameId, index) => (
              <TableRow key={index}>
                <TableCell>{gameId.toString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleJoinGame(gameId.toString())}>
                    Join
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 space-y-2">
          <Button onClick={handleCreateGame} className="w-full">
            Create Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentGames;