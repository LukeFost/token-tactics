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

export const nextTurnAtom = atom(
  null,
  (get, set) => {
    const players = get(playersAtom);
    const currentPlayer = get(currentPlayerAtom);
    const nextPlayerIndex = (players.indexOf(currentPlayer!) + 1) % players.length;
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
