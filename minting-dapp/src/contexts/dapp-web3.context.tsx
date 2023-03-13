import { ethers, BigNumber } from "ethers";
import React, { PropsWithChildren, createContext, useEffect } from "react";
import CollectionConfig from "../../../smart-contract/config/CollectionConfig";
import NetworkConfigInterface from "../../../smart-contract/lib/NetworkConfigInterface";
import NftContractType from "../scripts/lib/NftContractType";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";
import Whitelist from "../scripts/lib/Whitelist";

const ContractAbi = require("../../../smart-contract/artifacts/contracts/" +
  CollectionConfig.contractName +
  ".sol/" +
  CollectionConfig.contractName +
  ".json").abi;

interface State {
  userAddress: string | null;
  network: ethers.providers.Network | null;
  networkConfig: NetworkConfigInterface;
  totalSupply: number;
  maxSupply: number;
  maxMintAmountPerTx: number;
  tokenPrice: BigNumber;
  isPaused: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  merkleProofManualAddress: string;
  merkleProofManualAddressFeedbackMessage: string | JSX.Element | null;
  errorMessage: string | JSX.Element | null;
}

const defaultState: State = {
  userAddress: null,
  network: null,
  networkConfig: CollectionConfig.mainnet,
  totalSupply: 0,
  maxSupply: 0,
  maxMintAmountPerTx: 0,
  tokenPrice: BigNumber.from(0),
  isPaused: true,
  isWhitelistMintEnabled: false,
  isUserInWhitelist: false,
  merkleProofManualAddress: "",
  merkleProofManualAddressFeedbackMessage: null,
  errorMessage: null,
};

interface Props {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;

  provider: ethers.providers.Web3Provider | null;
  setProvider: React.Dispatch<
    React.SetStateAction<ethers.providers.Web3Provider | null>
  >;

  contract: NftContractType | null;
  setContract: React.Dispatch<React.SetStateAction<NftContractType | null>>;

  setError: (message?: any) => void;

  isNotMainnet: () => boolean;
  isSoldOut: () => boolean;
  isContractReady: () => boolean;
  isWalletConnected: () => boolean;

  initWallet: (
    browserProvider?: ethers.providers.Web3Provider | null
  ) => Promise<void>;
  connectWallet: () => Promise<void>;

  mintTokens: (amount: number) => Promise<void>;
  whitelistMintTokens: (amount: number) => Promise<void>;

  generateContractUrl: () => string;
  generateMarketplaceUrl: () => string;
}

export const DappWeb3Context = createContext<Props>({
  state: defaultState,
  setState: () => {},

  provider: null,
  setProvider: () => {},

  contract: null,
  setContract: () => {},

  setError: () => {},

  isNotMainnet: () => true,
  isSoldOut: () => true,
  isContractReady: () => false,
  isWalletConnected: () => false,

  initWallet: async () => {},
  connectWallet: async () => {},

  mintTokens: async () => {},
  whitelistMintTokens: async () => {},

  generateContractUrl: () => "",
  generateMarketplaceUrl: () => "",
});

export const useDappWeb3 = (): Props => {
  return React.useContext(DappWeb3Context);
};

