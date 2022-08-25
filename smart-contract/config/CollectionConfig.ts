import CollectionConfigInterface from '../lib/CollectionConfigInterface';
import { ethereumTestnet, ethereumMainnet } from '../lib/Networks';
import { openSea } from '../lib/Marketplaces';
import whitelistAddresses from './whitelist.json';

const CollectionConfig: CollectionConfigInterface = {
  testnet: ethereumTestnet,
  mainnet: ethereumMainnet,
  // The contract name can be updated using the following command:
  // yarn rename-contract NEW_CONTRACT_NAME
  // Please DO NOT change it manually!
  contractName: 'VHNAMETACARS',
  tokenName: 'VHNA Metacars',
  tokenSymbol: 'VHN',
  hiddenMetadataUri: 'ipfs://QmNSqmFAUsy72eEg84quuvWsSwXKzjm2B7iumJfCxgthjL/unrevealed.json',
  maxSupply: 1000,
  whitelistSale: {
    price: 0.05,
    maxMintAmountPerTx: 1,
  },
  preSale: {
    price: 0.07,
    maxMintAmountPerTx: 2,
  },
  publicSale: {
    price: 0.09,
    maxMintAmountPerTx: 5,
  },
  contractAddress: "0xe6eC1Cd35683FAf6f11f4f756389fa6121816f0F",
  marketplaceIdentifier: 'vahana',
  marketplaceConfig: openSea,
  whitelistAddresses: whitelistAddresses,
};

export default CollectionConfig;
