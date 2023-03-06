import NetworkConfigInterface from "./NetworkConfigInterface";

export const ethereumTestnet: NetworkConfigInterface = {
  chainId: 5,
  blockExplorer: {
    name: "Etherscan",
    generateContractUrl: (contractAddress: string) =>
      `https://goerli.etherscan.io/address/${contractAddress}`,
  },
};

export const ethereumMainnet: NetworkConfigInterface = {
  chainId: 1,
  blockExplorer: {
    name: "Etherscan",
    generateContractUrl: (contractAddress: string) =>
      `https://etherscan.io/address/${contractAddress}`,
  },
};
