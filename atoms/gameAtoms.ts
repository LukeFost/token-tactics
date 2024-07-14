import { atom } from 'jotai';
import { Territory } from '@/components/TerritoryTable';

export interface Player {
  id: string;
  name: string;
  color: string;
}

export const playersAtom = atom<Player[]>([]);
export const currentPlayerAtom = atom<Player | null>(null);
export const ownedTerritoriesAtom = atom<Territory[]>([]);
export const allTerritoriesAtom = atom<Territory[]>([]);
export const currentTurnAtom = atom<number>(1);
export const isGameStartedAtom = atom<boolean>(false);
export const isTurnAtom = atom<boolean>(false);

export const nextTurnAtom = atom(
  null,
  (get, set) => {
    const players = get(playersAtom);
    const currentPlayer = get(currentPlayerAtom);
    if (!currentPlayer) return;
    const nextPlayerIndex = (players.indexOf(currentPlayer) + 1) % players.length;
    set(currentPlayerAtom, players[nextPlayerIndex]);
    set(currentTurnAtom, (prev) => prev + 1);
  }
);

export const addTerritoryAtom = atom(
  null,
  (get, set, territory: Territory) => {
    set(ownedTerritoriesAtom, (prev) => [...prev, territory]);
    set(allTerritoriesAtom, (prev) =>
      prev.map((t) => (t.id === territory.id ? territory : t))
    );
  }
);

export const removeTerritoryAtom = atom(
  null,
  (get, set, territoryId: string) => {
    set(ownedTerritoriesAtom, (prev) =>
      prev.filter((t) => t.id !== territoryId)
    );
    set(allTerritoriesAtom, (prev) =>
      prev.map((t) => (t.id === territoryId ? { ...t, owner: null } : t))
    );
  }
);

export const handleCellClickAtom = atom(
  null,
  (get, set, cell: { x: number; y: number }) => {
    const currentPlayer = get(currentPlayerAtom);
    const currentTurn = get(currentTurnAtom);

    if (!currentPlayer) {
      return;
    }

    const territoryId = `Cell-${Math.round(cell.x)}-${Math.round(cell.y)}`;

    set(allTerritoriesAtom, (prevTerritories) => {
      const existingTerritory = prevTerritories.find((t) => t.id === territoryId);

      if (existingTerritory) {
        if (existingTerritory.owner === currentPlayer.id) {
          return prevTerritories.map((t) =>
            t.id === territoryId ? { ...t, owner: null, turnCaptured: 0 } : t
          );
        } else {
          return prevTerritories.map((t) =>
            t.id === territoryId
              ? { ...t, owner: currentPlayer.id, turnCaptured: currentTurn }
              : t
          );
        }
      } else {
        return [
          ...prevTerritories,
          {
            id: territoryId,
            name: territoryId,
            owner: currentPlayer.id,
            turnCaptured: currentTurn,
          },
        ];
      }
    });

    set(ownedTerritoriesAtom, (prevOwned) => {
      const existingIndex = prevOwned.findIndex((t) => t.id === territoryId);
      if (existingIndex !== -1) {
        return prevOwned.filter((t) => t.id !== territoryId);
      } else {
        return [
          ...prevOwned,
          {
            id: territoryId,
            name: territoryId,
            owner: currentPlayer.id,
            turnCaptured: currentTurn,
          },
        ];
      }
    });
  }
);

export const goldBalanceAtom = atom(100); // Initial gold balance
export const soldiersAtom = atom(0);
export const populationAtom = atom(0);

export interface Card {
  id: string;
  name: string;
  description: string;
  count: number;
}

export const cardsAtom = atom<Card[]>([
  { id: '1', name: 'Attack', description: 'Increase attack power', count: 0 },
  { id: '2', name: 'Defense', description: 'Increase defense', count: 0 },
  { id: '3', name: 'Movement', description: 'Increase movement range', count: 0 },
]);

export const buyCardMultiplierAtom = atom(1);

export const buyResourcesAtom = atom(
  null,
  (get, set, { type, amount }: { type: 'soldiers' | 'population', amount: number }) => {
    const goldBalance = get(goldBalanceAtom);
    if (goldBalance >= amount) {
      set(goldBalanceAtom, goldBalance - amount);
      set(type === 'soldiers' ? soldiersAtom : populationAtom, (prev) => prev + amount);
    }
  }
);

export const buyCardAtom = atom(
  null,
  (get, set) => {
    const goldBalance = get(goldBalanceAtom);
    const multiplier = get(buyCardMultiplierAtom);
    const cardCost = 10 * multiplier;
    if (goldBalance >= cardCost) {
      set(goldBalanceAtom, goldBalance - cardCost);
      set(cardsAtom, (prevCards) => {
        const randomIndex = Math.floor(Math.random() * prevCards.length);
        return prevCards.map((card, index) => 
          index === randomIndex ? { ...card, count: card.count + multiplier } : card
        );
      });
    }
  }
);

export const useCardAtom = atom(
  null,
  (get, set, cardId: string) => {
    set(cardsAtom, (prevCards) => 
      prevCards.map(card => 
        card.id === cardId && card.count > 0 
          ? { ...card, count: card.count - 1 } 
          : card
      )
    );
    // Add logic for card effects here
  }
);
