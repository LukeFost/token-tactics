// page.tsx
"use client"
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import ThreeScene from "@/components/ThreeScene";
import GamePhaseButtons from "@/components/GamePhaseButtons";
import { LeftDrawer } from "@/components/LeftDrawer";
import { RightDrawer } from "@/components/RightDrawer";
import ResourceBar from "@/components/ResourceBar";
import { playersAtom, handleCellClickAtom, isGameStartedAtom, isTurnAtom, currentPlayerAtom, nextTurnAtom } from '@/atoms/gameAtoms';

// Define the PopulationMarkerData interface
interface PopulationMarkerData {
  lat: number;
  lon: number;
  population: number;
  cityName: string;
  connections: string[];
}

const populationMarkerData: PopulationMarkerData[] = [
  { lat: 42.16, lon: -21.91, population: 1000, cityName: 'Phoenix', connections: ['City2', 'City3'] },
  { lat: 65, lon: 100, population: 500, cityName: 'City2', connections: ['Phoenix', 'City4'] },
  { lat: 90, lon: 130, population: 750, cityName: 'City3', connections: ['Phoenix', 'City4'] },
  { lat: 45, lon: 145, population: 250, cityName: 'City4', connections: ['City2', 'City3'] },
];

export default function Home() {
  const [, setPlayers] = useAtom(playersAtom);
  const [, handleCellClick] = useAtom(handleCellClickAtom);
  const [isGameStarted, setIsGameStarted] = useAtom(isGameStartedAtom);
  const [isTurn, setIsTurn] = useAtom(isTurnAtom);
  const [, setCurrentPlayer] = useAtom(currentPlayerAtom);
  const [, nextTurn] = useAtom(nextTurnAtom);

  useEffect(() => {
    // Initialize players
    setPlayers([
      { id: '1', name: 'Player 1', color: '#ff0000' },
    ]);
  }, [setPlayers]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsTurn(true);
    setCurrentPlayer({ id: '1', name: 'Player 1', color: '#ff0000' });
  };

  const handleEndTurn = () => {
    setIsTurn(false);
    nextTurn();
  };

  return (
    <main className="min-h-screen bg-gray-100 overflow-hidden">
      <LeftDrawer />
      <RightDrawer />
      <ResourceBar />
      <ThreeScene 
        populationMarkerData={populationMarkerData}
      />
      <GamePhaseButtons 
        isGameStarted={isGameStarted}
        isTurn={isTurn}
        onStartGame={handleStartGame}
        onEndTurn={handleEndTurn}
      />
    </main>
  );
}
