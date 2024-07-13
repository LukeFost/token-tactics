// TerritoryTable.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Territory {
  id: string;
  name: string;
  owner: string | null;
  turnCaptured: number;
}

interface TerritoryTableProps {
  territories: Territory[];
  showAllTerritories?: boolean;
}

const TerritoryTable: React.FC<TerritoryTableProps> = ({ territories, showAllTerritories = false }) => {
  const displayedTerritories = showAllTerritories
    ? territories
    : territories.filter(territory => territory.owner !== '');

  return (
    <div className="h-[300px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 bg-background">Territory</TableHead>
            <TableHead className="sticky top-0 bg-background">Owner</TableHead>
            <TableHead className="sticky top-0 bg-background">Turn Captured</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedTerritories.map((territory) => (
            <TableRow key={territory.id}>
              <TableCell>{territory.name}</TableCell>
              <TableCell>{territory.owner || 'Unclaimed'}</TableCell>
              <TableCell>{territory.turnCaptured || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TerritoryTable;