export const DappWeb3Provider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [state, setState] = React.useState(defaultState);
  const [provider, setProvider] = React.useState<Web3Provider | null>(null);
  const [contract, setContract] = React.useState<NftContractType | null>(null);

  useEffect(() => {
    const init = async () => {
      const browserProvider =
        (await detectEthereumProvider()) as ExternalProvider;
      if (browserProvider) {
        if (browserProvider.isMetaMask) {
          const web3Provider = new Web3Provider(browserProvider);
          setProvider(web3Provider);
          registerWalletEvents(browserProvider);
          await initWallet(web3Provider);
        } else {
          setState({
            ...state,
            errorMessage: (
              <>
                We were not able to detect <strong>MetaMask</strong>. We value{" "}
                <strong>privacy and security</strong> a lot so we limit the
                wallet options on the DAPP.
                <br />
                <br />
                But don't worry! <span className="emoji">😃</span> You can
                always interact with the smart-contract through{" "}
                <a href={generateContractUrl()} target="_blank">
                  {state.networkConfig.blockExplorer.name}
                </a>{" "}
                and{" "}
                <strong>
                  we do our best to provide you with the best user experience
                  possible
                </strong>
                , even from there.
                <br />
                <br />
                You can also get your <strong>Whitelist Proof</strong> manually,
                using the tool below.
              </>
            ),
          });
        }
      }
    };

    init();
  }, []);

  const registerWalletEvents = (browserProvider: ExternalProvider) => {
    // @ts-ignore
    browserProvider.on("accountsChanged", () => {
      initWallet();
    });

    // @ts-ignore
    browserProvider.on("chainChanged", () => {
      window.location.reload();
    });
  };

  const initWallet = async (browserProvider?: Web3Provider | null) => {
    if (!browserProvider) {
      browserProvider = provider;
    }

    if (!browserProvider) {
      return;
    }

    const walletAccounts = await browserProvider.listAccounts();
    setState(defaultState);

    if (walletAccounts.length === 0) {
      return;
    }

    const network = await browserProvider.getNetwork();
    let networkConfig: NetworkConfigInterface;

    if (network.chainId === CollectionConfig.mainnet.chainId) {
      networkConfig = CollectionConfig.mainnet;
    } else if (network.chainId === CollectionConfig.testnet.chainId) {
      networkConfig = CollectionConfig.testnet;
    } else {
      setError("Unsupported network!");

      return;
    }

    setState((prev) => {
      return {
        ...prev,
        userAddress: walletAccounts[0],
        network,
        networkConfig,
      };
    });

    if (
      (await browserProvider.getCode(CollectionConfig.contractAddress!)) ===
      "0x"
    ) {
      setError(
        "Could not find the contract, are you connected to the right chain?"
      );

      return;
    }

    const newContract = new ethers.Contract(
      CollectionConfig.contractAddress!,
      ContractAbi,
      browserProvider.getSigner()
    ) as NftContractType;

    setContract(newContract);

    const newState = {
      maxSupply: (await newContract.maxSupply()).toNumber(),
      totalSupply: (await newContract.totalSupply()).toNumber(),
      maxMintAmountPerTx: (await newContract.maxMintAmountPerTx()).toNumber(),
      tokenPrice: await newContract.cost(),
      isPaused: await newContract.paused(),
      isWhitelistMintEnabled: await newContract.whitelistMintEnabled(),
      isUserInWhitelist: Whitelist.contains(state.userAddress ?? ""),
    };

    setState((prev) => {
      return {
        ...prev,
        ...newState,
      };
    });
  };

  const connectWallet = async () => {
    if (!provider) {
      return;
    }

    try {
      await provider.provider.request!({ method: "eth_requestAccounts" });
      initWallet();
    } catch (error) {
      setError(error);
    }
  };

  const mintTokens = async (amount: number) => {
    if (!contract) {
      return;
    }

    try {
      const tx = await contract.mint(amount, {
        value: state.tokenPrice.mul(amount),
      });

      await tx.wait();

      setState((prev) => {
        return {
          ...prev,
          totalSupply: prev.totalSupply + amount,
        };
      });
    } catch (error) {
      setError(error);
    }
  };

  const whitelistMintTokens = async (amount: number) => {
    if (!contract) {
      return;
    }

    try {
      const tx = await contract.whitelistMint(
        amount,
        Whitelist.getProofForAddress(state.userAddress!),
        {
          value: state.tokenPrice.mul(amount),
        }
      );

      await tx.wait();

      setState((prev) => {
        return {
          ...prev,
          totalSupply: prev.totalSupply + amount,
        };
      });
    } catch (error) {
      setError(error);
    }
  };

  const setError = (error: any = null) => {
    let errorMessage = "Unknown error...";

    if (null === error || typeof error === "string") {
      errorMessage = error;
    } else if (typeof error === "object") {
      // Support any type of error from the Web3 browserProvider...
      if (error?.error?.message !== undefined) {
        errorMessage = error.error.message;
      } else if (error?.data?.message !== undefined) {
        errorMessage = error.data.message;
      } else if (error?.message !== undefined) {
        errorMessage = error.message;
      } else if (React.isValidElement(error)) {
        setState((prev) => {
          return { ...prev, errorMessage: error };
        });

        return;
      }
    }

    setState((prev) => {
      return {
        ...prev,
        errorMessage:
          null === errorMessage
            ? null
            : errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
      };
    });
  };

  const generateContractUrl = () => {
    return state.networkConfig.blockExplorer.generateContractUrl(
      CollectionConfig.contractAddress!
    );
  };

  const generateMarketplaceUrl = () => {
    return CollectionConfig.marketplaceConfig.generateCollectionUrl(
      CollectionConfig.marketplaceIdentifier,
      !isNotMainnet()
    );
  };

  const isNotMainnet = () => {
    return state.networkConfig.chainId !== CollectionConfig.mainnet.chainId;
  };

  const isSoldOut = () => {
    return state.totalSupply >= state.maxSupply;
  };

  const isContractReady = () => {
    return contract !== null;
  };

  const isWalletConnected = () => {
    return state.userAddress !== null;
  };

  return (
    <DappWeb3Context.Provider
      value={{
        state,
        setState,
        provider,
        setProvider,
        contract,
        setContract,
        isNotMainnet,
        isSoldOut,
        isContractReady,
        setError,
        generateContractUrl,
        generateMarketplaceUrl,
        initWallet,
        isWalletConnected,
        connectWallet,
        mintTokens,
        whitelistMintTokens,
      }}
    >
      {children}
    </DappWeb3Context.Provider>
  );
};
