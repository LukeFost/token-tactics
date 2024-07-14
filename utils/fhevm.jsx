// // fhevm.jsx
import { BrowserProvider, AbiCoder } from "ethers";
import { initFhevm, createInstance } from 'fhevmjs';

let provider;
let instance;

export const init = async () => {
  await initFhevm();
  if (typeof window !== 'undefined' && window.ethereum) {
    provider = new BrowserProvider(window.ethereum);
  } else {
    console.error("Window.ethereum is not available. Please make sure you're using a Web3-enabled browser.");
  }
};

export const createFhevmInstance = async () => {
  if (!provider) {
    await init();
  }
  
  const network = await provider.getNetwork();
  const chainId = network.chainId;
  
  const FHE_LIB_ADDRESS = '0x000000000000000000000000000000000000005d';
  const publicKey = await provider.call({
    to: FHE_LIB_ADDRESS,
    data: "0xd9d47bb001",
  });
  
  const decoded = AbiCoder.defaultAbiCoder().decode(["bytes"], publicKey);
  const decodedPublicKey = decoded[0];
  
  instance = await createInstance({ chainId, publicKey: decodedPublicKey });
  return instance;
};

export const getInstance = async () => {
  if (!instance) {
    await createFhevmInstance();
  }
  return instance;
};

export const getTokenSignature = async (contractAddress, userAddress, provider) => {
  if (!instance) {
    await getInstance();
  }

  const eip712Domain = {
    chainId: 9090,
    name: 'Authorization token',
    verifyingContract: contractAddress,
    version: '1',
  };

  const reencryption = instance.generatePublicKey(eip712Domain);

  const signature = await provider.signTypedData(
    reencryption.eip712.domain,
    {Reencrypt: reencryption.eip712.types.Reencrypt},
    reencryption.eip712.message
  )
  instance.setSignature(contractAddress, signature);

  const publicKey = instance.getPublicKey(contractAddress).publicKey;
  return { signature, publicKey };
};

export const getSignature = async (contractAddress, userAddress, chainId) => {
  if (!instance) {
    await getInstance();
  }
  if (instance.hasKeypair(contractAddress)) {
    return instance.getPublicKey(contractAddress);
  } else {
    const { publicKey, eip712 } = instance.generatePublicKey({
      chainId: chainId,
      name: "Authorization token",
      version: "1",
      verifyingContract: contractAddress
    });
    const params = [userAddress, JSON.stringify(eip712)];
    const signature = await window.ethereum.request({ method: 'eth_signTypedData_v4', params });
    instance.setSignature(contractAddress, signature);
    return { signature, publicKey };
  }
};
