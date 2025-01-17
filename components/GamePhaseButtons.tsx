// components/GamePhaseButtons.tsx
import React, { useContext } from 'react';
import { Button } from "@/components/ui/button";
import { useWriteContract } from "wagmi";
import { riskABI, riskAddress } from "@/abi/riskABI";
import { GameContext } from '@/contexts/GameContext';

interface GamePhaseButtonsProps {
  isGameStarted: boolean;
  isTurn: boolean;
  onStartGame: () => void;
  onEndTurn: () => void;
  onBuy: () => void;
  onCards: () => void;
}

const GamePhaseButtons: React.FC<GamePhaseButtonsProps> = ({
  isGameStarted,
  isTurn,
  onStartGame,
  onEndTurn,
  onBuy,
  onCards
}) => {
  const { writeContract } = useWriteContract();
  const { currentGameID } = useContext(GameContext);

  const handleStartGame = async () => {
    try {
      await writeContract({
        abi: riskABI,
        address: riskAddress,
        functionName: 'startGame',
        args: [BigInt(currentGameID)],
      });
      console.log("Game successfully joined!");
      onStartGame();
    } catch (error) {
      console.error("Error joining game:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const getCurrentPhaseText = () => {
    if (!isGameStarted) {
      return null;
    }
    return isTurn ? "Your Turn" : "Waiting...";
  };

  const currentPhaseText = getCurrentPhaseText();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4">
      <div className="relative max-w-md mx-auto">
        {currentPhaseText && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-t-lg">
            {currentPhaseText}
          </div>
        )}
        <div className="flex justify-center items-end rounded-lg shadow-lg overflow-hidden">
          {isGameStarted ? (
            <>
              <Button
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6"
                onClick={onBuy}
                disabled={!isTurn}
              >
                BUY
              </Button>
              <Button
                variant="default"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-6"
                onClick={onEndTurn}
                disabled={!isTurn}
              >
                End Turn
              </Button>
              <Button
                variant="default"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6"
                onClick={onCards}
                disabled={!isTurn}
              >
                Cards
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6"
              onClick={handleStartGame}
            >
              Start Game
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePhaseButtons;