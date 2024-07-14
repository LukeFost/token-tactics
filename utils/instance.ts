import { Signer, providers } from "ethers";
import { createInstance as fhevmCreateInstance } from 'fhevmjs';
import { ethers } from 'ethers';

let publicKey: string;
let chainId: number;

export const createInstance = async (
  contractAddress: string,
  provider: providers.Web3Provider,
  account: Signer
) => {
  if (!publicKey || !chainId) {
    const network = await provider.getNetwork();
    chainId = network.chainId;
    const ret = await provider.call({
      to: "0x000000000000000000000000000000000000005d",
      data: "0xd9d47bb001",
    });
    const decoded = ethers.utils.defaultAbiCoder.decode(["bytes"], ret);
    publicKey = decoded[0];
  }

  const instance = await fhevmCreateInstance({ chainId, publicKey });
  return instance;
};

const generateToken = async (
  contractAddress: string,
  account: Signer,
  instance: any
) => {
  // Generate token to decrypt
  const generatedToken = instance.generatePublicKey({
    verifyingContract: contractAddress,
  });

  // Use TypedDataEncoder for signing
  const signature = await account._signTypedData(
    generatedToken.eip712.domain,
    { Reencrypt: generatedToken.eip712.types.Reencrypt }, // Need to remove EIP712Domain from types
    generatedToken.eip712.message
  );
  instance.setSignature(contractAddress, signature);
};