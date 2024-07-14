// components/GamePhaseButtons.tsx
import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { goldBalanceAtom, soldiersAtom, populationAtom, cardsAtom, buyCardMultiplierAtom, buyResourcesAtom, buyCardAtom, useCardAtom, playersAtom } from '@/atoms/gameAtoms';

interface GamePhaseButtonsProps {
  isGameStarted: boolean;
  isTurn: boolean;
  onStartGame: () => void;
  onEndTurn: () => void;
}

const GamePhaseButtons: React.FC<GamePhaseButtonsProps> = ({
  isGameStarted,
  isTurn,
  onStartGame,
  onEndTurn,
}) => {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isCardsModalOpen, setIsCardsModalOpen] = useState(false);
  const [buyAmount, setBuyAmount] = useState(0);
  const [buyType, setBuyType] = useState<'soldiers' | 'population'>('soldiers');
  const [goldBalance] = useAtom(goldBalanceAtom);
  const [, buySoldiers] = useAtom(buyResourcesAtom);
  const [, buyCard] = useAtom(buyCardAtom);
  const [buyCardMultiplier, setBuyCardMultiplier] = useAtom(buyCardMultiplierAtom);
  const [cards] = useAtom(cardsAtom);
  const [, useCard] = useAtom(useCardAtom);
  const [players] = useAtom(playersAtom);

  const getCurrentPhaseText = () => {
    if (!isGameStarted) {
      return null;
    }
    return isTurn ? "Your Turn" : "Waiting...";
  };

  const currentPhaseText = getCurrentPhaseText();

  const handleBuy = () => {
    buySoldiers({ type: buyType, amount: buyAmount });
    setIsBuyModalOpen(false);
  };

  const handleBuyCard = () => {
    buyCard();
  };

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
              <Dialog open={isBuyModalOpen} onOpenChange={setIsBuyModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6"
                    disabled={!isTurn}
                  >
                    BUY
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Buy Resources</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2">Buy {buyType}</h3>
                      <Slider
                        value={[buyAmount]}
                        onValueChange={(value) => setBuyAmount(value[0])}
                        max={goldBalance}
                        step={1}
                      />
                      <p>Cost: {buyAmount} gold</p>
                    </div>
                    <div>
                      <Toggle
                        pressed={buyType === 'soldiers'}
                        onPressedChange={(pressed) => setBuyType(pressed ? 'soldiers' : 'population')}
                      >
                        {buyType === 'soldiers' ? 'Buying Soldiers' : 'Buying Population'}
                      </Toggle>
                    </div>
                    <div>
                      <h3 className="mb-2">Buy Card</h3>
                      <Toggle
                        pressed={buyCardMultiplier === 2}
                        onPressedChange={(pressed) => setBuyCardMultiplier(pressed ? 2 : 1)}
                      >
                        {buyCardMultiplier === 1 ? 'Buy 1 Card' : 'Buy 2 Cards'}
                      </Toggle>
                      <Button onClick={handleBuyCard} className="mt-2">
                        Buy Card ({10 * buyCardMultiplier} gold)
                      </Button>
                    </div>
                    <Button onClick={handleBuy}>Confirm Purchase</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="default"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-6"
                onClick={onEndTurn}
                disabled={!isTurn}
              >
                End Turn
              </Button>
              <Dialog open={isCardsModalOpen} onOpenChange={setIsCardsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6"
                    disabled={!isTurn}
                  >
                    Cards
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Your Cards</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {players && players.length > 0 ? (
                      cards.map((card) => (
                        <div key={card.id} className="flex justify-between items-center">
                          <div>
                            <h3>{card.name}</h3>
                            <p>{card.description}</p>
                            <p>Owned: {card.count}</p>
                          </div>
                          <Button onClick={() => useCard(card.id)} disabled={card.count === 0}>
                            Use
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p>No players available. Start the game to see cards.</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Button
              variant="default"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6"
              onClick={onStartGame}
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
