import React from 'react';
import { useAtom } from 'jotai';
import { goldBalanceAtom, populationAtom } from '@/atoms/gameAtoms';

const ResourceBar: React.FC = () => {
  const [goldBalance] = useAtom(goldBalanceAtom);
  const [population] = useAtom(populationAtom);

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-b-lg shadow-md z-50">
      <div className="flex space-x-4">
        <div>
          <span className="font-bold">Population:</span> {population}
        </div>
        <div>
          <span className="font-bold">Gold:</span> {goldBalance}
        </div>
      </div>
    </div>
  );
};

export default ResourceBar;
