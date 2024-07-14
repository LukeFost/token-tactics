"use client"
import { useEffect, useCallback, useState } from 'react';
import { Contract, ethers } from 'ethers';
import ThreeScene from "@/components/ThreeScene";
import GamePhaseButtons from "@/components/GamePhaseButtons";
import { LeftDrawer } from "@/components/LeftDrawer";
import { RightDrawer } from "@/components/RightDrawer";
import { GameProvider, useGame } from '@/contexts/GameContext';
import { riskABI, riskAddress } from '@/abi/riskABI';
import RecentGames from '@/components/RecentGames';
import { useEthersProvider } from '../hooks/ethers';
import { createInstance } from '@/utils/instance';
import { FhevmInstance } from 'fhevmjs';
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface PopulationMarkerData {
  lat: number;
  lon: number;
  population: number;
  cityName: string;
  connections: string[];
}

const INITIAL_POPULATION_MARKER_DATA: PopulationMarkerData[] = [
  { lat: 42.16, lon: -21.91, population: 0, cityName: '1', connections: ['2','3', '26'] },
  { lat: 65, lon: 100, population: 0, cityName: '2', connections: ['Phoenix', 'City4'] },
  { lat: 90, lon: 130, population: 0, cityName: '3', connections: ['Phoenix', 'City4'] },
  { lat: 45, lon: 145, population: 0, cityName: '4', connections: ['City2', 'City3'] },
  { lat: 42.16, lon: -21.91, population: 0, cityName: '5', connections: ['City2', 'City3'] },
  { lat: 65, lon: 100, population: 0, cityName: '6', connections: ['Phoenix', 'City4'] },
  { lat: 90, lon: 130, population: 0, cityName: '7', connections: ['Phoenix', 'City4'] },
  { lat: 45, lon: 145, population: 0, cityName: '8', connections: ['City2', 'City3'] },
];

const HomeContent = () => {
  console.log('Rendering HomeContent');
  const { handleCellClick, setPlayers, setAllTerritories } = useGame();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isTurn, setIsTurn] = useState(false);
  const [populationMarkerData, setPopulationMarkerData] = useState<PopulationMarkerData[]>(INITIAL_POPULATION_MARKER_DATA);
  const [currentGameID, setCurrentGameID] = useState(0n);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ethersProvider = useEthersProvider();

  useEffect(() => {
    console.log('Initializing Ethers');
    const initEthers = async () => {
      if (ethersProvider) {
        try {
          setProvider(ethersProvider);
          const signer = ethersProvider.getSigner();
          setSigner(signer);
          const address = await signer.getAddress();
          setAddress(address);
          const contract = new ethers.Contract(riskAddress, riskABI, signer);
          setContract(contract);
          console.log('Ethers initialized successfully');
          reencrypt()
        } catch (error) {
          console.error('Failed to initialize Ethers:', error);
          setError('Failed to initialize Ethereum connection. Please make sure MetaMask is installed and connected.');
        }
      } else {
        console.log('Ethereum provider not found, please install MetaMask');
        setError('Ethereum provider not found. Please install MetaMask.');
      }
    };

    initEthers();
  }, [ethersProvider]);

  const reencrypt = useCallback(async () => {
    console.log("Reencrypting...");
    try {
      if (!ethersProvider) {
        console.error('Ethers provider is not available');
        return;
      }
  
      const signer = ethersProvider.getSigner();
      console.log(signer, 'INSATNCE')
      const instance = await createInstance(riskAddress, ethersProvider, signer) as FhevmInstance
      const contract = new ethers.Contract(riskAddress, riskABI, signer);

      console.log(instance, 'INSATNCE')
      
      const token = instance.getPublicKey(riskAddress);
      if (!token || typeof token !== 'object' || !token.publicKey) {
        console.error('Failed to get public key');
        return;
      }
      console.log("Public Key:", token.publicKey);
  
      // Make sure currentGameID is set correctly before this point
      const encryptedBalance = await contract.viewBalance(
        currentGameID,
        token.publicKey,
        token.signature
      );
      
      // Decrypt the balance
      const balance = await instance.decrypt(riskAddress, encryptedBalance);
      console.log("Balance:", balance);
    } catch (e) {
      console.error("Error in reencrypt:", e);
    }
  }, [currentGameID, ethersProvider]);


  useEffect(() => {
    console.log('Initializing players');
    setPlayers([
      { id: '1', name: 'Player 1', color: '#ff0000' },
    ]);
  }, [setPlayers]);

  const getUserGames = useCallback(async () => {
    console.log('Fetching user games');
    if (contract && address) {
      try {
        setIsLoading(true);
        setError(null);
        const userGames = await contract.returnUserGames(address);
        console.log('Array of all user games:', userGames);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user games:', error);
        setError('Failed to fetch user games. Please try again.');
        setIsLoading(false);
      }
    } else {
      console.log('Contract or address not available for fetching user games');
    }
  }, [contract, address]);

  useEffect(() => {
    getUserGames();
  }, [getUserGames]);

  const handleStartGame = () => {
    console.log('Starting game');
    setIsGameStarted(true);
    setIsTurn(true);
  };

  const handleEndTurn = () => {
    console.log('Ending turn');
    setIsTurn(false);
    // Add logic to switch to next player's turn
  };

  const handleBuy = async () => {
    console.log('Attempting to buy');
    if (contract && signer) {
      try {
        setIsLoading(true);
        setError(null);
        // Example buy logic (replace with actual logic when implemented)
        const tx = await contract.buy(currentGameID);
        await tx.wait();
        console.log('Buy transaction successful');
        setIsLoading(false);
      } catch (error) {
        console.error('Error in buy transaction:', error);
        setError('Failed to complete buy transaction. Please try again.');
        setIsLoading(false);
      }
    } else {
      console.log('Contract or signer not available for buy transaction');
      setError('Unable to perform buy transaction. Please ensure you are connected to Ethereum.');
    }
  };
  

  const handleCards = () => {
    console.log('Handling cards');
    // Implement the logic for handling cards here
  };

  console.log('Rendering main content');
  return (
    <main className="min-h-screen bg-gray-100 overflow-hidden">
      <LeftDrawer />
      <RightDrawer />
      <ThreeScene 
        populationMarkerData={populationMarkerData}
      />
      <RecentGames isGameStarted={isGameStarted} />
      <GamePhaseButtons 
        isGameStarted={isGameStarted}
        isTurn={isTurn}
        onStartGame={handleStartGame}
        onEndTurn={handleEndTurn}
        onBuy={reencrypt}
        onCards={handleCards}
      />
      {isLoading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
    </main>
  );
};

export default function Home() {
  console.log('Rendering Home component');
  return (
    <GameProvider>
      <HomeContent />
    </GameProvider>
  );
}