// hooks/useProviderInstance.ts
import { useState, useEffect } from 'react';
import { createInstance } from '@/utils/instance';
import { JsonRpcProvider } from 'ethers';

export function useProviderInstance() {
  const [state, setState] = useState({
    provider: null as JsonRpcProvider | null,
    instance: null as any, // Update the type as per your instance type
    isInitialized: false,
  });

  useEffect(() => {
    async function init() {
      try {
        const { provider, instance } = await createInstance();
        setState({ provider, instance, isInitialized: true });
      } catch (error) {
        console.error('Failed to initialize provider and instance:', error);
      }
    }

    init();
  }, []);

  return state;
}
